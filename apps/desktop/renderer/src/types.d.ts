export {};

declare global {
  interface Window {
    canonkeeper?: {
      ping: () => Promise<{ ok: boolean }>;
    };
  }
}
