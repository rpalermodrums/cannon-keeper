export { openDatabase, type DatabaseHandle } from "./db";
export { getProjectByRootPath, createProject, touchProject } from "./projectRepo";
export { getDocumentByPath, createDocument, touchDocument } from "./documentRepo";
export { insertSnapshot, getLatestSnapshotVersion } from "./snapshotRepo";
export { listChunksForDocument, deleteChunksByIds, insertChunks, updateChunk } from "./chunkRepo";
export { logEvent } from "./eventLogRepo";
export { type StoragePaths, getStoragePaths, ensureStorageDirs } from "./paths";
export { runMigrations } from "./migrations";
