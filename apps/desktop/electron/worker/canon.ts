import type Database from "better-sqlite3";
import { insertClaim, supersedeClaims } from "./storage";

export function confirmClaim(
  db: Database.Database,
  args: { entityId: string; field: string; valueJson: string }
): string {
  const claim = insertClaim(db, {
    entityId: args.entityId,
    field: args.field,
    valueJson: args.valueJson,
    status: "confirmed",
    confidence: 1
  });
  supersedeClaims(db, args.entityId, args.field, claim.id);
  return claim.id;
}
