import type { Company, Filters, SortDir } from "../model/store";
import { http } from "@/shared/api/http";

export type CompaniesQuery = {
page: number;
pageSize: number;
sortBy?: keyof Company | null;
sortDir?: SortDir;
filters: Filters;
};


export type CompaniesResponse = {
content: Company[];
total: number;
};


export async function fetchCompanies(q: CompaniesQuery, signal?: AbortSignal) {
// Mapowanie filtrów na query params
const params: Record<string, any> = {
  page: q.page,
  pageSize: q.pageSize,
};
if (q.sortBy) {
  params.sortBy = q.sortBy;
  params.sortDir = q.sortDir;
}
const { q: search, city, industry, status, employeesMin, employeesMax, created } = q.filters;
if (search)params.q = search;
if (city) params.city = city;
if (industry) params.industry = industry;
if (status) params.status = status;
if (employeesMin != null) params.employeesMin = employeesMin;
if (employeesMax != null) params.employeesMax = employeesMax;
if (created && (created[0] || created[1])) {
  params.createdFrom = created[0]?.toISOString();
  params.createdTo = created[1]?.toISOString();
}


const res = await http.get<CompaniesResponse>("/companies", { params, signal });
return res.data;
}