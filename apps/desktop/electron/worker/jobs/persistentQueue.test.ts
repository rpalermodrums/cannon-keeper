import { afterEach, describe, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDatabase, createProject } from "../storage";
import { PersistentJobQueue } from "./persistentQueue";
import type { WorkerJob, WorkerJobResult } from "./types";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

async function waitFor(condition: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (condition()) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error("Condition not met in time");
}

describe("PersistentJobQueue", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    tempRoots.length = 0;
  });

  it("requeues updates while running", async () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);

    let release: () => void = () => undefined;
    let runCount = 0;

    const queue = new PersistentJobQueue<WorkerJob, WorkerJobResult>(setup.db, async (_job) => {
      runCount += 1;
      if (runCount === 1) {
        await new Promise<void>((resolve) => {
          release = () => resolve();
        });
      }
      return { ok: true };
    });

    queue.start();

    const job: WorkerJob = {
      type: "INGEST_DOCUMENT",
      payload: { projectId: setup.projectId, filePath: path.join(setup.rootPath, "draft.md") }
    };

    queue.enqueue(job, `ingest:${setup.projectId}:draft`, true);
    await waitFor(() => runCount === 1);

    queue.enqueue(
      { type: "INGEST_DOCUMENT", payload: { projectId: setup.projectId, filePath: "draft2.md" } },
      `ingest:${setup.projectId}:draft`
    );

    release();

    await waitFor(() => runCount === 2);
  });
});
