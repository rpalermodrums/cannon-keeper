export type PingResponse = { ok: boolean };
export type ProjectSummary = {
  id: string;
  root_path: string;
  name: string;
  created_at: number;
  updated_at: number;
};

export type WorkerStatus = {
  state: "idle" | "busy";
  lastJob?: string;
  projectId?: string | null;
};

export type IngestResult = {
  documentId: string;
  snapshotId: string;
  chunksCreated: number;
  chunksUpdated: number;
  chunksDeleted: number;
};

export type SearchResult = {
  chunkId: string;
  documentId: string;
  documentPath: string;
  ordinal: number;
  text: string;
  snippet: string;
  score: number;
};

export type SearchQueryResponse = {
  query: string;
  results: SearchResult[];
};

export type AskResponse = {
  answerType: "cited" | "not_found" | "snippets";
  answer: string;
  confidence: number;
  citations: Array<{ chunkId: string; quoteStart: number; quoteEnd: number }>;
  snippets?: SearchResult[];
};

export type SceneSummary = {
  id: string;
  project_id: string;
  document_id: string;
  ordinal: number;
  start_chunk_id: string;
  end_chunk_id: string;
  start_char: number;
  end_char: number;
  title: string | null;
  pov_mode: string;
  pov_entity_id: string | null;
  setting_entity_id: string | null;
  setting_text: string | null;
};

export type SceneDetail = {
  scene: SceneSummary;
  chunks: Array<{
    id: string;
    ordinal: number;
    text: string;
    start_char: number;
    end_char: number;
  }>;
};

export type IssueSummary = {
  id: string;
  project_id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  status: string;
  created_at: number;
  updated_at: number;
  evidence: Array<{
    chunkId: string;
    documentPath: string | null;
    chunkOrdinal: number | null;
    quoteStart: number;
    quoteEnd: number;
    excerpt: string;
  }>;
};

export type StyleReport = {
  repetition: unknown | null;
  tone: Array<{ scopeId: string; value: unknown }>;
  dialogueTics: Array<{ scopeId: string; value: unknown }>;
};

export type EntitySummary = {
  id: string;
  project_id: string;
  type: string;
  display_name: string;
  canonical_name: string | null;
  created_at: number;
  updated_at: number;
};

export type EntityDetail = {
  entity: EntitySummary;
  claims: Array<{
    claim: {
      id: string;
      entity_id: string;
      field: string;
      value_json: string;
      status: string;
      confidence: number;
      created_at: number;
      updated_at: number;
      supersedes_claim_id: string | null;
    };
    value: unknown;
    evidence: Array<{
      chunkId: string;
      documentPath: string | null;
      chunkOrdinal: number | null;
      quoteStart: number;
      quoteEnd: number;
      excerpt: string;
    }>;
  }>;
};

export async function ping(): Promise<PingResponse> {
  if (!window.canonkeeper) {
    return { ok: false };
  }
  return window.canonkeeper.ping();
}

export async function createOrOpenProject(payload: {
  rootPath: string;
  name?: string;
}): Promise<ProjectSummary> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.project.createOrOpen(payload);
}

export async function getWorkerStatus(): Promise<WorkerStatus> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.project.getStatus();
}

export async function addDocument(payload: { path: string }): Promise<IngestResult> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.project.addDocument(payload);
}

export async function querySearch(query: string): Promise<SearchQueryResponse> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.search.query({ query });
}

export async function askQuestion(question: string): Promise<AskResponse> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.search.ask({ question });
}

export async function listScenes(): Promise<SceneSummary[]> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.scenes.list();
}

export async function getScene(sceneId: string): Promise<SceneDetail | null> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.scenes.get({ sceneId });
}

export async function listIssues(): Promise<IssueSummary[]> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.issues.list();
}

export async function dismissIssue(issueId: string): Promise<{ ok: boolean }> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.issues.dismiss({ issueId });
}

export async function getStyleReport(): Promise<StyleReport> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.style.getReport();
}

export async function listEntities(): Promise<EntitySummary[]> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.bible.listEntities();
}

export async function getEntity(entityId: string): Promise<EntityDetail> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.bible.getEntity({ entityId });
}

export async function confirmClaim(payload: {
  entityId: string;
  field: string;
  valueJson: string;
}): Promise<string> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.canon.confirmClaim(payload);
}

export async function runExport(outDir: string): Promise<{ ok: boolean }> {
  if (!window.canonkeeper) {
    throw new Error("IPC not available");
  }
  return window.canonkeeper.export.run({ outDir });
}
