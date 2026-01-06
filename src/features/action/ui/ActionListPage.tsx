import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { FiltersSchema, type Action, type Filters } from "../model/store";
import { fetchActions } from "../api/queries";
import { http } from "@/shared/api/http";

export default function ActionListPage() {
  const { t } = useTranslation("action");
  const filterFields: FilterField<keyof Filters & string>[] = [
    {
      type: "text",
      name: "search",
      label: t("common:actions.search"),
      placeholder: t("common:placeholders.search"),
    },
    {
      type: "text",
      name: "company",
      label: t("company"),
      placeholder: t("common:placeholders.search"),
    },
    {
      type: "select",
      name: "user",
      label: t("user"),
      multiple: true,
      clearable: true,
      endpoint: "/users",
      placeholder: t("common:placeholders.any"),
      mapItem: (i) => ({
        value: String(i.id),
        label: `${i.firstname} ${i.lastname} (${i.username})`,
      }),
    },
    {
      type: "select",
      name: "type",
      label: t("type"),
      multiple: true,
      clearable: true,
      endpoint: "/action-types",
      placeholder: t("common:placeholders.any"),
    },
  ];
  const columns: ColumnDef<Action>[] = [
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
      cell: (row) => row.type?.name || "—",
    },
    {
      key: "user",
      header: t("user"),
      cell: (c) => c.user?.name || "—",
    },
  ];
  return (
    <DataListView<Filters, Action>
      filtersConfig={filterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetchActions}
      columns={columns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/actions/" + row.id);
      }}
    />
  );
}
