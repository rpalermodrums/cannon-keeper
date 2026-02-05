export type JobKey = string;

export type Job<TType extends string, TPayload> = {
  type: TType;
  payload: TPayload;
};

export type JobHandler<TJob extends Job<string, unknown>, TResult> = (job: TJob) => Promise<TResult>;

type QueueEntry<TJob extends Job<string, unknown>, TResult> = {
  key: JobKey;
  job: TJob;
  resolve: (value: TResult) => void;
  reject: (error: Error) => void;
  promise: Promise<TResult>;
};

export class JobQueue<TJob extends Job<string, unknown>, TResult> {
  private queue: JobKey[] = [];
  private entries = new Map<JobKey, QueueEntry<TJob, TResult>>();
  private running = false;

  constructor(private handler: JobHandler<TJob, TResult>) {}

  enqueue(job: TJob, key: JobKey): Promise<TResult> {
    const existing = this.entries.get(key);
    if (existing) {
      existing.job = job;
      return existing.promise;
    }

    let resolve: (value: TResult) => void;
    let reject: (error: Error) => void;
    const promise = new Promise<TResult>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const entry: QueueEntry<TJob, TResult> = {
      key,
      job,
      resolve: resolve!,
      reject: reject!,
      promise
    };

    this.entries.set(key, entry);
    this.queue.push(key);
    void this.run();
    return promise;
  }

  private async run(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;

    while (this.queue.length > 0) {
      const key = this.queue.shift();
      if (!key) {
        continue;
      }
      const entry = this.entries.get(key);
      if (!entry) {
        continue;
      }

      try {
        const result = await this.handler(entry.job);
        entry.resolve(result);
      } catch (error) {
        entry.reject(error instanceof Error ? error : new Error("Job failed"));
      } finally {
        this.entries.delete(key);
      }
    }

    this.running = false;
  }
}
