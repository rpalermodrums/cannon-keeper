import type Database from "better-sqlite3";
import { getSceneById, listChunksForDocument } from "./storage";

export type SceneDetail = {
  scene: NonNullable<ReturnType<typeof getSceneById>>;
  chunks: Array<{
    id: string;
    ordinal: number;
    text: string;
    start_char: number;
    end_char: number;
  }>;
};

export function getSceneDetail(db: Database.Database, sceneId: string): SceneDetail | null {
  const scene = getSceneById(db, sceneId);
  if (!scene) return null;

  const chunks = listChunksForDocument(db, scene.document_id);
  const ordinalMap = new Map(chunks.map((chunk) => [chunk.id, chunk.ordinal]));
  const startOrdinal = ordinalMap.get(scene.start_chunk_id);
  const endOrdinal = ordinalMap.get(scene.end_chunk_id);

  if (startOrdinal === undefined || endOrdinal === undefined) {
    return { scene, chunks: [] };
  }

  const sceneChunks = chunks
    .filter((chunk) => chunk.ordinal >= startOrdinal && chunk.ordinal <= endOrdinal)
    .map((chunk) => ({
      id: chunk.id,
      ordinal: chunk.ordinal,
      text: chunk.text,
      start_char: chunk.start_char,
      end_char: chunk.end_char
    }));

  return { scene, chunks: sceneChunks };
}
