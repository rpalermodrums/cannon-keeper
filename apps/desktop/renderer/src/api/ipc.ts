export type PingResponse = { ok: boolean };

export async function ping(): Promise<PingResponse> {
  if (!window.canonkeeper) {
    return { ok: false };
  }
  return window.canonkeeper.ping();
}
