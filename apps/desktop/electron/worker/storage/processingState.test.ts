import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDatabase, createProject, createDocument, upsertProcessingState, listProcessingStates } from "../storage";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

describe("processing state", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    tempRoots.length = 0;
  });

  it("upserts per-document stage state", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);

    const doc = createDocument(setup.db, setup.projectId, path.join(setup.rootPath, "draft.md"), "md");

    upsertProcessingState(setup.db, {
      documentId: doc.id,
      snapshotId: "snap-1",
      stage: "ingest",
      status: "pending"
    });

    upsertProcessingState(setup.db, {
      documentId: doc.id,
      snapshotId: "snap-2",
      stage: "ingest",
      status: "ok"
    });

    const states = listProcessingStates(setup.db, setup.projectId);
    expect(states.length).toBe(1);
    expect(states[0]?.snapshot_id).toBe("snap-2");
    expect(states[0]?.status).toBe("ok");
  });
});
