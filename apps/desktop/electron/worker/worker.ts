export type WorkerStatus = {
  state: "idle" | "busy";
  lastJob?: string;
};

const status: WorkerStatus = { state: "idle" };

export function getStatus(): WorkerStatus {
  return status;
}
