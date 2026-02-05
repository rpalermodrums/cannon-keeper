import type Database from "better-sqlite3";
import { clearIssuesByType, insertIssue, insertIssueEvidence, listEntities, listClaimsForEntity, listEvidenceForClaim } from "../storage";

function normalizeValue(valueJson: string): string {
  try {
    const value = JSON.parse(valueJson);
    if (typeof value === "string") return value.toLowerCase();
    if (typeof value === "number") return value.toString();
    return JSON.stringify(value);
  } catch {
    return valueJson;
  }
}

export function runContinuityChecks(db: Database.Database, projectId: string): void {
  clearIssuesByType(db, projectId, "continuity");

  const entities = listEntities(db, projectId);
  for (const entity of entities) {
    const claims = listClaimsForEntity(db, entity.id).filter((claim) =>
      ["inferred", "confirmed"].includes(claim.status)
    );

    const byField = new Map<string, typeof claims>();
    for (const claim of claims) {
      const list = byField.get(claim.field) ?? [];
      list.push(claim);
      byField.set(claim.field, list);
    }

    for (const [field, fieldClaims] of byField.entries()) {
      const evidenceClaims = fieldClaims.filter(
        (claim) => listEvidenceForClaim(db, claim.id).length > 0
      );
      if (evidenceClaims.length < 2) {
        continue;
      }
      const distinctValues = new Map<string, typeof evidenceClaims[number]>();
      for (const claim of evidenceClaims) {
        distinctValues.set(normalizeValue(claim.value_json), claim);
      }
      if (distinctValues.size < 2) {
        continue;
      }

      const claimsArray = Array.from(distinctValues.values());
      const confirmed = claimsArray.find((claim) => claim.status === "confirmed");
      const inferred = claimsArray.find((claim) => claim.status !== "confirmed");
      const issue = insertIssue(db, {
        projectId,
        type: "continuity",
        severity: confirmed && inferred ? "high" : "medium",
        title:
          confirmed && inferred
            ? `Draft conflicts with confirmed canon: ${entity.display_name} ${field}`
            : `Continuity conflict: ${entity.display_name} ${field}`,
        description:
          confirmed && inferred
            ? `Inferred value conflicts with confirmed canon for ${entity.display_name} (${field}).`
            : `Conflicting values detected for ${entity.display_name} (${field}).`
      });

      for (const claim of claimsArray.slice(0, 2)) {
        const evidence = listEvidenceForClaim(db, claim.id)[0];
        if (!evidence) continue;
        insertIssueEvidence(db, {
          issueId: issue.id,
          chunkId: evidence.chunk_id,
          quoteStart: evidence.quote_start,
          quoteEnd: evidence.quote_end
        });
      }
    }
  }
}
