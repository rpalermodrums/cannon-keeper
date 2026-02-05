import type { RpcRequest, RpcResponse, WorkerMethods } from "./rpc";
import { createProject, getProjectByRootPath, openDatabase, touchProject } from "./storage";
import type { DatabaseHandle } from "./storage";

export type WorkerStatus = {
  state: "idle" | "busy";
  lastJob?: string;
};

let status: WorkerStatus = { state: "idle" };
let dbHandle: DatabaseHandle | null = null;
let currentProjectId: string | null = null;

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
    return existing;
  }

  const created = createProject(handle.db, rootPath, name);
  currentProjectId = created.id;
  return created;
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
