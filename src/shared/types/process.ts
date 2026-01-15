import type { DictItem } from "./dictItem";

export type Process = {
  id: string;
  quantity: number;
  dateFrom: string;
  dateTo: string;
  plannedTimeSeconds: number;
  order: DictItem;
  technology?: DictItem;
  status?: DictItem;
  workstation?: {
    id: string;
    name: string;
    technology: DictItem;
  };
  createdAt?: string;
  updatedAt?: string;
};
