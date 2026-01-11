import type { Company } from "./company";
import type { Contact } from "./contact";

export type Action = {
  id: string;
  date: string;
  text: string;
  done: boolean;
  prior: boolean;
  reminder: boolean;
  user: { id: string; name: string };
  company?: Company;
  contact?: Contact;
  type?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};
