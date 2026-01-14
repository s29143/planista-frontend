import type { DictItem } from "./dictItem";

export type Action = {
  id: string;
  date: string;
  text: string;
  done: boolean;
  prior: boolean;
  reminder: boolean;
  user: DictItem;
  company?: DictItem;
  contact?: DictItem;
  type?: DictItem;
  createdAt?: string;
  updatedAt?: string;
};
