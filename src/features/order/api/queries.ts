import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import qs from "qs";
import type { Order } from "@/shared/types/order";
import type { Filters } from "../model/schema";
import type { SortDir } from "@/shared/helpers";

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
  const { product, company, type, status } = q.filters;
  if (product) params.product = product;
  if (company) params.company = company;
  if (type) params.typeId = type;
  if (status) params.statusId = status;

  const res = await http.get<PagedResponse<Order>>("/orders", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}
