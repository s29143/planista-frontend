import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Action } from "@/shared/types/action";
import type { SortDir } from "@/shared/helpers";
import type { Filters } from "../model/schema";

export type ActionsQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Action | null;
  sortDir?: SortDir;
  filters: Filters;
};

export type ActionsResponse = {
  content: Action[];
  total: number;
};

export async function fetchActions(
  q: QueryState<Filters, Action>,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search, company, type, user } = q.filters;
  if (search) params.search = search;
  if (company) params.company = company;
  if (type) params.typeId = type;
  if (user) params.userId = user;

  const res = await http.get<PagedResponse<Action>>("/actions", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
