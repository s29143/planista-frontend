import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Contact } from "@/shared/types/contact";
import z from "zod";
import type { SortDir } from "@/shared/helpers";

export const FiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
  company: z.string().trim().optional().default(""),
  user: z.string().array().optional().default([]),
  status: z.string().array().optional().default([]),
});

export type Filters = z.infer<typeof FiltersSchema>;
export type ContactsQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Contact | null;
  sortDir?: SortDir;
  filters: Filters;
};

export type ContactsResponse = {
  content: Contact[];
  total: number;
};

export async function fetchContacts(
  q: QueryState<Filters, Contact>,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search, company, status, user } = q.filters;
  if (search) params.search = search;
  if (company) params.company = company;
  if (status) params.statusId = status;
  if (user) params.userId = user;

  const res = await http.get<PagedResponse<Contact>>("/contacts", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
