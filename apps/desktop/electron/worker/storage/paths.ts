import path from "node:path";
import fs from "node:fs";

export type StoragePaths = {
  rootPath: string;
  dataDir: string;
  dbFile: string;
};

export function getStoragePaths(rootPath: string): StoragePaths {
  const dataDir = path.join(rootPath, ".canonkeeper");
  const dbFile = path.join(dataDir, "canonkeeper.db");
  return { rootPath, dataDir, dbFile };
}

export function ensureStorageDirs(paths: StoragePaths): void {
  fs.mkdirSync(paths.dataDir, { recursive: true });
}
