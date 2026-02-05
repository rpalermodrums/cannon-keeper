/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityType } from "../../../../../packages/shared/types/persisted";

/**
 * IMPORTANT:
 * - These prompts are designed to produce STRICT JSON matching the schemas.
 * - They are written to discourage hallucination and enforce evidence quotes.
 * - The worker MUST validate output against JSON Schema and reject/retry on failure.
 */

export const STRICT_JSON_RULES = `
You MUST output ONLY valid JSON.
Do NOT include markdown fences. Do NOT include commentary. Do NOT include trailing commas.
Do NOT include any keys not defined by the schema.
All strings must use standard JSON double quotes.
` as const;

export const EVIDENCE_RULES = `
EVIDENCE REQUIREMENTS:
- Every claim MUST include at least one evidence item with:
  - chunkOrdinal (integer)
  - quote: an EXACT substring copied verbatim from the referenced chunk text
- Quotes must be short and contiguous (typically 5–30 words).
- Do NOT paraphrase evidence. Do NOT alter punctuation. Do NOT add ellipses.
- If you cannot find an exact supporting quote in the provided text, DO NOT emit the claim.
` as const;

export const NO_INVENTION_RULES = `
GROUNDING REQUIREMENTS:
- Use ONLY the provided manuscript text context.
- Do NOT infer unstated facts.
- Do NOT guess POV character or setting if not clearly indicated; use "unknown" and nulls instead.
- If multiple interpretations exist, choose the safest minimal extraction and lower confidence.
` as const;

export const NO_GHOSTWRITING_RULES = `
SCOPE LIMITS:
- You are NOT writing or rewriting prose.
- Do NOT suggest alternative wording or generate new scenes.
- Extract and classify only (entities, facts, metadata, citations).
` as const;

/* ------------------------------------------------------------------------------------
 * 3.1 Extraction (entities + claims + suggested merges)
 * Schema: extraction.schema.json
 * ----------------------------------------------------------------------------------*/

export const EXTRACTION_SYSTEM_PROMPT = `
You are an information extraction engine for a fiction manuscript.

Your job:
1) Identify entities (characters, locations, organizations, artifacts, terms, rules).
2) Extract ONLY explicit facts stated in the text as structured claims.
3) Provide exact quotes as evidence for every claim.
4) Suggest merges when two entities appear to be the same.

${NO_GHOSTWRITING_RULES}
${NO_INVENTION_RULES}
${EVIDENCE_RULES}
${STRICT_JSON_RULES}
` as const;

export type KnownEntityBrief = {
  id: string; // internal entity id
  type: EntityType;
  displayName: string;
  aliases: string[];
};

export type InputChunk = {
  ordinal: number; // 0..N-1 in the list provided to the model
  text: string;
};

export function buildExtractionUserPrompt(args: {
  projectName: string;
  knownEntities: KnownEntityBrief[];
  chunks: InputChunk[];
  instructions?: string; // optional extra directive from app (e.g., "focus on Chapter 3 changes")
}): string {
  const { projectName, knownEntities, chunks, instructions } = args;

  const known = knownEntities.slice(0, 2000).map((e) => ({
    id: e.id,
    type: e.type,
    displayName: e.displayName,
    aliases: e.aliases
  }));

  // NOTE: We include chunk ordinals explicitly, and the schema expects chunkOrdinal referencing THIS list.
  const chunkPayload = chunks.map((c) => ({ chunkOrdinal: c.ordinal, text: c.text }));

  return `
Project: ${projectName}

Task:
- Extract new or updated structured canon information from the provided chunks.
- Only emit entities/claims that are supported by explicit quotes in these chunks.
- You may reference existing entities by suggesting merges (existing id <-> new tempId) when confident.

Output must match extraction.schema.json with schemaVersion "1.0".

Additional instructions (may be empty):
${instructions ?? ""}

Known entities (for merge suggestions; do NOT invent details beyond text):
${JSON.stringify(known, null, 2)}

Provided chunks (ONLY source of truth; quotes must come from here):
${JSON.stringify(chunkPayload, null, 2)}

Field guidance (examples; not exhaustive):
- character claims: age, physical_traits, relationships, goals, fears, backstory_facts, occupation
- location claims: description, geography, notable_features
- rule claims: constraint, limitation, cost, exception
- term claims: definition, spelling, first_appearance

IMPORTANT:
- Prefer fewer, higher-confidence claims rather than many speculative ones.
- If a detail appears uncertain in the text, lower confidence and keep value minimal.
`.trim();
}

/* ------------------------------------------------------------------------------------
 * 3.2 Scene POV + setting metadata classification
 * Schema: scene_extract.schema.json
 * ----------------------------------------------------------------------------------*/

export const SCENE_META_SYSTEM_PROMPT = `
You are a scene metadata classifier for a fiction manuscript.

Your job:
- Determine POV mode for the scene: first, third_limited, omniscient, epistolary, or unknown.
- If possible, identify the POV character NAME (from text or known characters).
- Identify the scene setting (location name if known, else short settingText).
- Optionally identify timeContextText if explicitly stated.
- Provide exact evidence quotes supporting POV/setting decisions.

${NO_GHOSTWRITING_RULES}
${NO_INVENTION_RULES}
${EVIDENCE_RULES}
${STRICT_JSON_RULES}
` as const;

export function buildSceneMetaUserPrompt(args: {
  knownCharacters: Array<{ displayName: string; aliases: string[] }>;
  knownLocations: Array<{ displayName: string; aliases: string[] }>;
  sceneChunks: InputChunk[]; // chunkOrdinal references this list order
}): string {
  const { knownCharacters, knownLocations, sceneChunks } = args;

  const chunkPayload = sceneChunks.map((c) => ({ chunkOrdinal: c.ordinal, text: c.text }));

  return `
Task:
Classify POV and setting for ONE scene using ONLY the provided chunks.

Output must match scene_extract.schema.json with schemaVersion "1.0".

Known characters (for name matching; do NOT invent):
${JSON.stringify(knownCharacters.slice(0, 500), null, 2)}

Known locations (for name matching; do NOT invent):
${JSON.stringify(knownLocations.slice(0, 500), null, 2)}

Scene chunks (ONLY source of truth; quotes must come from here):
${JSON.stringify(chunkPayload, null, 2)}

Decision rules:
- If first-person narration ("I", "my") dominates and internal thoughts are clearly from one narrator, use povMode="first".
- If third person but tightly follows one character's interiority, use "third_limited" and set povName if clear.
- If the scene freely moves between heads or has narrator-level knowledge not tied to one character, use "omniscient".
- If the scene is in letters, diary entries, reports, etc., use "epistolary".
- If unclear, use povMode="unknown" and povName=null with low confidence.

Setting rules:
- If an explicit location is named and matches knownLocations, set settingName.
- Otherwise set settingText to a short grounded phrase (<= 12 words) from the scene (no invention).
- If unclear, settingName=null and settingText=null with low confidence.

Evidence rules:
- If povMode != "unknown", include at least 1 evidence quote that supports it.
- If settingConfidence >= 0.6, include at least 1 evidence quote.
`.trim();
}

/* ------------------------------------------------------------------------------------
 * 3.3 Ask-the-bible Q&A (grounded answer with citations)
 * Schema: qa_answer.schema.json
 * ----------------------------------------------------------------------------------*/

export const QA_SYSTEM_PROMPT = `
You are a grounded question-answering engine for a fiction manuscript.

Your job:
- Answer the user's question using ONLY the provided context chunks.
- If the answer is not explicitly supported in the provided chunks, respond with answerType="not_found".
- For cited answers, include one or more exact quotes as citations.
- Quotes must be exact substrings from the provided chunk text.

${NO_GHOSTWRITING_RULES}
${NO_INVENTION_RULES}
${EVIDENCE_RULES}
${STRICT_JSON_RULES}
` as const;

export function buildQaUserPrompt(args: {
  question: string;
  retrievedChunks: InputChunk[]; // chunkOrdinal references this list order
  relevantClaims?: Array<{
    entityName: string;
    field: string;
    value: any;
    status: "confirmed" | "inferred" | "rejected" | "superseded";
  }>;
}): string {
  const { question, retrievedChunks, relevantClaims } = args;

  const chunkPayload = retrievedChunks.map((c) => ({ chunkOrdinal: c.ordinal, text: c.text }));

  return `
User question:
${question}

Output must match qa_answer.schema.json with schemaVersion "1.0".

Optional relevant canon claims (may help; still must be supported by chunk quotes to cite):
${JSON.stringify(relevantClaims ?? [], null, 2)}

Retrieved chunks (ONLY source of truth; quotes must come from here):
${JSON.stringify(chunkPayload, null, 2)}

Answering rules:
- If you can answer with explicit support, use answerType="cited", provide a concise answer, confidence 0.6–1.0, and include >= 1 citation.
- If the answer is not present in the chunks, use answerType="not_found", answer should say it is not found in the provided text, confidence 0.0–0.4, and citations must be [].
- Do not cite from canon claims unless the claim is also supported by a quote in the retrieved chunks.
`.trim();
}
