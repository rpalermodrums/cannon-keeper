import { useCallback, useState } from "react";

type ActionOptions = {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};

type UseActionReturn = {
  busy: boolean;
  run: (label: string, fn: () => Promise<void>, options?: ActionOptions) => Promise<void>;
};

export function useAction(): UseActionReturn {
  const [pendingActions, setPendingActions] = useState<string[]>([]);

  const busy = pendingActions.length > 0;

  const run = useCallback(
    async (label: string, fn: () => Promise<void>, options?: ActionOptions) => {
      setPendingActions((current) => [...current, label]);
      try {
        await fn();
        options?.onSuccess?.();
      } catch (err) {
        options?.onError?.(err);
      } finally {
        setPendingActions((current) => {
          const index = current.indexOf(label);
          if (index < 0) return current;
          return [...current.slice(0, index), ...current.slice(index + 1)];
        });
      }
    },
    []
  );

  return { busy, run };
}
