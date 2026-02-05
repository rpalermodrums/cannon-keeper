import type Database from "better-sqlite3";

export type SearchResult = {
  chunkId: string;
  documentId: string;
  documentPath: string;
  ordinal: number;
  snippet: string;
  score: number;
};

export function searchChunks(
  db: Database.Database,
  query: string,
  limit = 8
): SearchResult[] {
  const stmt = db.prepare(
    `
    SELECT
      c.id as chunkId,
      c.document_id as documentId,
      d.path as documentPath,
      c.ordinal as ordinal,
      snippet(chunk_fts, 1, '[', ']', '...', 12) as snippet,
      bm25(chunk_fts) as score
    FROM chunk_fts
    JOIN chunk c ON c.id = chunk_fts.chunk_id
    JOIN document d ON d.id = c.document_id
    WHERE chunk_fts MATCH ?
    ORDER BY score
    LIMIT ?
  `
  );

  return stmt.all(query, limit) as SearchResult[];
}
