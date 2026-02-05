export type Span = { start: number; end: number };

function normalizeToken(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9']/g, "");
}

export function findExactSpan(haystack: string, needle: string): Span | null {
  if (!needle) return null;
  const idx = haystack.indexOf(needle);
  if (idx === -1) return null;
  return { start: idx, end: idx + needle.length };
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findFuzzySpan(haystack: string, needle: string): Span | null {
  if (!needle) return null;

  const exact = findExactSpan(haystack, needle);
  if (exact) return exact;

  const collapsedNeedle = needle.trim().replace(/\s+/g, " ");
  if (collapsedNeedle.length === 0) return null;

  const regexPattern = collapsedNeedle
    .split(/\s+/)
    .map((part) => escapeRegex(part))
    .join("\\s+");
  const regex = new RegExp(regexPattern, "u");
  const match = regex.exec(haystack);
  if (match && match.index >= 0) {
    return { start: match.index, end: match.index + match[0].length };
  }

  const needleTokens = collapsedNeedle.split(" ").map((token) => normalizeToken(token));
  const tokenCount = needleTokens.length;
  if (tokenCount === 0) return null;

  const haystackTokens: Array<{ token: string; start: number; end: number }> = [];
  const tokenRegex = /\S+/g;
  let tokenMatch: RegExpExecArray | null = null;
  while ((tokenMatch = tokenRegex.exec(haystack))) {
    haystackTokens.push({
      token: normalizeToken(tokenMatch[0]),
      start: tokenMatch.index,
      end: tokenMatch.index + tokenMatch[0].length
    });
  }

  let bestScore = 0;
  let bestSpan: Span | null = null;

  for (let i = 0; i <= haystackTokens.length - tokenCount; i += 1) {
    let matches = 0;
    for (let j = 0; j < tokenCount; j += 1) {
      const hay = haystackTokens[i + j]?.token;
      const nee = needleTokens[j];
      if (!hay || !nee) {
        continue;
      }
      if (hay === nee || hay.startsWith(nee) || nee.startsWith(hay)) {
        matches += 1;
      }
    }
    const score = matches / tokenCount;
    if (score > bestScore) {
      bestScore = score;
      const start = haystackTokens[i]?.start ?? 0;
      const end = haystackTokens[i + tokenCount - 1]?.end ?? start;
      bestSpan = { start, end };
    }
  }

  if (bestScore >= 0.75 && bestSpan) {
    return bestSpan;
  }

  return null;
}
