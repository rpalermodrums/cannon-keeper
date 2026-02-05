import { fork, type ChildProcess } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import fs from "node:fs";
import type { RpcRequest, RpcResponse, WorkerMethods } from "./rpc";

export class WorkerClient {
  private child: ChildProcess;
  private pending = new Map<string, (response: RpcResponse) => void>();

  constructor() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const workerJsPath = path.join(__dirname, "worker.js");
    const workerTsPath = path.join(__dirname, "worker.ts");

    const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);
    if (isDev && fs.existsSync(workerTsPath)) {
      const tsxPath = path.join(process.cwd(), "node_modules", ".bin", "tsx");
      if (!fs.existsSync(tsxPath)) {
        throw new Error("tsx runtime not found for dev worker");
      }
      this.child = fork(workerTsPath, [], {
        stdio: ["pipe", "pipe", "pipe", "ipc"],
        execPath: tsxPath
      });
    } else {
      if (!fs.existsSync(workerJsPath)) {
        throw new Error(`Worker build not found at ${workerJsPath}`);
      }
      this.child = fork(workerJsPath, { stdio: ["pipe", "pipe", "pipe", "ipc"] });
    }
    this.child.on("message", (message: RpcResponse) => {
      if (!message || typeof message !== "object") {
        return;
      }
      const handler = this.pending.get(message.id);
      if (handler) {
        handler(message);
        this.pending.delete(message.id);
      }
    });
  }

  async request<T>(method: WorkerMethods, params?: unknown): Promise<T> {
    const id = crypto.randomUUID();
    const payload: RpcRequest = { id, method, params };
    const response = await new Promise<RpcResponse>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Worker request timed out: ${method}`));
      }, 30_000);

      this.pending.set(id, (resp) => {
        clearTimeout(timeout);
        resolve(resp);
      });

      if (!this.child.send) {
        clearTimeout(timeout);
        this.pending.delete(id);
        reject(new Error("Worker IPC not available"));
        return;
      }

      this.child.send(payload);
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.result as T;
  }
}
