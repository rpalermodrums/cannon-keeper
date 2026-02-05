import type { ChunkRecord } from "../../storage/chunkRepo";
export type DialogueLine = {
  chunkId: string;
  text: string;
  quoteStart: number;
  quoteEnd: number;
  speaker: string | null;
};

export type DialogueTic = {
  speaker: string;
  totalLines: number;
  starters: Array<{ phrase: string; count: number }>;
  fillers: Array<{ filler: string; count: number }>;
  ellipsesCount: number;
  dashCount: number;
  examples: Array<{ chunkId: string; quoteStart: number; quoteEnd: number }>;
};

const SPEAKER_VERBS = [
  "said",
  "asked",
  "whispered",
  "replied",
  "muttered",
  "shouted",
  "called",
  "yelled",
  "cried",
  "answered"
];

const FILLERS = ["well", "look", "listen", "like", "you know", "okay"];

function findSpeaker(text: string, quoteStart: number, quoteEnd: number): string | null {
  const windowStart = Math.max(0, quoteStart - 80);
  const windowEnd = Math.min(text.length, quoteEnd + 80);
  const context = text.slice(windowStart, windowEnd);

  const namePattern = "[A-Z][a-z]+(?:\\s+[A-Z][a-z]+)*";
  const verbs = SPEAKER_VERBS.join("|");
  const afterQuote = new RegExp(`(${namePattern})\\s+(?:${verbs})`, "g");
  const beforeQuote = new RegExp(`(?:${verbs})\\s+(${namePattern})`, "g");

  const afterMatch = afterQuote.exec(context);
  if (afterMatch?.[1]) return afterMatch[1];

  const beforeMatch = beforeQuote.exec(context);
  if (beforeMatch?.[1]) return beforeMatch[1];

  return null;
}

export function extractDialogueLines(chunks: ChunkRecord[]): DialogueLine[] {
  const lines: DialogueLine[] = [];
  const quoteRegex = /(["“”])([^"“”]+)\1/g;

  for (const chunk of chunks) {
    let match: RegExpExecArray | null = null;
    while ((match = quoteRegex.exec(chunk.text))) {
      const full = match[0];
      const inner = match[2]?.trim() ?? "";
      if (!inner) continue;
      const quoteStart = match.index;
      const quoteEnd = match.index + full.length;
      const speaker = findSpeaker(chunk.text, quoteStart, quoteEnd);
      lines.push({
        chunkId: chunk.id,
        text: inner,
        quoteStart,
        quoteEnd,
        speaker
      });
    }
  }

  return lines;
}

export function computeDialogueTics(lines: DialogueLine[]): DialogueTic[] {
  const bySpeaker = new Map<string, DialogueLine[]>();
  for (const line of lines) {
    if (!line.speaker) {
      continue;
    }
    const list = bySpeaker.get(line.speaker) ?? [];
    list.push(line);
    bySpeaker.set(line.speaker, list);
  }

  const tics: DialogueTic[] = [];
  for (const [speaker, speakerLines] of bySpeaker.entries()) {
    const starterCounts = new Map<string, number>();
    const fillerCounts = new Map<string, number>();
    let ellipses = 0;
    let dashes = 0;
    const examples: Array<{ chunkId: string; quoteStart: number; quoteEnd: number }> = [];

    for (const line of speakerLines) {
      const words = line.text.split(/\s+/).filter(Boolean);
      const starter = words.slice(0, 3).join(" ").toLowerCase();
      if (starter) {
        starterCounts.set(starter, (starterCounts.get(starter) ?? 0) + 1);
      }

      for (const filler of FILLERS) {
        if (line.text.toLowerCase().includes(filler)) {
          fillerCounts.set(filler, (fillerCounts.get(filler) ?? 0) + 1);
        }
      }

      if (line.text.includes("...") || line.text.includes("…")) {
        ellipses += 1;
      }
      if (line.text.includes("—") || line.text.includes("--")) {
        dashes += 1;
      }

      if (examples.length < 3) {
        examples.push({ chunkId: line.chunkId, quoteStart: line.quoteStart, quoteEnd: line.quoteEnd });
      }
    }

    tics.push({
      speaker,
      totalLines: speakerLines.length,
      starters: Array.from(starterCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([phrase, count]) => ({ phrase, count })),
      fillers: Array.from(fillerCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([filler, count]) => ({ filler, count })),
      ellipsesCount: ellipses,
      dashCount: dashes,
      examples
    });
  }

  return tics;
}

export function pickDialogueIssues(tics: DialogueTic[]): Array<{
  speaker: string;
  title: string;
  description: string;
  evidence: Array<{ chunkId: string; quoteStart: number; quoteEnd: number }>;
}> {
  const issues: Array<{
    speaker: string;
    title: string;
    description: string;
    evidence: Array<{ chunkId: string; quoteStart: number; quoteEnd: number }>;
  }> = [];

  for (const tic of tics) {
    const frequentStarter = tic.starters.find((starter) => starter.count >= 3);
    if (frequentStarter) {
      issues.push({
        speaker: tic.speaker,
        title: `Dialogue tic: ${tic.speaker}`,
        description: `Starter phrase "${frequentStarter.phrase}" repeats ${frequentStarter.count} times.`,
        evidence: tic.examples
      });
      continue;
    }

    const frequentFiller = tic.fillers.find((filler) => filler.count >= 3);
    if (frequentFiller) {
      issues.push({
        speaker: tic.speaker,
        title: `Dialogue tic: ${tic.speaker}`,
        description: `Filler "${frequentFiller.filler}" repeats ${frequentFiller.count} times.`,
        evidence: tic.examples
      });
    }
  }

  return issues;
}
