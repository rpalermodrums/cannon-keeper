import Database from "better-sqlite3";
import path from "node:path";
import { ensureStorageDirs, getStoragePaths } from "./paths";
import { runMigrations, type MigrationResult } from "./migrations";

export type DatabaseHandle = {
  db: Database.Database;
  paths: ReturnType<typeof getStoragePaths>;
  migrations: MigrationResult;
};

export type OpenDatabaseOptions = {
  rootPath: string;
  migrationsDir?: string;
};

export function openDatabase(options: OpenDatabaseOptions): DatabaseHandle {
  const paths = getStoragePaths(options.rootPath);
  ensureStorageDirs(paths);

  const db = new Database(paths.dbFile);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  const migrationsDir = options.migrationsDir ?? path.resolve(process.cwd(), "migrations");
  const migrations = runMigrations(db, migrationsDir);

  return { db, paths, migrations };
}
