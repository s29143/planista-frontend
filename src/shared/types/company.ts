export type Company = {
  id: string;
  fullName: string;
  shortName: string;
  nip?: string;
  district?: { id: string; name: string };
  industry?: { id: string; name: string };
  user?: { id: string; name: string };
  acquiredBy?: { id: string; name: string };
  status: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};
