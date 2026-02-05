import type Database from "better-sqlite3";
import {
  clearIssuesByType,
  insertIssue,
  insertIssueEvidence,
  listChunksForDocument,
  listDocuments,
  listScenesForProject,
  replaceStyleMetric,
  getOrCreateEntityByName
} from "../../storage";
import type { ChunkRecord } from "../../storage/chunkRepo";
import type { SceneSummary } from "../../storage/sceneRepo";
import { computeRepetitionMetrics } from "./repetition";
import { computeToneMetrics } from "./tone";
import { computeDialogueTics, extractDialogueLines, pickDialogueIssues } from "./dialogue";

const DRIFT_THRESHOLD = 2.5;

function buildChunkIndex(chunks: ChunkRecord[]): Map<string, ChunkRecord> {
  return new Map(chunks.map((chunk) => [chunk.id, chunk]));
}

function gatherProjectChunks(db: Database.Database, projectId: string): ChunkRecord[] {
  const documents = listDocuments(db, projectId);
  const chunks: ChunkRecord[] = [];
  for (const doc of documents) {
    chunks.push(...listChunksForDocument(db, doc.id));
  }
  return chunks;
}

function firstChunkForScene(scene: SceneSummary, chunkIndex: Map<string, ChunkRecord>): ChunkRecord | null {
  const startChunk = chunkIndex.get(scene.start_chunk_id);
  if (startChunk) {
    return startChunk;
  }
  return null;
}

export function runStyleMetrics(db: Database.Database, projectId: string): void {
  const chunks = gatherProjectChunks(db, projectId);
  const scenes = listScenesForProject(db, projectId);
  const chunkIndex = buildChunkIndex(chunks);

  clearIssuesByType(db, projectId, "repetition");
  clearIssuesByType(db, projectId, "tone_drift");
  clearIssuesByType(db, projectId, "dialogue_tic");

  const repetition = computeRepetitionMetrics(chunks, scenes);
  replaceStyleMetric(db, {
    projectId,
    scopeType: "project",
    scopeId: projectId,
    metricName: "ngram_freq",
    metricJson: JSON.stringify(repetition.metric)
  });

  for (const issue of repetition.issues) {
    const created = insertIssue(db, {
      projectId,
      type: "repetition",
      severity: "low",
      title: `Repetition detected: "${issue.ngram}"`,
      description: `Phrase appears ${issue.count} times across the project.`
    });
    insertIssueEvidence(db, {
      issueId: created.id,
      chunkId: issue.chunkId,
      quoteStart: issue.quoteStart,
      quoteEnd: issue.quoteEnd
    });
  }

  const toneMetrics = computeToneMetrics(scenes, chunks);
  for (const tone of toneMetrics) {
    replaceStyleMetric(db, {
      projectId,
      scopeType: "scene",
      scopeId: tone.sceneId,
      metricName: "tone_vector",
      metricJson: JSON.stringify(tone)
    });

    if (tone.driftScore >= DRIFT_THRESHOLD) {
      const scene = scenes.find((s) => s.id === tone.sceneId);
      const chunk = scene ? firstChunkForScene(scene, chunkIndex) : null;
      const created = insertIssue(db, {
        projectId,
        type: "tone_drift",
        severity: "medium",
        title: "Tone drift detected",
        description: `Drift score ${tone.driftScore.toFixed(2)} exceeds threshold.`
      });
      if (chunk) {
        const end = Math.min(chunk.text.length, 160);
        insertIssueEvidence(db, {
          issueId: created.id,
          chunkId: chunk.id,
          quoteStart: 0,
          quoteEnd: end
        });
      }
    }
  }

  const dialogueLines = extractDialogueLines(chunks);
  const tics = computeDialogueTics(dialogueLines);

  for (const tic of tics) {
    const entity = getOrCreateEntityByName(db, { projectId, name: tic.speaker, type: "character" });
    replaceStyleMetric(db, {
      projectId,
      scopeType: "entity",
      scopeId: entity.id,
      metricName: "dialogue_tics",
      metricJson: JSON.stringify(tic)
    });
  }

  const ticIssues = pickDialogueIssues(tics);
  for (const tic of ticIssues) {
    const created = insertIssue(db, {
      projectId,
      type: "dialogue_tic",
      severity: "low",
      title: tic.title,
      description: tic.description
    });
    for (const evidence of tic.evidence) {
      insertIssueEvidence(db, {
        issueId: created.id,
        chunkId: evidence.chunkId,
        quoteStart: evidence.quoteStart,
        quoteEnd: evidence.quoteEnd
      });
    }
  }
}
