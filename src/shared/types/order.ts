import type { DictItem } from "./dictItem";

export type Order = {
  id: string;
  product: string;
  quantity: number;
  dateFrom: string;
  dateTo: string;
  company?: DictItem;
  contact?: DictItem;
  type?: DictItem;
  status?: DictItem;
  createdAt?: string;
  updatedAt?: string;
};
