import z from "zod";
import { create } from "zustand";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  email?: string;
  company?: { id: string; shortName: string };
  user?: { id: string; name: string };
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

type ContactStore = {
  page: number;
  pageSize: number;
  sortBy: keyof Contact | null;
  sortDir: SortDir;
  total: number;
  filters: Filters;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  setSort: (by: keyof Contact) => void;
  setFilters: (f: Partial<Filters>) => void;
  setTotal: (t: number) => void;
  resetFilters: () => void;
};

export const useContactStore = create<ContactStore>((set, get) => ({
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
