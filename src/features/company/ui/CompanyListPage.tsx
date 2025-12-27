import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { FiltersSchema, type Company } from "../model/store";
import { fetchCompanies } from "../api/queries";
import type { Filters } from "../model/store";
import { http } from "@/shared/api/http";

const companyFilterFields: FilterField<keyof Filters & string>[] = [
  {
    type: "text",
    name: "search",
    label: "Szukaj",
    placeholder: "Nazwa, NIP, miasto...",
  },
  {
    type: "select",
    name: "district",
    label: "Województwo",
    multiple: true,
    clearable: true,
    endpoint: "/districts",
    placeholder: "Dowolna",
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
    name: "status",
    label: "Status",
    multiple: true,
    clearable: true,
    endpoint: "/company-statuses",
    placeholder: "Dowolny",
  },
];

export default function CompanyListPage() {
  const { t } = useTranslation("company");
  const companyColumns: ColumnDef<Company>[] = [
    { key: "fullName", header: t("fullName") },
    { key: "nip", header: t("nip") },
    {
      key: "district",
      header: t("district"),
      cell: (c) => c.district?.name || "—",
    },
    {
      key: "status",
      header: t("status"),
      cell: (row) => row.status?.name,
    },
    {
      key: "user",
      header: t("user"),
      cell: (c) => c.user?.name || "—",
    },
  ];
  return (
    <DataListView<Filters, Company>
      filtersConfig={companyFilterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetchCompanies}
      columns={companyColumns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/companies/" + row.id);
      }}
    />
  );
}
