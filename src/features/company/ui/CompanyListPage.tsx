import { DataListView } from "@/shared/ui/DataListView";
import type {
  ColumnDef,
  PagedResponse,
  QueryState,
} from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { http } from "@/shared/api/http";
import z from "zod";
import { useTranslation } from "react-i18next";
import type { Company } from "../model/store";
import qs from "qs";

const companyFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
  district: z.string().array().optional().default([]),
  user: z.string().array().optional().default([]),
  status: z.string().array().optional().default([]),
});
export type CompanyFilters = z.infer<typeof companyFiltersSchema>;

const companyFilterFields: FilterField<keyof CompanyFilters & string>[] = [
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

async function fetchCompanies(
  q: QueryState<CompanyFilters, Company>,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search, district, status, user } = q.filters;
  if (search) params.search = search;
  if (district) params.districtId = district;
  if (status) params.statusId = status;
  if (user) params.userId = user;

  const res = await http.get<PagedResponse<Company>>("/companies", {
    params,
    signal,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
  });
  return res.data;
}

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
    <DataListView<CompanyFilters, Company>
      filtersConfig={companyFilterFields}
      filtersSchema={companyFiltersSchema}
      fetcher={fetchCompanies}
      columns={companyColumns}
      initialPageSize={10}
    />
  );
}
