import z from "zod";
import { create } from "zustand";

export type Company = {
id: string;
fullName: string;
shortName: string;
nip?: string;
district?: { id: string; name: string };
industry?: { id: string; name: string };
status: { id: string; name: string };
createdAt?: string;
updatedAt?: string;
};


const FiltersSchema = z.object({
q: z.string().trim().optional().default(""),
city: z.string().trim().optional(),
industry: z.string().trim().optional(),
status: z.enum(["active", "inactive", "prospect"]).optional(),
employeesMin: z.number().int().nonnegative().optional(),
employeesMax: z.number().int().nonnegative().optional(),
created: z
.tuple([z.date().optional(), z.date().optional()])
.optional()
.default([undefined, undefined]),
});
export type Filters = z.infer<typeof FiltersSchema>;


export type SortDir = "asc" | "desc";


type CompanyStore = {
  view: "table" | "grid";
  page: number;
  pageSize: number;
  sortBy: keyof Company | null;
  sortDir: SortDir;
  total: number;
  filters: Filters;
  setView: (v: CompanyStore["view"]) => void;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setSort: (by: keyof Company) => void;
  setFilters: (f: Partial<Filters>) => void;
  setTotal: (t: number) => void;
  resetFilters: () => void;
};


export const useCompanyStore = create<CompanyStore>((set, get) => ({
  view: "table",
  page: 1,
  pageSize: 10,
  sortBy: null,
  sortDir: "asc",
  total: 0,
  filters: FiltersSchema.parse({}),
    setView: (v) => set({ view: v }),
    setPage: (p) => set({ page: p }),
    setPageSize: (s) => set({ pageSize: s, page: 1 }),
    setSort: (by) => {
    const { sortBy, sortDir } = get();
    if (sortBy === by) {
      set({ sortDir: sortDir === "asc" ? "desc" : "asc" });
    } else {
      set({ sortBy: by, sortDir: "asc" });
    }
  },
  setFilters: (f) =>
  set((state) => ({
    filters: FiltersSchema.parse({ ...state.filters, ...f }),
    page: 1,
    })
  ),
  setTotal: (t) => set({ total: t }),
  resetFilters: () => set({ filters: FiltersSchema.parse({}), page: 1 }),
}));