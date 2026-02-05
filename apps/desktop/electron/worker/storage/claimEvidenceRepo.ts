import type Database from "better-sqlite3";
import crypto from "node:crypto";

export function insertClaimEvidence(
  db: Database.Database,
  args: { claimId: string; chunkId: string; quoteStart: number; quoteEnd: number }
): void {
  db.prepare(
    "INSERT INTO claim_evidence (id, claim_id, chunk_id, quote_start, quote_end, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    crypto.randomUUID(),
    args.claimId,
    args.chunkId,
    args.quoteStart,
    args.quoteEnd,
    Date.now()
  );
}

export function listEvidenceForClaim(db: Database.Database, claimId: string): Array<{
  id: string;
  claim_id: string;
  chunk_id: string;
  quote_start: number;
  quote_end: number;
}> {
  return db
    .prepare(
      "SELECT id, claim_id, chunk_id, quote_start, quote_end FROM claim_evidence WHERE claim_id = ?"
    )
    .all(claimId) as Array<{
    id: string;
    claim_id: string;
    chunk_id: string;
    quote_start: number;
    quote_end: number;
  }>;
}
