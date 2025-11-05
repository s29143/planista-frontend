import { useEffect, useMemo, useRef, useState } from "react";
import type z from "zod";
import { FilterBar, type FilterField } from "./FilterBar";
import {
  DataTableView,
  type ColumnDef,
  type PagedResponse,
  type QueryState,
  type SortState,
} from "./DataTableView";
import { create } from "zustand";
import {
  Badge,
  Button,
  Group,
  Loader,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export type DataListViewProps<TFilters extends Record<string, any>, TRow> = {
  filtersConfig: FilterField<Extract<keyof TFilters, string>>[];
  filtersSchema: z.ZodType<TFilters>;

  fetcher: (
    q: QueryState<TFilters, TRow>,
    signal?: AbortSignal
  ) => Promise<PagedResponse<TRow>>;

  columns: ColumnDef<TRow>[];

  initialPageSize?: number;
};

export function DataListView<TFilters extends Record<string, any>, TRow>({
  filtersConfig,
  filtersSchema,
  fetcher,
  columns,
  initialPageSize = 10,
}: DataListViewProps<TFilters, TRow>) {
  const { t } = useTranslation();

  type Row = TRow;

  const useLocalStore = useMemo(
    () =>
      create<{
        query: QueryState<TFilters, Row>;
        totalElements: number;
        totalPages: number;
        setPage: (p: number) => void;
        setSize: (n: number) => void;
        setSort: (by: keyof Row) => void;
        setFilters: (patch: Partial<TFilters>) => void;
        setTotalElements: (n: number) => void;
        setTotalPages: (n: number) => void;
      }>((set, get) => ({
        query: {
          page: 0,
          size: initialPageSize,
          sortBy: null,
          sortDir: "asc",
          filters: filtersSchema.parse({}),
        },
        totalElements: 0,
        totalPages: 0,
        setPage: (p) => set((s) => ({ query: { ...s.query, page: p } })),
        setSize: (n) =>
          set((s) => ({ query: { ...s.query, page: 0, size: n } })),
        setSort: (by) => {
          const { sortBy, sortDir } = get().query as SortState<Row>;
          if (sortBy === by) {
            set((s) => ({
              query: {
                ...s.query,
                sortDir: sortDir === "asc" ? "desc" : "asc",
              },
            }));
          } else {
            set((s) => ({ query: { ...s.query, sortBy: by, sortDir: "asc" } }));
          }
        },
        setFilters: (patch) =>
          set((s) => ({
            query: {
              ...s.query,
              page: 0,
              filters: filtersSchema.parse({ ...s.query.filters, ...patch }),
            },
          })),
        setTotalElements: (n) => set({ totalElements: n }),
        setTotalPages: (n) => set({ totalPages: n }),
      })),
    [filtersSchema, initialPageSize]
  );

  const store = useLocalStore();
  const { query, totalElements } = store;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(() => JSON.stringify(query), [query]);
  const [debouncedKey] = useDebouncedValue(queryKey, 300);

  const queryRef = useRef(query);
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const setTotalElements = store.setTotalElements;
  const setTotalPages = store.setTotalPages;

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetcherRef
      .current(queryRef.current, ctrl.signal)
      .then((res) => {
        if (cancelled) return;
        setRows(res.content ?? []);
        setTotalElements(res.totalElements);
        setTotalPages(res.totalPages);
      })
      .catch((e) => {
        if (!axios.isCancel(e)) setError(e?.message ?? "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [debouncedKey, setTotalElements, setTotalPages]);

  return (
    <Stack gap="md">
      <FilterBar
        fields={filtersConfig}
        schema={filtersSchema}
        value={query.filters}
        onChange={(v) => store.setFilters(v)}
        onReset={() => store.setFilters(filtersSchema.parse({}))}
      />

      <Paper p="md" withBorder radius="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm" align="center">
            <Link to="create" style={{ textDecoration: "none" }}>
              <Button
                variant="filled"
                color="blue"
                leftSection={
                  <span style={{ fontWeight: "bold", fontSize: 18 }}>+</span>
                }
              >
                {t("actions.add", "Add")}
              </Button>
            </Link>
          </Group>
          <Group gap="sm">
            <Select
              value={String(query.size)}
              onChange={(v) => v && store.setSize(Number(v))}
              data={[10, 20, 50, 100].map((n) => ({
                value: String(n),
                label:
                  t("data.perPage", "Per page", {
                    count: n,
                  }) ?? `${n}/page`,
              }))}
            />
            <Badge variant="light" radius="sm">
              {t("data.total", "Total", { count: totalElements }) ??
                `Total: ${totalElements}`}
            </Badge>
          </Group>
        </Group>
      </Paper>

      <Paper p="md" withBorder radius="lg" mih={280}>
        {loading ? (
          <Group justify="center" py="xl">
            <Loader />
          </Group>
        ) : error ? (
          <Stack align="center" py="xl">
            <Text c="red">Error: {error}</Text>
            <Button
              variant="light"
              onClick={() => window.location.reload()}
              leftSection={<RefreshCw size={16} />}
            >
              Reload
            </Button>
          </Stack>
        ) : rows.length ? (
          <DataTableView
            columns={columns}
            rows={rows}
            sort={query}
            setSort={(col) => store.setSort(col)}
          />
        ) : (
          <Group justify="center" py="xl">
            <Text c="dimmed">{t("data.noRecords")}</Text>
          </Group>
        )}
      </Paper>

      <Group justify="center">
        <Pagination
          value={query.page + 1}
          onChange={(p) => store.setPage(p - 1)}
          total={Math.max(store.totalPages, 1)}
          withEdges
        />
      </Group>
    </Stack>
  );
}
