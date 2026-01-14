import type { DictItem } from "./dictItem";

export type Execution = {
  id: string;
  quantity: number;
  timeInSeconds: number;
  process: DictItem;
  createdAt?: string;
  updatedAt?: string;
};
