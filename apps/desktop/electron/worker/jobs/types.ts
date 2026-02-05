import type { IngestResult } from "../pipeline/ingest";

export type IngestJob = {
  type: "INGEST_DOCUMENT";
  payload: {
    projectId: string;
    filePath: string;
  };
};

export type IngestJobResult = IngestResult;

export type WorkerJob = IngestJob;
