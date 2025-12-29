import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { FiltersSchema, type Filters, type Order } from "../model/store";
import { fetchOrders } from "../api/queries";
import { http } from "@/shared/api/http";

const filterFields: FilterField<keyof Filters & string>[] = [
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
    endpoint: "/order-types",
    placeholder: "Dowolny",
  },
];

export default function OrderListPage() {
  const { t } = useTranslation("order");
  const columns: ColumnDef<Order>[] = [
    { key: "product", header: t("product") },
    { key: "quantity", header: t("quantity") },
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
