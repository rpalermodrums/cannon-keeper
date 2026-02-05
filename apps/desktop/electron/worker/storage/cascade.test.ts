import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  openDatabase,
  createProject,
  createDocument,
  insertChunks,
  deleteChunksByIds,
  createEntity,
  insertClaim,
  insertClaimEvidence,
  insertIssue,
  insertIssueEvidence,
  replaceScenesForDocument,
  insertSceneEvidence
} from "../storage";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

describe("cascade cleanup", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    tempRoots.length = 0;
  });

  it("removes evidence rows when chunks are deleted", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);

    const doc = createDocument(setup.db, setup.projectId, path.join(setup.rootPath, "draft.md"), "md");
    const [chunk] = insertChunks(setup.db, doc.id, [
      {
        document_id: doc.id,
        ordinal: 0,
        text: "A quick brown fox.",
        text_hash: "hash",
        start_char: 0,
        end_char: 20
      }
    ]);
    if (!chunk) {
      throw new Error("Expected chunk to be inserted");
    }

    const entity = createEntity(setup.db, { projectId: setup.projectId, type: "character", displayName: "Mira" });
    const claim = insertClaim(setup.db, {
      entityId: entity.id,
      field: "description",
      valueJson: JSON.stringify("quick"),
      status: "inferred",
      confidence: 0.5
    });
    insertClaimEvidence(setup.db, {
      claimId: claim.id,
      chunkId: chunk.id,
      quoteStart: 0,
      quoteEnd: 5
    });

    const issue = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "repetition",
      severity: "low",
      title: "Test",
      description: "Test"
    });
    insertIssueEvidence(setup.db, {
      issueId: issue.id,
      chunkId: chunk.id,
      quoteStart: 0,
      quoteEnd: 5
    });

    replaceScenesForDocument(setup.db, doc.id, [
      {
        project_id: setup.projectId,
        document_id: doc.id,
        ordinal: 0,
        start_chunk_id: chunk.id,
        end_chunk_id: chunk.id,
        start_char: 0,
        end_char: 20,
        title: null
      }
    ]);
    const sceneId = setup.db
      .prepare("SELECT id FROM scene WHERE document_id = ? LIMIT 1")
      .get(doc.id) as { id: string };
    insertSceneEvidence(setup.db, {
      sceneId: sceneId.id,
      chunkId: chunk.id,
      quoteStart: 0,
      quoteEnd: 5
    });

    deleteChunksByIds(setup.db, [chunk.id]);

    const claimEvidenceCount = setup.db
      .prepare("SELECT COUNT(*) as count FROM claim_evidence WHERE chunk_id = ?")
      .get(chunk.id) as { count: number };
    const issueEvidenceCount = setup.db
      .prepare("SELECT COUNT(*) as count FROM issue_evidence WHERE chunk_id = ?")
      .get(chunk.id) as { count: number };
    const sceneEvidenceCount = setup.db
      .prepare("SELECT COUNT(*) as count FROM scene_evidence WHERE chunk_id = ?")
      .get(chunk.id) as { count: number };

    expect(claimEvidenceCount.count).toBe(0);
    expect(issueEvidenceCount.count).toBe(0);
    expect(sceneEvidenceCount.count).toBe(0);
  });
});
