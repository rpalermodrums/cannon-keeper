import type Database from "better-sqlite3";
import crypto from "node:crypto";
import type { SceneRow } from "../../../../../packages/shared/types/persisted";

export type SceneInsert = Pick<
  SceneRow,
  | "project_id"
  | "document_id"
  | "ordinal"
  | "start_chunk_id"
  | "end_chunk_id"
  | "start_char"
  | "end_char"
  | "title"
>;

export type SceneSummary = SceneInsert & { id: string };

export function replaceScenesForDocument(
  db: Database.Database,
  documentId: string,
  scenes: SceneInsert[]
): SceneSummary[] {
  const now = Date.now();
  const deleteScenes = db.prepare("DELETE FROM scene WHERE document_id = ?");
  const deleteMeta = db.prepare(
    "DELETE FROM scene_metadata WHERE scene_id IN (SELECT id FROM scene WHERE document_id = ?)"
  );
  const deleteEntities = db.prepare(
    "DELETE FROM scene_entity WHERE scene_id IN (SELECT id FROM scene WHERE document_id = ?)"
  );

  const insertScene = db.prepare(
    "INSERT INTO scene (id, project_id, document_id, ordinal, start_chunk_id, end_chunk_id, start_char, end_char, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const insertMeta = db.prepare(
    "INSERT INTO scene_metadata (scene_id, pov_mode, pov_entity_id, pov_confidence, setting_entity_id, setting_text, setting_confidence, time_context_text, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const inserted: SceneSummary[] = [];

  const tx = db.transaction(() => {
    deleteEntities.run(documentId);
    deleteMeta.run(documentId);
    deleteScenes.run(documentId);

    for (const scene of scenes) {
      const id = crypto.randomUUID();
      insertScene.run(
        id,
        scene.project_id,
        scene.document_id,
        scene.ordinal,
        scene.start_chunk_id,
        scene.end_chunk_id,
        scene.start_char,
        scene.end_char,
        scene.title ?? null,
        now,
        now
      );
      insertMeta.run(
        id,
        "unknown",
        null,
        0,
        null,
        null,
        0,
        null,
        now,
        now
      );
      inserted.push({ ...scene, id });
    }
  });

  tx();
  return inserted;
}

export function listScenesForProject(db: Database.Database, projectId: string): SceneSummary[] {
  return db
    .prepare(
      "SELECT id, project_id, document_id, ordinal, start_chunk_id, end_chunk_id, start_char, end_char, title FROM scene WHERE project_id = ? ORDER BY document_id, ordinal"
    )
    .all(projectId) as SceneSummary[];
}
