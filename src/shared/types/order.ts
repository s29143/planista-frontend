import type { Company } from "./company";
import type { Contact } from "./contact";

export type Order = {
  id: string;
  product: string;
  quantity: number;
  dateFrom: string;
  dateTo: string;
  company?: Company;
  contact?: Contact;
  type?: { id: string; name: string };
  status?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};
