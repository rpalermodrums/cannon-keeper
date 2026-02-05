import { describe, expect, it } from "vitest";
import { findExactSpan, findFuzzySpan } from "./spans";

describe("findExactSpan", () => {
  it("finds exact substring spans", () => {
    const haystack = "Mira stepped into the workshop.";
    const span = findExactSpan(haystack, "stepped into");
    expect(span).toEqual({ start: 5, end: 17 });
  });
});

describe("findFuzzySpan", () => {
  it("matches with flexible whitespace", () => {
    const haystack = "Mira\n\nstepped into the workshop.";
    const span = findFuzzySpan(haystack, "Mira stepped into");
    expect(span).not.toBeNull();
    expect(haystack.slice(span!.start, span!.end)).toContain("Mira");
  });

  it("falls back to token similarity", () => {
    const haystack = "The needle twitched north.";
    const span = findFuzzySpan(haystack, "needle twitch north");
    expect(span).not.toBeNull();
  });
});
