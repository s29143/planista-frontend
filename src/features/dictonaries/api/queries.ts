import type { QueryState } from "@/shared/ui/DataTableView";
import z from "zod";
import type { DictItem } from "../model/store";
import { http } from "@/shared/api/http";

export const dictItemFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
});
export type DictItemFilters = z.infer<typeof dictItemFiltersSchema>;
export async function fetchDictItems(
  q: QueryState<DictItemFilters, DictItem>,
  module: string,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search } = q.filters;
  params.name = "";
  if (search) params.name = search;

  const res = await http.get(
    "/" + module + "/search/findByNameContainingIgnoreCase",
    {
      params,
      signal,
    }
  );
  return {
    content: res.data["_embedded"][module].map(
      (item: any): DictItem => ({
        id: item.id,
        name: item.name,
      })
    ),
    totalElements: res.data.page.totalElements,
    totalPages: res.data.page.totalPages,
  };
}
