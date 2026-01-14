import type { DictItem } from "./dictItem";

export type Company = {
  id: string;
  fullName: string;
  shortName: string;
  nip?: string;
  district?: DictItem;
  industry?: DictItem;
  user?: DictItem;
  acquiredBy?: DictItem;
  status: DictItem;
  createdAt?: string;
  updatedAt?: string;
};
