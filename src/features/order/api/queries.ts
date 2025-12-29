import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import type { Order, Filters, SortDir } from "../model/store";
import { http } from "@/shared/api/http";
import qs from "qs";

export type OrdersQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof Order | null;
  sortDir?: SortDir;
  filters: Filters;
};

export type OrdersResponse = {
  content: Order[];
  total: number;
};

export async function fetchOrders(
  q: QueryState<Filters, Order>,
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

  const res = await http.get<PagedResponse<Order>>("/orders", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
