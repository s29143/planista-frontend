import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import type { Contact, Filters, SortDir } from "../model/store";
import { http } from "@/shared/api/http";
import qs from "qs";
import z from "zod";

export type ContactsQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Contact | null;
  sortDir?: SortDir;
  filters: Filters;
};

export const contactFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
  district: z.string().array().optional().default([]),
  user: z.string().array().optional().default([]),
  status: z.string().array().optional().default([]),
});

export type ContactFilters = z.infer<typeof contactFiltersSchema>;
export type ContactsResponse = {
  content: Contact[];
  total: number;
};

export async function fetchContacts(
  q: QueryState<ContactFilters, Contact>,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search, district, status, user } = q.filters;
  if (search) params.search = search;
  if (district) params.districtId = district;
  if (status) params.statusId = status;
  if (user) params.userId = user;

  const res = await http.get<PagedResponse<Contact>>("/contacts", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
