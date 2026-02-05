export { openDatabase, type DatabaseHandle } from "./db";
export { getProjectByRootPath, createProject, touchProject } from "./projectRepo";
export { type StoragePaths, getStoragePaths, ensureStorageDirs } from "./paths";
export { runMigrations } from "./migrations";
