import CompanyCard from "./CompanyCard";
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
  q: z.string().trim().optional().default(""),
  district: z.string().optional(),
  industry: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]).optional(),
  employeesMin: z.number().int().nonnegative().optional(),
  employeesMax: z.number().int().nonnegative().optional(),
  created: z
    .tuple([z.date().nullable(), z.date().nullable()])
    .optional()
    .default([null, null]),
});
export type CompanyFilters = z.infer<typeof companyFiltersSchema>;

const companyFilterFields: FilterField<keyof CompanyFilters & string>[] = [
  {
    type: "text",
    name: "q",
    label: "Szukaj",
    placeholder: "Nazwa, NIP, miasto...",
  },
  {
    type: "select",
    name: "district",
    label: "Miasto",
    data: ["Warszawa", "Kraków", "Gdańsk", "Wrocław"].map((c) => ({
      value: c,
      label: c,
    })),
    clearable: true,
    placeholder: "Dowolne",
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
  { type: "number", name: "employeesMin", label: "Pracownicy od", min: 0 },
  { type: "number", name: "employeesMax", label: "Pracownicy do", min: 0 },
  {
    type: "dateRange",
    name: "created",
    label: "Utworzone",
    placeholder: "Zakres dat",
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
  const {
    q: search,
    district,
    industry,
    status,
    employeesMin,
    employeesMax,
    created,
  } = q.filters;
  if (search) params.q = search;
  if (district) params.district = district;
  if (industry) params.industry = industry;
  if (status) params.status = status;
  if (employeesMin != null) params.employeesMin = employeesMin;
  if (employeesMax != null) params.employeesMax = employeesMax;
  if (created && (created[0] || created[1])) {
    params.createdFrom = created[0]?.toISOString();
    params.createdTo = created[1]?.toISOString();
  }

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
      key: "createdAt",
      header: t("createdAt"),
      cell: (c) => (c.createdAt ? new Date(c.createdAt).toISOString() : "—"),
    },
  ];
  return (
    <DataListView<CompanyFilters, Company>
      filtersConfig={companyFilterFields}
      filtersSchema={companyFiltersSchema}
      fetcher={fetchCompanies}
      columns={companyColumns}
      renderGridCard={(row) => <CompanyCard {...row} />}
      initialPageSize={10}
    />
  );
}
