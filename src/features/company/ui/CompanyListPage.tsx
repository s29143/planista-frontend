import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { fetchCompanies } from "../api/queries";
import { http } from "@/shared/api/http";
import type { Company } from "@/shared/types/company";
import { FiltersSchema, type Filters } from "../model/schema";

export default function CompanyListPage() {
  const { t } = useTranslation("company");
  const companyFilterFields: FilterField<keyof Filters & string>[] = [
    {
      type: "text",
      name: "search",
      label: t("common:actions.search"),
      placeholder: t("placeholders.search"),
    },
    {
      type: "select",
      name: "district",
      label: t("district"),
      multiple: true,
      clearable: true,
      endpoint: "/dict/districts",
      placeholder: t("common:placeholders.any"),
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
      name: "status",
      label: t("status"),
      multiple: true,
      clearable: true,
      endpoint: "/dict/company-statuses",
      placeholder: t("common:placeholders.any"),
    },
  ];
  const companyColumns: ColumnDef<Company>[] = [
    { key: "fullName", header: t("fullName") },
    { key: "nip", header: t("nip") },
    {
      key: "district",
      header: t("district"),
      cell: (c) => c.district?.name || "—",
      color: (row) => row.district?.color,
    },
    {
      key: "status",
      header: t("status"),
      cell: (row) => row.status?.name,
      color: (row) => row.status?.color,
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
