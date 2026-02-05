BEGIN;

CREATE TABLE scene_evidence (
  id TEXT PRIMARY KEY,
  scene_id TEXT NOT NULL,
  chunk_id TEXT NOT NULL,
  quote_start INTEGER NOT NULL,
  quote_end INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY(scene_id) REFERENCES scene(id),
  FOREIGN KEY(chunk_id) REFERENCES chunk(id)
);

CREATE INDEX idx_scene_evidence_scene ON scene_evidence(scene_id);

COMMIT;
