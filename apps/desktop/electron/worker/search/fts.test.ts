import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { openDatabase, createProject, createDocument, insertChunks } from "../storage";
import { searchChunks, sanitizeQuery } from "./fts";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

describe("sanitizeQuery", () => {
  it("strips stopwords from a natural-language question", () => {
    const result = sanitizeQuery("What color are Lina's eyes?");
    expect(result).not.toMatch(/"What"/i);
    expect(result).not.toMatch(/"are"/i);
    expect(result).toMatch(/"color"/);
    expect(result).toMatch(/"Lina"/);
    expect(result).toMatch(/"eyes"/);
  });

  it("removes punctuation from tokens", () => {
    const result = sanitizeQuery("eyes? hello! world, test; done.");
    expect(result).not.toContain("?");
    expect(result).not.toContain("!");
    expect(result).not.toContain(",");
    expect(result).not.toContain(";");
    expect(result).not.toContain(".");
  });

  it("falls back to original tokens when all are stopwords", () => {
    const result = sanitizeQuery("is it the");
    expect(result).not.toBe("");
    expect(result).toContain('"');
  });

  it("supports OR join mode", () => {
    const result = sanitizeQuery("color eyes", "OR");
    expect(result).toBe('"color" OR "eyes"');
  });
});

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

  it("finds results via OR fallback when AND returns nothing", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);

    const doc = createDocument(setup.db, setup.projectId, path.join(setup.rootPath, "draft.md"), "md");
    insertChunks(setup.db, doc.id, [
      {
        document_id: doc.id,
        ordinal: 0,
        text: "Lina had bright green eyes that sparkled in the sunlight.",
        text_hash: "hash-eyes",
        start_char: 0,
        end_char: 57
      }
    ]);

    // A natural question that mixes stopwords with content words
    const results = searchChunks(setup.db, "What color are Lina's eyes?", 8, setup.projectId);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.text).toContain("eyes");
  });
});
