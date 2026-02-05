import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDatabase, createProject, createDocument, insertChunks } from "../storage";
import { searchChunks } from "./fts";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

describe("searchChunks", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    tempRoots.length = 0;
  });

  it("falls back for malformed queries", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);

    const doc = createDocument(setup.db, setup.projectId, path.join(setup.rootPath, "draft.md"), "md");
    insertChunks(setup.db, doc.id, [
      {
        document_id: doc.id,
        ordinal: 0,
        text: "The compass pointed north.",
        text_hash: "hash",
        start_char: 0,
        end_char: 28
      }
    ]);

    expect(() => searchChunks(setup.db, "\"", 8, setup.projectId)).not.toThrow();
    const results = searchChunks(setup.db, "\"", 8, setup.projectId);
    expect(Array.isArray(results)).toBe(true);
  });
});
