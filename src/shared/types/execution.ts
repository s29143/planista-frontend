import type { Process } from "./process";

export type Execution = {
  id: string;
  quantity: number;
  timeInSeconds: number;
  process: Process;
  createdAt?: string;
  updatedAt?: string;
};
