import type Database from "better-sqlite3";
import { getChunkById, getDocumentById, getSceneById, listChunksForDocument, listSceneEvidence } from "./storage";

export type SceneDetail = {
  scene: NonNullable<ReturnType<typeof getSceneById>>;
  chunks: Array<{
    id: string;
    ordinal: number;
    text: string;
    start_char: number;
    end_char: number;
  }>;
  evidence: Array<{
    chunkId: string;
    documentPath: string | null;
    chunkOrdinal: number | null;
    quoteStart: number;
    quoteEnd: number;
    excerpt: string;
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
    return { scene, chunks: [], evidence: [] };
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

  const evidence = listSceneEvidence(db, sceneId).map((row) => {
    const chunk = getChunkById(db, row.chunk_id);
    const doc = chunk ? getDocumentById(db, chunk.document_id) : null;
    const excerpt = chunk ? buildExcerpt(chunk.text, row.quote_start, row.quote_end) : "";
    return {
      chunkId: row.chunk_id,
      documentPath: doc?.path ?? null,
      chunkOrdinal: chunk?.ordinal ?? null,
      quoteStart: row.quote_start,
      quoteEnd: row.quote_end,
      excerpt
    };
  });

  return { scene, chunks: sceneChunks, evidence };
}

function buildExcerpt(text: string, start: number, end: number): string {
  const context = 60;
  const prefixStart = Math.max(0, start - context);
  const suffixEnd = Math.min(text.length, end + context);
  const before = text.slice(prefixStart, start);
  const highlight = text.slice(start, end);
  const after = text.slice(end, suffixEnd);
  return `${prefixStart > 0 ? "…" : ""}${before}[${highlight}]${after}${suffixEnd < text.length ? "…" : ""}`;
}
