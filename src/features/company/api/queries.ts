import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import type { Filters, SortDir } from "../model/store";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Company } from "@/shared/types/company";

export type CompaniesQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Company | null;
  sortDir?: SortDir;
  filters: Filters;
};

export type CompaniesResponse = {
  content: Company[];
  total: number;
};

export async function fetchCompanies(
  q: QueryState<Filters, Company>,
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

  const res = await http.get<PagedResponse<Company>>("/companies", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
