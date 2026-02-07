import type Database from "better-sqlite3";
import { logEvent } from "../storage";

export type SearchResult = {
  chunkId: string;
  documentId: string;
  documentPath: string;
  ordinal: number;
  text: string;
  snippet: string;
  score: number;
};

const STOPWORDS = new Set([
  "what",
  "where",
  "when",
  "who",
  "how",
  "why",
  "is",
  "are",
  "was",
  "were",
  "the",
  "a",
  "an",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "and",
  "or",
  "but",
  "not",
  "it",
  "its",
  "this",
  "that",
  "do",
  "does",
  "did",
  "has",
  "have",
  "had",
  "will",
  "would",
  "could",
  "should",
  "can",
  "may"
]);

function stripPunctuation(token: string): string {
  return token
    .replace(/['\u2019][st]\b/gi, "")
    .replace(/[?!.,;:()[\]{}"']/g, "");
}

export function sanitizeQuery(query: string, join: "AND" | "OR" = "AND"): string {
  const rawTokens = query
    .split(/\s+/)
    .map((token) => stripPunctuation(token).trim())
    .filter(Boolean);
  if (rawTokens.length === 0) return "";

  const filtered = rawTokens.filter((t) => !STOPWORDS.has(t.toLowerCase()));
  const tokens = filtered.length > 0 ? filtered : rawTokens;
  return tokens.map((token) => `"${token}"`).join(` ${join} `);
}

export function searchChunks(
  db: Database.Database,
  query: string,
  limit = 8,
  projectId?: string
): SearchResult[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const sanitizedQuery = sanitizeQuery(trimmedQuery);
  const preferSanitized = /["']/.test(trimmedQuery);

  const attempts: string[] = [];
  const pushAttempt = (value: string): void => {
    if (!value || attempts.includes(value)) {
      return;
    }
    attempts.push(value);
  };

  const orQuery = sanitizeQuery(trimmedQuery, "OR");

  if (preferSanitized) {
    pushAttempt(sanitizedQuery);
    pushAttempt(trimmedQuery);
  } else {
    pushAttempt(trimmedQuery);
    pushAttempt(sanitizedQuery);
  }

  pushAttempt(orQuery);

  if (attempts.length === 0) {
    return [];
  }

  const stmt = db.prepare(
    `
    SELECT
      c.id as chunkId,
      c.document_id as documentId,
      d.path as documentPath,
      c.ordinal as ordinal,
      c.text as text,
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

  const failures: Array<{ query: string; message: string }> = [];

  for (const candidate of attempts) {
    try {
      const rows = stmt.all(candidate, limit) as SearchResult[];
      if (rows.length > 0) return rows;
    } catch (error) {
      failures.push({
        query: candidate,
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  if (projectId && failures.length > 0) {
    logEvent(db, {
      projectId,
      level: "warn",
      eventType: "fts_query_failed",
      payload: {
        attempts: failures
      }
    });
  }

  return [];
}
