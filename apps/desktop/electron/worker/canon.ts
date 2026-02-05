import type Database from "better-sqlite3";
import { insertClaim, insertClaimEvidence, listEvidenceForClaim, supersedeClaims } from "./storage";

export function confirmClaim(
  db: Database.Database,
  args: { entityId: string; field: string; valueJson: string; sourceClaimId?: string }
): string {
  const claim = insertClaim(db, {
    entityId: args.entityId,
    field: args.field,
    valueJson: args.valueJson,
    status: "confirmed",
    confidence: 1
  });
  if (args.sourceClaimId) {
    const evidence = listEvidenceForClaim(db, args.sourceClaimId);
    for (const row of evidence) {
      insertClaimEvidence(db, {
        claimId: claim.id,
        chunkId: row.chunk_id,
        quoteStart: row.quote_start,
        quoteEnd: row.quote_end
      });
    }
  }
  supersedeClaims(db, args.entityId, args.field, claim.id);
  return claim.id;
}
