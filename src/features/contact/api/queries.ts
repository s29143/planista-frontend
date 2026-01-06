import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import type { Filters, SortDir } from "../model/store";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Contact } from "@/shared/types/contact";

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
