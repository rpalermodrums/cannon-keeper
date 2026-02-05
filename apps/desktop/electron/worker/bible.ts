import type Database from "better-sqlite3";
import { getChunkById, getDocumentById, getEntityById, listClaimsForEntity, listEvidenceForClaim } from "./storage";

export type EntityDetail = {
  entity: ReturnType<typeof getEntityById>;
  claims: Array<{
    claim: ReturnType<typeof listClaimsForEntity>[number];
    value: unknown;
    evidence: Array<{
      chunkId: string;
      documentPath: string | null;
      chunkOrdinal: number | null;
      quoteStart: number;
      quoteEnd: number;
      excerpt: string;
    }>;
  }>;
};

function buildExcerpt(text: string, start: number, end: number): string {
  const context = 60;
  const prefixStart = Math.max(0, start - context);
  const suffixEnd = Math.min(text.length, end + context);
  const before = text.slice(prefixStart, start);
  const highlight = text.slice(start, end);
  const after = text.slice(end, suffixEnd);
  return `${prefixStart > 0 ? "…" : ""}${before}[${highlight}]${after}${suffixEnd < text.length ? "…" : ""}`;
}

export function getEntityDetail(db: Database.Database, entityId: string): EntityDetail | null {
  const entity = getEntityById(db, entityId);
  if (!entity) return null;

  const claims = listClaimsForEntity(db, entityId)
    .map((claim) => {
      const evidenceRows = listEvidenceForClaim(db, claim.id);
      const evidence = evidenceRows.map((row) => {
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

      if (evidence.length === 0 && claim.status !== "confirmed") {
        return null;
      }

      return {
        claim,
        value: JSON.parse(claim.value_json),
        evidence
      };
    })
    .filter((claim): claim is NonNullable<typeof claim> => Boolean(claim));

  return { entity, claims };
}
