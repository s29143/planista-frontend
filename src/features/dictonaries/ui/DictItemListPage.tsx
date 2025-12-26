import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { http } from "@/shared/api/http";
import { useTranslation } from "react-i18next";
import { type DictItem } from "../model/store";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  dictItemFiltersSchema,
  fetchDictItems,
  type DictItemFilters,
} from "../api/queries";

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

  const fetch = (q) => fetchDictItems(q, module!);

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
