export {};

declare global {
  interface Window {
    canonkeeper?: {
      ping: () => Promise<{ ok: boolean }>;
      project: {
        createOrOpen: (payload: { rootPath: string; name?: string }) => Promise<{
          id: string;
          root_path: string;
          name: string;
          created_at: number;
          updated_at: number;
        }>;
        getStatus: () => Promise<{
          state: "idle" | "busy";
          lastJob?: string;
          projectId?: string | null;
        }>;
      };
    };
  }
}
