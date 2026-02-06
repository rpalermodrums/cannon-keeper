import { useMemo, type JSX } from "react";
import type { EntityDetail, EntitySummary } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";
import { FilterBar, FilterGroup } from "../components/FilterBar";
import { StatusBadge } from "../components/StatusBadge";

type EntityFilters = {
  type: string;
  status: "all" | "confirmed" | "inferred";
  query: string;
};

type BibleViewProps = {
  busy: boolean;
  entities: EntitySummary[];
  selectedEntityId: string;
  entityDetail: EntityDetail | null;
  filters: EntityFilters;
  onFiltersChange: (next: EntityFilters) => void;
  onRefresh: () => void;
  onSelectEntity: (entityId: string) => void;
  onOpenEvidence: (title: string, detail: { evidence: EntityDetail["claims"][number]["evidence"] }) => void;
  onRequestConfirmClaim: (claim: {
    field: string;
    valueJson: string;
    sourceClaimId: string;
    evidenceCount: number;
  }) => void;
};

function groupByField(detail: EntityDetail | null): Array<{
  field: string;
  claims: EntityDetail["claims"];
}> {
  if (!detail) {
    return [];
  }
  const map = new Map<string, EntityDetail["claims"]>();
  for (const claim of detail.claims) {
    const group = map.get(claim.claim.field) ?? [];
    group.push(claim);
    map.set(claim.claim.field, group);
  }
  return Array.from(map.entries()).map(([field, claims]) => ({ field, claims }));
}

export function BibleView({
  busy,
  entities,
  selectedEntityId,
  entityDetail,
  filters,
  onFiltersChange,
  onRefresh,
  onSelectEntity,
  onOpenEvidence,
  onRequestConfirmClaim
}: BibleViewProps): JSX.Element {
  const types = Array.from(new Set(entities.map((entity) => entity.type))).sort();
  const filtered = entities.filter((entity) => {
    const typeMatch = !filters.type || entity.type === filters.type;
    const query = filters.query.trim().toLowerCase();
    const queryMatch = query.length === 0 || entity.display_name.toLowerCase().includes(query);
    if (!typeMatch || !queryMatch) {
      return false;
    }
    if (filters.status === "all" || !entityDetail || entity.id !== entityDetail.entity.id) {
      return true;
    }
    const hasConfirmed = entityDetail.claims.some((claim) => claim.claim.status === "confirmed");
    return filters.status === "confirmed" ? hasConfirmed : !hasConfirmed;
  });

  const groupedClaims = useMemo(() => groupByField(entityDetail), [entityDetail]);

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Book Bible</h2>
          <p className="page-subtitle">
            Evidence-backed claims grouped by field. Confirmed canon supersedes inferred values.
          </p>
        </div>
        <button className="primary" type="button" onClick={onRefresh} disabled={busy}>
          Refresh Entities
        </button>
      </header>

      <FilterBar>
        <FilterGroup label="Type">
          <select value={filters.type} onChange={(event) => onFiltersChange({ ...filters, type: event.target.value })}>
            <option value="">All</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Claim Status">
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({ ...filters, status: event.target.value as EntityFilters["status"] })
            }
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="inferred">Inferred only</option>
          </select>
        </FilterGroup>
        <FilterGroup label="Query">
          <input
            value={filters.query}
            onChange={(event) => onFiltersChange({ ...filters, query: event.target.value })}
            placeholder="Search entities"
          />
        </FilterGroup>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState title="No Entities" message="Run extraction or relax filters to see entities." />
      ) : (
        <div className="split">
          <article className="panel stack">
            <h3>Entities</h3>
            <ul className="list">
              {filtered.map((entity) => (
                <li
                  key={entity.id}
                  className={`list-item ${selectedEntityId === entity.id ? "active" : ""}`}
                  onClick={() => onSelectEntity(entity.id)}
                >
                  <strong>{entity.display_name}</strong>
                  <div className="metric-label">{entity.type}</div>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel stack">
            {!entityDetail ? (
              <EmptyState title="No Entity Selected" message="Select an entity to inspect grouped claims and evidence." />
            ) : groupedClaims.length === 0 ? (
              <EmptyState title="No Claims" message="This entity has no evidence-backed claims yet." />
            ) : (
              <>
                <h3>{entityDetail.entity.display_name}</h3>
                {groupedClaims.map((group) => (
                  <article className="card" key={group.field}>
                    <h3>{group.field}</h3>
                    <ul className="list">
                      {group.claims.map((claim) => (
                        <li key={claim.claim.id} className="list-item">
                          <div className="row" style={{ justifyContent: "space-between" }}>
                            <span className="mono">{claim.claim.value_json}</span>
                            <StatusBadge label={claim.claim.status} status={claim.claim.status} />
                          </div>
                          <div className="row" style={{ marginTop: 8 }}>
                            <button
                              type="button"
                              onClick={() => onOpenEvidence(`${group.field} claim`, claim)}
                              disabled={claim.evidence.length === 0}
                            >
                              Evidence ({claim.evidence.length})
                            </button>
                            {claim.claim.status !== "confirmed" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onRequestConfirmClaim({
                                    field: claim.claim.field,
                                    valueJson: claim.claim.value_json,
                                    sourceClaimId: claim.claim.id,
                                    evidenceCount: claim.evidence.length
                                  })
                                }
                                disabled={claim.evidence.length === 0}
                              >
                                Confirm
                              </button>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </>
            )}
          </article>
        </div>
      )}
    </section>
  );
}

export type { EntityFilters };
