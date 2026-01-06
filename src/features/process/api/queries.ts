import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Process } from "@/shared/types/process";
import type { SortDir } from "@/shared/helpers";
import type { Filters } from "../model/schema";

export type ProcessesQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Process | null;
  sortDir?: SortDir;
  filters: Filters;
};

export type ProcesssResponse = {
  content: Process[];
  total: number;
};

export async function fetchProcesses(
  q: QueryState<Filters, Process>,
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

  const res = await http.get<PagedResponse<Process>>("/processes", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
