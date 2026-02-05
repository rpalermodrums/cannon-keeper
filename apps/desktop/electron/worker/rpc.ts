export type RpcRequest = {
  id: string;
  method: string;
  params?: unknown;
};

export type RpcResponse = {
  id: string;
  result?: unknown;
  error?: { message: string };
};

export type WorkerMethods =
  | "project.createOrOpen"
  | "project.getStatus"
  | "project.addDocument"
  | "search.ask";
