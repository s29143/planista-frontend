import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { FiltersSchema, type Action, type Filters } from "../model/store";
import { fetchActions } from "../api/queries";
import { http } from "@/shared/api/http";

const actionFilterFields: FilterField<keyof Filters & string>[] = [
  {
    type: "text",
    name: "search",
    label: "Szukaj",
    placeholder: "Szukaj",
  },
  {
    type: "text",
    name: "company",
    label: "Firma",
    placeholder: "Szukaj",
  },
  {
    type: "select",
    name: "user",
    label: "Opiekun",
    multiple: true,
    clearable: true,
    endpoint: "/users",
    placeholder: "Dowolna",
    mapItem: (i) => ({
      value: String(i.id),
      label: `${i.firstname} ${i.lastname} (${i.username})`,
    }),
  },
  {
    type: "select",
    name: "type",
    label: "type",
    multiple: true,
    clearable: true,
    endpoint: "/action-types",
    placeholder: "Dowolny",
  },
];

export default function ActionListPage() {
  const { t } = useTranslation("action");
  const actionColumns: ColumnDef<Action>[] = [
    { key: "date", header: t("date") },
    { key: "text", header: t("text") },
    {
      key: "company",
      header: t("company"),
      cell: (c) => c.company?.shortName || "—",
    },
    {
      key: "type",
      header: t("type"),
      cell: (row) => row.type?.name,
    },
    {
      key: "user",
      header: t("user"),
      cell: (c) => c.user?.name || "—",
    },
  ];
  return (
    <DataListView<Filters, Action>
      filtersConfig={actionFilterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetchActions}
      columns={actionColumns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/action/" + row.id);
      }}
    />
  );
}
