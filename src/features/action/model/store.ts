import type { Company } from "@/features/company/model/store";
import type { Contact } from "@/features/contact/model/store";
import z from "zod";
import { create } from "zustand";

export type Action = {
  id: string;
  date: string;
  text: string;
  done: boolean;
  prior: boolean;
  reminder: boolean;
  user: { id: string; name: string };
  company?: Company;
  contact?: Contact;
  type?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
};

export const FiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
  company: z.string().trim().optional().default(""),
  user: z.string().array().optional().default([]),
  type: z.string().array().optional().default([]),
});

export type Filters = z.infer<typeof FiltersSchema>;

export type SortDir = "asc" | "desc";

type ActionStore = {
  page: number;
  pageSize: number;
  sortBy: keyof Action | null;
  sortDir: SortDir;
  total: number;
  filters: Filters;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setSort: (by: keyof Action) => void;
  setFilters: (f: Partial<Filters>) => void;
  setTotal: (t: number) => void;
  resetFilters: () => void;
};

export const useActionStore = create<ActionStore>((set, get) => ({
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
    })),
  setTotal: (t) => set({ total: t }),
  resetFilters: () => set({ filters: FiltersSchema.parse({}), page: 1 }),
}));
