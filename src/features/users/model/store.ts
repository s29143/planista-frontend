import z from "zod";
import { create } from "zustand";

export type User = {
id: string;
username: string;
firstname: string;
lastname: string;
};


const FiltersSchema = z.object({
q: z.string().trim().optional().default(""),});
export type Filters = z.infer<typeof FiltersSchema>;


export type SortDir = "asc" | "desc";


type UserStore = {
  page: number;
  pageSize: number;
  sortBy: keyof User | null;
  sortDir: SortDir;
  total: number;
  filters: Filters;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setSort: (by: keyof User) => void;
  setFilters: (f: Partial<Filters>) => void;
  setTotal: (t: number) => void;
  resetFilters: () => void;
};


export const useUserStore = create<UserStore>((set, get) => ({
  page: 1,
  pageSize: 10,
  sortBy: null,
  sortDir: "asc",
  total: 0,
  filters: FiltersSchema.parse({}),
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