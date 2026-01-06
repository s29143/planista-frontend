import type { PagedResponse, QueryState } from "@/shared/ui/DataTableView";
import { http } from "@/shared/api/http";
import z from "zod";
import type { User } from "@/shared/types/user";
import type { SortDir } from "@/shared/helpers";
import type { Filters } from "../model/schema";

export type UsersQuery = {
  page: number;
  pageSize: number;
  sortBy?: keyof User | null;
  sortDir?: SortDir;
  filters: Filters;
};

export const userFiltersSchema = z.object({
  search: z.string().trim().optional().default(""),
});

export type UserFilters = z.infer<typeof userFiltersSchema>;
export type CompaniesResponse = {
  content: User[];
  total: number;
};

export async function fetchUsers(
  q: QueryState<UserFilters, User>,
  signal?: AbortSignal
) {
  const params: Record<string, any> = {
    page: q.page,
    size: q.size,
  };
  if (q.sortBy) {
    params.sort = q.sortBy + (q.sortDir === "desc" ? ",desc" : ",asc");
  }
  const { search } = q.filters;
  if (search) params.search = search;

  const res = await http.get<PagedResponse<User>>("/users", {
    params,
    signal,
  });
  return res.data;
}
