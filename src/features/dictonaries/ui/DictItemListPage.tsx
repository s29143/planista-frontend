import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef, QueryState } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { http } from "@/shared/api/http";
import z from "zod";
import { useTranslation } from "react-i18next";
import { type DictItem } from "../model/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const dictItemFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
});
export type DictItemFilters = z.infer<typeof dictItemFiltersSchema>;

const dictItemFilterFields: FilterField<keyof DictItemFilters & string>[] = [
  {
    type: "text",
    name: "search",
    label: "Szukaj",
    placeholder: "Szukaj",
  },
];

export default function DictItemListPage() {
  const { t } = useTranslation("dictionary");
  const { module } = useParams();
  const dictItemColumns: ColumnDef<DictItem>[] = [
    { key: "id", header: t("id") },
    { key: "name", header: t("name") },
  ];

  async function fetchDictItems(
    q: QueryState<DictItemFilters, DictItem>,
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
      content: res.data["_embedded"][module!].map(
        (item: any): DictItem => ({
          id: item.id,
          name: item.name,
        })
      ),
      totalElements: res.data.page.totalElements,
      totalPages: res.data.page.totalPages,
    };
  }

  useEffect(() => {
    if (!module) {
      throw new Error("Module param is required");
    }
  }, [module]);
  return (
    <DataListView<DictItemFilters, DictItem>
      key={module}
      filtersConfig={dictItemFilterFields}
      filtersSchema={dictItemFiltersSchema}
      fetcher={fetchDictItems}
      columns={dictItemColumns}
      initialPageSize={20}
    />
  );
}
