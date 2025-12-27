import z from "zod";
import { create } from "zustand";

export type DictItem = {
  id: string;
  name: string;
};

const FiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
});
export type Filters = z.infer<typeof FiltersSchema>;

export type SortDir = "asc" | "desc";

type DictItemStore = {
  page: number;
  pageSize: number;
  sortBy: keyof DictItem | null;
  sortDir: SortDir;
  total: number;
  filters: Filters;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setSort: (by: keyof DictItem) => void;
  setFilters: (f: Partial<Filters>) => void;
  setTotal: (t: number) => void;
  resetFilters: () => void;
};

export const useDictItemStore = create<DictItemStore>((set, get) => ({
  page: 1,
  pageSize: 20,
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
    })),
  setTotal: (t) => set({ total: t }),
  resetFilters: () => set({ filters: FiltersSchema.parse({}) }),
}));
