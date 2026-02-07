import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  clearIssuesByType,
  createProject,
  dismissIssue,
  undoDismissIssue,
  undoResolveIssue,
  insertIssue,
  listIssues,
  openDatabase,
  resolveIssue
} from "./index";

function setupDb() {
  const rootPath = fs.mkdtempSync(path.join(os.tmpdir(), "canonkeeper-"));
  const handle = openDatabase({ rootPath });
  const project = createProject(handle.db, rootPath, "Test Project");
  return { rootPath, db: handle.db, projectId: project.id };
}

describe("issue repository filters", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots) {
      fs.rmSync(root, { recursive: true, force: true });
    }
    tempRoots.length = 0;
  });

  it("lists only open issues by default and supports resolve", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    const openIssue = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Open",
      description: "Open"
    });
    const dismissed = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Dismissed",
      description: "Dismissed"
    });
    dismissIssue(setup.db, dismissed.id);
    resolveIssue(setup.db, openIssue.id);

    const defaults = listIssues(setup.db, setup.projectId);
    expect(defaults.length).toBe(0);

    const all = listIssues(setup.db, setup.projectId, { status: "all" });
    expect(all.length).toBe(2);
    expect(all.some((issue) => issue.status === "resolved")).toBe(true);
  });

  it("undoes a dismissed issue back to open", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    const dismissed = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Dismissed",
      description: "Dismissed"
    });

    dismissIssue(setup.db, dismissed.id);
    undoDismissIssue(setup.db, dismissed.id);

    const openIssues = listIssues(setup.db, setup.projectId);
    expect(openIssues.some((issue) => issue.id === dismissed.id)).toBe(true);
  });

  it("undoes a resolved issue back to open", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    const resolved = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Resolved",
      description: "Resolved"
    });

    resolveIssue(setup.db, resolved.id);
    undoResolveIssue(setup.db, resolved.id);

    const openIssues = listIssues(setup.db, setup.projectId);
    expect(openIssues.some((issue) => issue.id === resolved.id)).toBe(true);
  });

  it("clearIssuesByType deletes only open issues", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Open1",
      description: "Open1"
    });
    insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Open2",
      description: "Open2"
    });

    clearIssuesByType(setup.db, setup.projectId, "continuity");

    const remaining = listIssues(setup.db, setup.projectId, { status: "all" });
    expect(remaining.length).toBe(0);
  });

  it("clearIssuesByType preserves resolved issues", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    const resolved = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Resolved",
      description: "Resolved"
    });
    resolveIssue(setup.db, resolved.id);
    insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Open",
      description: "Open"
    });

    clearIssuesByType(setup.db, setup.projectId, "continuity");

    const remaining = listIssues(setup.db, setup.projectId, { status: "all" });
    expect(remaining).toHaveLength(1);
    const preserved = remaining[0]!;
    expect(preserved.id).toBe(resolved.id);
    expect(preserved.status).toBe("resolved");
  });

  it("clearIssuesByType preserves dismissed issues", () => {
    const setup = setupDb();
    tempRoots.push(setup.rootPath);
    const dismissed = insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Dismissed",
      description: "Dismissed"
    });
    dismissIssue(setup.db, dismissed.id);
    insertIssue(setup.db, {
      projectId: setup.projectId,
      type: "continuity",
      severity: "medium",
      title: "Open",
      description: "Open"
    });

    clearIssuesByType(setup.db, setup.projectId, "continuity");

    const remaining = listIssues(setup.db, setup.projectId, { status: "all" });
    expect(remaining).toHaveLength(1);
    const preserved = remaining[0]!;
    expect(preserved.id).toBe(dismissed.id);
    expect(preserved.status).toBe("dismissed");
  });
});
