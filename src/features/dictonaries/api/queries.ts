import type { QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import type { DictItem } from "@/shared/types/dictItem";
import type { Filters } from "../model/schema";

export async function fetchDictItems(
  q: QueryState<Filters, DictItem>,
  module: string,
  signal?: AbortSignal,
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  } else {
    params.sort = "id,asc";
  }
  const { search } = q.filters;
  params.name = "";
  if (search) params.name = search;

  const res = await http.get(
    "/dict/" + module + "/search/findByNameContainingIgnoreCase",
    {
      params,
      signal,
    },
  );
  return {
    content: res.data["_embedded"][module].map(
      (item: any): DictItem => ({
        id: item.id,
        name: item.name,
        color: item.color,
      }),
    ),
    totalElements: res.data.page.totalElements,
    totalPages: res.data.page.totalPages,
  };
}
