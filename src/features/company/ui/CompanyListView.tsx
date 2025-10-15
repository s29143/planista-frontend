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
import type { Company } from "../model/store";

const companyFiltersSchema = z.object({
  q: z.string().trim().optional().default(""),
  city: z.string().optional(),
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
    name: "city",
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
    pageSize: q.size,
  };
  if (q.sortBy) {
    params.sortBy = q.sortBy;
    params.sortDir = q.sortDir;
  }
  const {
    q: search,
    city,
    industry,
    status,
    employeesMin,
    employeesMax,
    created,
  } = q.filters;
  if (search) params.q = search;
  if (city) params.city = city;
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

const companyColumns: ColumnDef<Company>[] = [
  { key: "shortName", header: "Nazwa", sortable: true },
  { key: "nip", header: "NIP" },
  {
    key: "createdAt",
    header: "Utworzono",
    cell: (c) =>
      c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—",
  },
];

export function CompanyListView() {
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
