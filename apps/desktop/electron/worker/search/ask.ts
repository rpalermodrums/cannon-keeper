import type Database from "better-sqlite3";
import { searchChunks, type SearchResult } from "./fts";

export type AskCitation = { chunkId: string; quoteStart: number; quoteEnd: number };
export type CitedSnippet = SearchResult;

export type AskResult =
  | {
      kind: "answer";
      answer: string;
      confidence: number;
      citations: AskCitation[];
    }
  | {
      kind: "snippets";
      snippets: CitedSnippet[];
    }
  | {
      kind: "not_found";
      reason: string;
    };

const QUESTION_PREFIXES =
  /^(what|where|when|who|how|why|which|is|are|was|were|do|does|did|can|could|will|would|should|has|have|had|tell me about)\b\s*/i;

const ASK_STOPWORDS = new Set([
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

function extractKeyTerms(question: string): string {
  const stripped = question.replace(QUESTION_PREFIXES, "").replace(/[?!.,;:]/g, "");
  const terms = stripped
    .split(/\s+/)
    .map((t) => t.replace(/'[st]\b/gi, "").trim())
    .filter((t) => t.length >= 2 && !ASK_STOPWORDS.has(t.toLowerCase()));
  return terms.join(" ");
}

export async function askQuestion(
  db: Database.Database,
  args: { projectId: string; rootPath: string; question: string }
): Promise<AskResult> {
  void args.rootPath;

  const keyTerms = extractKeyTerms(args.question);
  const primaryQuery = keyTerms.length > 0 ? keyTerms : args.question;

  const snippets = searchChunks(db, primaryQuery, 8, args.projectId);
  if (snippets.length > 0) {
    return { kind: "snippets", snippets };
  }

  // Fallback: try the original question if key terms differed
  if (primaryQuery !== args.question) {
    const fallbackSnippets = searchChunks(db, args.question, 8, args.projectId);
    if (fallbackSnippets.length > 0) {
      return { kind: "snippets", snippets: fallbackSnippets };
    }
  }

  return {
    kind: "not_found",
    reason: "Answer not found in the indexed manuscript text."
  };
}
