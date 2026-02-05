import { describe, expect, it } from "vitest";
import { buildChunks } from "./chunking";

const sample = "# Heading\n\nFirst paragraph line one.\nSecond line.\n\nSecond paragraph here.";

describe("buildChunks", () => {
  it("is deterministic for the same input", () => {
    const first = buildChunks(sample);
    const second = buildChunks(sample);
    expect(first).toEqual(second);
  });

  it("produces chunks that match slice boundaries", () => {
    const chunks = buildChunks(sample);
    for (const chunk of chunks) {
      expect(sample.slice(chunk.start, chunk.end)).toBe(chunk.text);
    }
  });
});
