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

const companyFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
  district: z.string().optional(),
  industry: z.string().optional(),
  status: z.string().optional(),
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
    name: "industry",
    label: "Branża",
    multiple: true,
    data: ["IT", "Finanse", "Budownictwo", "Logistyka"].map((c) => ({
      value: c,
      label: c,
    })),
    clearable: true,
    placeholder: "Dowolna",
  },
  {
    type: "select",
    name: "industry",
    label: "Branża",
    data: ["IT", "Finanse", "Budownictwo", "Logistyka"].map((c) => ({
      value: c,
      label: c,
    })),
    clearable: true,
    placeholder: "Dowolna",
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    data: [
      { value: "active", label: "Aktywna" },
      { value: "inactive", label: "Nieaktywna" },
      { value: "prospect", label: "Prospekt" },
    ],
    clearable: true,
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
  const { search, district, industry } = q.filters;
  if (search) params.search = search;
  if (district) params.district = district;
  if (industry) params.industry = industry;

  const res = await http.get<PagedResponse<Company>>("/companies", {
    params,
    signal,
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
    { key: "industry", header: "Branża" },
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
