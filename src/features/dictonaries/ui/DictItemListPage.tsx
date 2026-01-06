import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef, QueryState } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { http } from "@/shared/api/http";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchDictItems } from "../api/queries";
import type { DictItem } from "@/shared/types/dictItem";
import { FiltersSchema, type Filters } from "../model/schema";

const dictItemFilterFields: FilterField<keyof Filters & string>[] = [
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

  const fetch = (q: QueryState<Filters, DictItem>) =>
    fetchDictItems(q, module!);

  useEffect(() => {
    if (!module) {
      throw new Error("Module param is required");
    }
  }, [module]);
  return (
    <DataListView<Filters, DictItem>
      key={module}
      filtersConfig={dictItemFilterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetch}
      columns={dictItemColumns}
      initialPageSize={20}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete(`/${module}/` + row.id);
      }}
    />
  );
}
