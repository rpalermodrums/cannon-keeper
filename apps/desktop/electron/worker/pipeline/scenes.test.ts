import { describe, expect, it } from "vitest";
import { buildScenesFromChunks } from "./scenes";
import type { ChunkRecord } from "../storage/chunkRepo";

const baseChunk = (overrides: Partial<ChunkRecord>): ChunkRecord => ({
  id: overrides.id ?? "chunk",
  document_id: overrides.document_id ?? "doc",
  ordinal: overrides.ordinal ?? 0,
  text: overrides.text ?? "",
  text_hash: overrides.text_hash ?? "hash",
  start_char: overrides.start_char ?? 0,
  end_char: overrides.end_char ?? 0,
  created_at: overrides.created_at ?? 0,
  updated_at: overrides.updated_at ?? 0
});

describe("buildScenesFromChunks", () => {
  it("creates a new scene at explicit marker boundaries", () => {
    const chunks: ChunkRecord[] = [
      baseChunk({ id: "c1", ordinal: 0, text: "Intro text", start_char: 0, end_char: 10 }),
      baseChunk({
        id: "c2",
        ordinal: 1,
        text: "***\nNext scene text",
        start_char: 11,
        end_char: 30
      })
    ];

    const scenes = buildScenesFromChunks("proj", "doc", chunks);
    expect(scenes).toHaveLength(2);
    expect(scenes[0]?.start_chunk_id).toBe("c1");
    expect(scenes[0]?.end_chunk_id).toBe("c1");
    expect(scenes[1]?.start_chunk_id).toBe("c2");
    expect(scenes[1]?.end_chunk_id).toBe("c2");
  });

  it("uses heading text as scene title", () => {
    const chunks: ChunkRecord[] = [
      baseChunk({
        id: "c1",
        ordinal: 0,
        text: "# Prologue\nThe opening.",
        start_char: 0,
        end_char: 22
      })
    ];

    const scenes = buildScenesFromChunks("proj", "doc", chunks);
    expect(scenes).toHaveLength(1);
    expect(scenes[0]?.title).toBe("Prologue");
  });
});
