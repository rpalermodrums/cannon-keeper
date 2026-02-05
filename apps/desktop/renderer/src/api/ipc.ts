export type PingResponse = { ok: boolean };
export type ProjectSummary = {
  id: string;
  root_path: string;
  name: string;
  created_at: number;
  updated_at: number;
};

export type WorkerStatus = {
  state: "idle" | "busy";
  lastJob?: string;
  projectId?: string | null;
};

export async function ping(): Promise<PingResponse> {
  if (!window.canonkeeper) {
    return { ok: false };
  }
  return window.canonkeeper.ping();
}

export async function createOrOpenProject(payload: {
  rootPath: string;
  name?: string;
}): Promise<ProjectSummary> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.project.createOrOpen(payload);
}

export async function getWorkerStatus(): Promise<WorkerStatus> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.project.getStatus();
}
