import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { fetchOrders } from "../api/queries";
import { http } from "@/shared/api/http";
import type { Order } from "@/shared/types/order";
import { FiltersSchema, type Filters } from "../model/schema";

export default function OrderListPage() {
  const { t } = useTranslation("order");
  const filterFields: FilterField<keyof Filters & string>[] = [
    {
      type: "text",
      name: "product",
      label: t("product"),
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
      name: "status",
      label: t("status"),
      multiple: true,
      clearable: true,
      endpoint: "/dict/order-statuses",
      placeholder: t("common:placeholders.any"),
    },
    {
      type: "select",
      name: "type",
      label: t("type"),
      multiple: true,
      clearable: true,
      endpoint: "/dict/order-types",
      placeholder: t("common:placeholders.any"),
    },
  ];

  const columns: ColumnDef<Order>[] = [
    { key: "product", header: t("product") },
    { key: "dateFrom", header: t("dateFrom") },
    { key: "dateTo", header: t("dateTo") },
    { key: "quantity", header: t("quantity") },
    {
      key: "company",
      header: t("company"),
      cell: (c) => c.company?.name || "—",
    },
    {
      key: "type",
      header: t("type"),
      cell: (row) => row.type?.name,
    },
    {
      key: "status",
      header: t("status"),
      cell: (c) => c.status?.name || "—",
    },
  ];
  return (
    <DataListView<Filters, Order>
      filtersConfig={filterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetchOrders}
      columns={columns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/orders/" + row.id);
      }}
    />
  );
}
