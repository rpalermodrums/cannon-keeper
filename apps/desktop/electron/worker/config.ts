import fs from "node:fs";
import path from "node:path";

export type ProjectConfig = {
  projectName: string;
  documents: string[];
  llm: {
    provider: "cloud" | "null";
    model: string;
    enabled: boolean;
    baseUrl?: string;
  };
  style: {
    stopwords: "default";
    repetitionThreshold: { projectCount: number; sceneCount: number };
    toneBaselineScenes: number;
  };
};

export function loadProjectConfig(rootPath: string): ProjectConfig {
  const configPath = path.join(rootPath, "canonkeeper.json");
  const defaults: ProjectConfig = {
    projectName: path.basename(rootPath),
    documents: [],
    llm: {
      provider: "null",
      model: "default",
      enabled: false,
      baseUrl: undefined
    },
    style: {
      stopwords: "default",
      repetitionThreshold: { projectCount: 12, sceneCount: 3 },
      toneBaselineScenes: 10
    }
  };

  if (!fs.existsSync(configPath)) {
    return defaults;
  }

  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8")) as Partial<ProjectConfig>;
    return {
      ...defaults,
      ...raw,
      llm: { ...defaults.llm, ...(raw.llm ?? {}) },
      style: { ...defaults.style, ...(raw.style ?? {}) }
    };
  } catch {
    return defaults;
  }
}
