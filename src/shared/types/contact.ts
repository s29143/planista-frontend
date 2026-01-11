import type { Company } from "./company";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  email?: string;
  company?: Company;
  user?: { id: string; name: string };
  status: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};
