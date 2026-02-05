import type { RpcRequest, RpcResponse, WorkerMethods } from "./rpc";
import {
  createProject,
  getProjectByRootPath,
  listDocuments,
  openDatabase,
  touchProject
} from "./storage";
import { ingestDocument } from "./pipeline/ingest";
import { JobQueue } from "./jobs/queue";
import type { IngestJob, IngestJobResult } from "./jobs/types";
import chokidar, { type FSWatcher } from "chokidar";
import type { DatabaseHandle } from "./storage";

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
  try {
    return await ingestDocument(dbHandle!.db, {
      projectId: job.payload.projectId,
      filePath: job.payload.filePath
    });
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
