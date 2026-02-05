import type { ChunkRecord } from "../storage/chunkRepo";
import type { SceneInsert } from "../storage/sceneRepo";

export type SceneBoundary = {
  ordinal: number;
  title: string | null;
};

const HEADING = /^\s*#{1,6}\s+(.+)$/;
const CHAPTER = /^\s*chapter\b\s*(.*)$/i;
const MARKER = /^\s*(\*\s*\*\s*\*|---+)\s*$/;

function normalizeTitle(raw: string): string | null {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function detectBoundaries(chunks: ChunkRecord[]): SceneBoundary[] {
  const boundaryMap = new Map<number, string | null>();

  for (const chunk of chunks) {
    const lines = chunk.text.split("\n");
    for (const line of lines) {
      const headingMatch = line.match(HEADING);
      if (headingMatch) {
        boundaryMap.set(chunk.ordinal, normalizeTitle(headingMatch[1] ?? ""));
        break;
      }
      const chapterMatch = line.match(CHAPTER);
      if (chapterMatch) {
        boundaryMap.set(chunk.ordinal, normalizeTitle(chapterMatch[1] ?? line));
        break;
      }
      if (MARKER.test(line)) {
        if (!boundaryMap.has(chunk.ordinal)) {
          boundaryMap.set(chunk.ordinal, null);
        }
      }
    }
  }

  return Array.from(boundaryMap.entries())
    .map(([ordinal, title]) => ({ ordinal, title }))
    .sort((a, b) => a.ordinal - b.ordinal);
}

export function buildScenesFromChunks(
  projectId: string,
  documentId: string,
  chunks: ChunkRecord[]
): SceneInsert[] {
  if (chunks.length === 0) {
    return [];
  }

  const boundaries = detectBoundaries(chunks);
  const boundaryTitles = new Map(boundaries.map((b) => [b.ordinal, b.title]));
  const boundaryOrdinals = boundaries.map((b) => b.ordinal).filter((o) => o > 0);

  let startOrdinal = 0;
  let currentTitle = boundaryTitles.get(0) ?? null;
  const scenes: SceneInsert[] = [];

  for (const boundary of boundaryOrdinals) {
    if (boundary <= startOrdinal) {
      continue;
    }
    const startChunk = chunks[startOrdinal];
    const endChunk = chunks[boundary - 1];
    if (!startChunk || !endChunk) {
      continue;
    }
    scenes.push({
      project_id: projectId,
      document_id: documentId,
      ordinal: scenes.length,
      start_chunk_id: startChunk.id,
      end_chunk_id: endChunk.id,
      start_char: startChunk.start_char,
      end_char: endChunk.end_char,
      title: currentTitle
    });

    startOrdinal = boundary;
    currentTitle = boundaryTitles.get(boundary) ?? null;
  }

  const finalStart = chunks[startOrdinal];
  const finalEnd = chunks[chunks.length - 1];
  if (finalStart && finalEnd) {
    scenes.push({
      project_id: projectId,
      document_id: documentId,
      ordinal: scenes.length,
      start_chunk_id: finalStart.id,
      end_chunk_id: finalEnd.id,
      start_char: finalStart.start_char,
      end_char: finalEnd.end_char,
      title: currentTitle
    });
  }

  return scenes;
}
