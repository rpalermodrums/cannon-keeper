import type { JSX } from "react";
import type { SceneDetail, SceneSummary } from "../api/ipc";
import { EmptyState } from "../components/EmptyState";

type ScenesViewProps = {
  busy: boolean;
  scenes: SceneSummary[];
  selectedSceneId: string;
  sceneDetail: SceneDetail | null;
  query: string;
  onQueryChange: (value: string) => void;
  onRefresh: () => void;
  onSelectScene: (sceneId: string) => void;
  onOpenEvidence: (title: string, sceneDetail: SceneDetail) => void;
};

function unknownReason(scene: SceneSummary): string {
  if (scene.pov_mode === "unknown") {
    return "POV heuristic found no first-person or explicit narrator marker.";
  }
  if (!scene.setting_text && !scene.setting_entity_id) {
    return "No setting entity matched scene text with deterministic rules.";
  }
  return "Evidence-backed classification available.";
}

export function ScenesView({
  busy,
  scenes,
  selectedSceneId,
  sceneDetail,
  query,
  onQueryChange,
  onRefresh,
  onSelectScene,
  onOpenEvidence
}: ScenesViewProps): JSX.Element {
  const filtered = scenes.filter((scene) => {
    const haystack = `${scene.ordinal} ${scene.title ?? ""} ${scene.pov_mode} ${scene.setting_text ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase().trim());
  });

  return (
    <section className="stack">
      <header className="page-header">
        <div>
          <h2 className="page-title">Scenes</h2>
          <p className="page-subtitle">Split view for scene index and deterministic metadata evidence.</p>
        </div>
        <div className="row">
          <button className="primary" type="button" onClick={onRefresh} disabled={busy}>
            Refresh Scenes
          </button>
        </div>
      </header>

      <label>
        Scene filter
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Filter by title, POV, setting" />
      </label>

      {filtered.length === 0 ? (
        <EmptyState
          title="No Scenes Yet"
          message="Run ingestion and scene stage first. Unknown metadata is still shown so you can triage gaps."
        />
      ) : (
        <div className="split">
          <article className="panel table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Scene</th>
                  <th>POV</th>
                  <th>Setting</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((scene) => (
                  <tr
                    key={scene.id}
                    style={{ cursor: "pointer", background: scene.id === selectedSceneId ? "rgba(15, 93, 93, 0.08)" : undefined }}
                    onClick={() => onSelectScene(scene.id)}
                  >
                    <td>
                      <strong>#{scene.ordinal}</strong> {scene.title ?? "Untitled"}
                      <div className="metric-label">{unknownReason(scene)}</div>
                    </td>
                    <td>{scene.pov_mode ?? "unknown"}</td>
                    <td>{scene.setting_text ?? "unknown"}</td>
                    <td>{scene.pov_mode === "unknown" ? "low" : "medium"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="panel stack">
            {!sceneDetail ? (
              <EmptyState
                title="No Scene Selected"
                message="Select a scene row to inspect chunk ranges and evidence-backed metadata."
              />
            ) : (
              <>
                <h3>
                  Scene {sceneDetail.scene.ordinal}: {sceneDetail.scene.title ?? "Untitled"}
                </h3>
                <p className="metric-label">
                  Range {sceneDetail.scene.start_char}-{sceneDetail.scene.end_char} | POV {sceneDetail.scene.pov_mode} | Setting{" "}
                  {sceneDetail.scene.setting_text ?? "unknown"}
                </p>
                <div className="row">
                  <button
                    type="button"
                    onClick={() => onOpenEvidence(`Scene ${sceneDetail.scene.ordinal}`, sceneDetail)}
                    disabled={sceneDetail.evidence.length === 0}
                  >
                    Open Evidence ({sceneDetail.evidence.length})
                  </button>
                </div>
                <ul className="list">
                  {sceneDetail.chunks.slice(0, 6).map((chunk) => (
                    <li key={chunk.id} className="list-item">
                      <div className="mono">
                        chunk {chunk.ordinal} | {chunk.start_char}-{chunk.end_char}
                      </div>
                      <div>{chunk.text.slice(0, 180)}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
