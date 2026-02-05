import type Database from "better-sqlite3";
import crypto from "node:crypto";
import type { ClaimRow, ClaimStatus } from "../../../../../packages/shared/types/persisted";

export type ClaimSummary = ClaimRow;

export function listClaimsForEntity(db: Database.Database, entityId: string): ClaimSummary[] {
  return db
    .prepare(
      "SELECT id, entity_id, field, value_json, status, confidence, created_at, updated_at, supersedes_claim_id FROM claim WHERE entity_id = ? ORDER BY created_at DESC"
    )
    .all(entityId) as ClaimSummary[];
}

export function insertClaim(
  db: Database.Database,
  args: {
    entityId: string;
    field: string;
    valueJson: string;
    status: ClaimStatus;
    confidence: number;
    supersedesClaimId?: string | null;
  }
): ClaimSummary {
  const now = Date.now();
  const claim: ClaimSummary = {
    id: crypto.randomUUID(),
    entity_id: args.entityId,
    field: args.field,
    value_json: args.valueJson,
    status: args.status,
    confidence: args.confidence,
    created_at: now,
    updated_at: now,
    supersedes_claim_id: args.supersedesClaimId ?? null
  };

  db.prepare(
    "INSERT INTO claim (id, entity_id, field, value_json, status, confidence, created_at, updated_at, supersedes_claim_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    claim.id,
    claim.entity_id,
    claim.field,
    claim.value_json,
    claim.status,
    claim.confidence,
    claim.created_at,
    claim.updated_at,
    claim.supersedes_claim_id
  );

  return claim;
}

export function supersedeClaims(
  db: Database.Database,
  entityId: string,
  field: string,
  supersedingClaimId: string
): void {
  db.prepare(
    "UPDATE claim SET status = ?, supersedes_claim_id = ?, updated_at = ? WHERE entity_id = ? AND field = ? AND id != ? AND status = 'inferred'"
  ).run("superseded", supersedingClaimId, Date.now(), entityId, field, supersedingClaimId);
}

export function listClaimsByField(
  db: Database.Database,
  entityId: string,
  field: string
): ClaimSummary[] {
  return db
    .prepare(
      "SELECT id, entity_id, field, value_json, status, confidence, created_at, updated_at, supersedes_claim_id FROM claim WHERE entity_id = ? AND field = ?"
    )
    .all(entityId, field) as ClaimSummary[];
}
