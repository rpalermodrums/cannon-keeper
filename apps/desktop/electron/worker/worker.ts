import type { RpcRequest, RpcResponse, WorkerMethods } from "./rpc";
import {
  createProject,
  getProjectByRootPath,
  listEntities,
  listDocuments,
  listIssuesWithEvidence,
  listScenesForProject,
  openDatabase,
  dismissIssue,
  touchProject,
  logEvent
} from "./storage";
import { ingestDocument } from "./pipeline/ingest";
import { JobQueue } from "./jobs/queue";
import type { IngestJob, IngestJobResult } from "./jobs/types";
import chokidar, { type FSWatcher } from "chokidar";
import { searchChunks } from "./search/fts";
import { askQuestion } from "./search/ask";
import { getStyleReport } from "./style/report";
import { getEntityDetail } from "./bible";
import { confirmClaim } from "./canon";
import { exportProject } from "./export/exporter";
import type { DatabaseHandle } from "./storage";
import { getSceneDetail } from "./scenes";

export type WorkerStatus = {
  state: "idle" | "busy";
  lastJob?: string;
};

let status: WorkerStatus = { state: "idle" };
let dbHandle: DatabaseHandle | null = null;
let currentProjectId: string | null = null;
let currentProjectRoot: string | null = null;
let watcher: FSWatcher | null = null;
const debounceTimers = new Map<string, NodeJS.Timeout>();
const ingestQueue = new JobQueue<IngestJob, IngestJobResult>(async (job) => {
  setStatus({ state: "busy", lastJob: job.type });
  if (dbHandle) {
    logEvent(dbHandle.db, {
      projectId: job.payload.projectId,
      level: "info",
      eventType: "job_started",
      payload: { type: job.type, filePath: job.payload.filePath }
    });
  }
  try {
    const result = await ingestDocument(dbHandle!.db, {
      projectId: job.payload.projectId,
      rootPath: currentProjectRoot ?? "",
      filePath: job.payload.filePath
    });
    if (dbHandle) {
      logEvent(dbHandle.db, {
        projectId: job.payload.projectId,
        level: "info",
        eventType: "job_finished",
        payload: { type: job.type, filePath: job.payload.filePath }
      });
    }
    return result;
  } catch (error) {
    if (dbHandle) {
      logEvent(dbHandle.db, {
        projectId: job.payload.projectId,
        level: "error",
        eventType: "job_failed",
        payload: {
          type: job.type,
          filePath: job.payload.filePath,
          message: error instanceof Error ? error.message : "Unknown error"
        }
      });
    }
    throw error;
  } finally {
    setStatus({ state: "idle", lastJob: job.type });
  }
});

function setStatus(next: WorkerStatus): void {
  status = next;
}

function getStatus(): WorkerStatus {
  return status;
}

function ensureDb(rootPath: string): DatabaseHandle {
  if (dbHandle) {
    return dbHandle;
  }
  dbHandle = openDatabase({ rootPath });
  return dbHandle;
}

function handleCreateOrOpen(params: { rootPath: string; name?: string }): unknown {
  const { rootPath, name } = params;
  const handle = ensureDb(rootPath);
  const existing = getProjectByRootPath(handle.db, rootPath);
  if (existing) {
    touchProject(handle.db, existing.id);
    currentProjectId = existing.id;
    currentProjectRoot = rootPath;
    ensureWatcher(handle.db, existing.id);
    return existing;
  }

  const created = createProject(handle.db, rootPath, name);
  currentProjectId = created.id;
  currentProjectRoot = rootPath;
  ensureWatcher(handle.db, created.id);
  return created;
}

function ensureWatcher(db: DatabaseHandle["db"], projectId: string): void {
  if (!watcher) {
    watcher = chokidar.watch([], { ignoreInitial: true });
    watcher.on("change", (filePath) => scheduleIngest(filePath, projectId));
  }

  const documents = listDocuments(db, projectId);
  for (const doc of documents) {
    watcher.add(doc.path);
  }
}

function scheduleIngest(filePath: string, projectId: string): void {
  if (dbHandle) {
    logEvent(dbHandle.db, {
      projectId,
      level: "info",
      eventType: "file_changed",
      payload: { filePath }
    });
  }
  const existingTimer = debounceTimers.get(filePath);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }
  const timer = setTimeout(() => {
    debounceTimers.delete(filePath);
    enqueueIngest(filePath, projectId);
  }, 2000);
  debounceTimers.set(filePath, timer);
}

function enqueueIngest(filePath: string, projectId: string): Promise<IngestJobResult> {
  const job: IngestJob = { type: "INGEST_DOCUMENT", payload: { projectId, filePath } };
  return ingestQueue.enqueue(job, `${projectId}:${filePath}`);
}

async function dispatch(method: WorkerMethods, params?: unknown): Promise<unknown> {
  switch (method) {
    case "project.createOrOpen":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for project.createOrOpen");
      }
      return handleCreateOrOpen(params as { rootPath: string; name?: string });
    case "project.getStatus":
      return { ...getStatus(), projectId: currentProjectId };
    case "project.addDocument":
      {
        if (!params || typeof params !== "object") {
          throw new Error("Missing params for project.addDocument");
        }
        if (!dbHandle || !currentProjectId || !currentProjectRoot) {
          throw new Error("Project not initialized");
        }
        if (!watcher) {
          ensureWatcher(dbHandle.db, currentProjectId);
        }
        const filePath = (params as { path: string }).path;
        watcher?.add(filePath);
        return enqueueIngest(filePath, currentProjectId);
      }
    case "search.query":
      {
        if (!params || typeof params !== "object") {
          throw new Error("Missing params for search.query");
        }
        if (!dbHandle || !currentProjectId) {
          throw new Error("Project not initialized");
        }
        return {
          query: (params as { query: string }).query,
          results: searchChunks(dbHandle.db, (params as { query: string }).query)
        };
      }
    case "search.ask":
      {
        if (!params || typeof params !== "object") {
          throw new Error("Missing params for search.ask");
        }
        if (!dbHandle || !currentProjectId || !currentProjectRoot) {
          throw new Error("Project not initialized");
        }
        return askQuestion(dbHandle.db, {
          projectId: currentProjectId,
          rootPath: currentProjectRoot,
          question: (params as { question: string }).question
        });
      }
    case "scenes.list":
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      return listScenesForProject(dbHandle.db, currentProjectId);
    case "scenes.get":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for scenes.get");
      }
      if (!dbHandle) {
        throw new Error("Project not initialized");
      }
      return getSceneDetail(dbHandle.db, (params as { sceneId: string }).sceneId);
    case "issues.list":
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      return listIssuesWithEvidence(dbHandle.db, currentProjectId);
    case "issues.dismiss":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for issues.dismiss");
      }
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      dismissIssue(dbHandle.db, (params as { issueId: string }).issueId);
      return { ok: true };
    case "style.getReport":
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      return getStyleReport(dbHandle.db, currentProjectId);
    case "bible.listEntities":
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      return listEntities(dbHandle.db, currentProjectId);
    case "bible.getEntity":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for bible.getEntity");
      }
      if (!dbHandle) {
        throw new Error("Project not initialized");
      }
      return getEntityDetail(dbHandle.db, (params as { entityId: string }).entityId);
    case "canon.confirmClaim":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for canon.confirmClaim");
      }
      if (!dbHandle) {
        throw new Error("Project not initialized");
      }
      return confirmClaim(dbHandle.db, params as { entityId: string; field: string; valueJson: string });
    case "export.run":
      if (!params || typeof params !== "object") {
        throw new Error("Missing params for export.run");
      }
      if (!dbHandle || !currentProjectId) {
        throw new Error("Project not initialized");
      }
      exportProject(dbHandle.db, currentProjectId, (params as { outDir: string }).outDir);
      return { ok: true };
    default:
      throw new Error(`Unknown method: ${method}`);
  }
}

process.on("message", async (message: RpcRequest) => {
  if (!message || typeof message !== "object") {
    return;
  }

  const { id, method, params } = message;
  if (!id || !method) {
    return;
  }

  const response: RpcResponse = { id };

  try {
    setStatus({ state: "busy", lastJob: method });
    response.result = await dispatch(method as WorkerMethods, params);
    setStatus({ state: "idle", lastJob: method });
  } catch (error) {
    setStatus({ state: "idle", lastJob: method });
    response.error = { message: error instanceof Error ? error.message : "Unknown error" };
  }

  if (process.send) {
    process.send(response);
  }
});
