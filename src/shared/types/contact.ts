import type { DictItem } from "./dictItem";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  email?: string;
  company?: DictItem;
  user?: DictItem;
  status: DictItem;
  createdAt?: string;
  updatedAt?: string;
};
