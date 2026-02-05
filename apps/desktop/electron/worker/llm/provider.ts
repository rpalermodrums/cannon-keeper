export interface LLMProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  completeJSON<T>(req: {
    schemaName: string;
    systemPrompt: string;
    userPrompt: string;
    jsonSchema: object;
    temperature: number;
    maxTokens: number;
  }): Promise<{ json: T; rawText: string; tokenUsage?: unknown }>;
}

export class NullProvider implements LLMProvider {
  name = "null";
  async isAvailable(): Promise<boolean> {
    return false;
  }
  async completeJSON<T>(): Promise<{ json: T; rawText: string }> {
    throw new Error("NullProvider is not available");
  }
}

export class CloudProvider implements LLMProvider {
  name = "cloud";
  constructor(private baseUrl: string, private apiKey: string) {}

  async isAvailable(): Promise<boolean> {
    return Boolean(this.baseUrl && this.apiKey);
  }

  async completeJSON<T>(req: {
    schemaName: string;
    systemPrompt: string;
    userPrompt: string;
    jsonSchema: object;
    temperature: number;
    maxTokens: number;
  }): Promise<{ json: T; rawText: string; tokenUsage?: unknown }> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        schemaName: req.schemaName,
        systemPrompt: req.systemPrompt,
        userPrompt: req.userPrompt,
        jsonSchema: req.jsonSchema,
        temperature: req.temperature,
        maxTokens: req.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`LLM request failed: ${response.status}`);
    }

    const data = (await response.json()) as { json?: T; rawText?: string; tokenUsage?: unknown };
    if (data.json !== undefined) {
      return { json: data.json, rawText: data.rawText ?? JSON.stringify(data.json), tokenUsage: data.tokenUsage };
    }

    return {
      json: data as T,
      rawText: JSON.stringify(data),
      tokenUsage: data.tokenUsage
    };
  }
}
