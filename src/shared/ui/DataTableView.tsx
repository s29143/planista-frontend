import { Button, Table } from "@mantine/core";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type SortDir = "asc" | "desc";

export type PageState = {
  page: number;
  size: number;
};

export type SortState<T> = {
  sortBy: keyof T | null;
  sortDir: SortDir;
};

export type QueryState<TFilters, TRow> = PageState &
  SortState<TRow> & {
    filters: TFilters;
  };

export type PagedResponse<TRow> = {
  content: TRow[];
  totalElements: number;
  totalPages: number;
};

export type ColumnDef<TRow> = {
  key: keyof TRow;
  header: React.ReactNode;
  width?: number | string;
  cell?: (row: TRow) => React.ReactNode;
  sortable?: boolean;
  serverSortKey?: string;
};

interface Row {
  id: number;
}

export function DataTableView<TRow>({
  columns,
  rows,
  sort,
  setSort,
}: {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  sort: SortState<TRow>;
  setSort: (by: keyof TRow) => void;
}) {
  const navigate = useNavigate();

  const Th = ({
    col,
    label,
    sortable = true,
  }: {
    col: keyof TRow;
    label: React.ReactNode;
    sortable?: boolean;
  }) => {
    const active = sort.sortBy === col;
    const Icon = !active
      ? ArrowUpDown
      : sort.sortDir === "asc"
      ? ArrowUp
      : ArrowDown;
    const ariaSort = !sortable
      ? "none"
      : active
      ? sort.sortDir === "asc"
        ? "ascending"
        : "descending"
      : "none";
    console.log(columns);

    return (
      <th
        style={{ width: columns.find((c) => c.key === col)?.width }}
        aria-sort={ariaSort as React.AriaAttributes["aria-sort"]}
      >
        <Button
          variant="subtle"
          size="compact-sm"
          onClick={() => sortable && setSort(col)}
          leftSection={sortable ? <Icon size={14} /> : undefined}
          title={
            sortable
              ? active
                ? `Sort: ${String(col)} (${sort.sortDir})`
                : `Sort: ${String(col)}`
              : undefined
          }
          styles={{ root: { cursor: sortable ? "pointer" : "default" } }}
        >
          {label}
        </Button>
      </th>
    );
  };

  return (
    <Table
      stickyHeader
      withTableBorder
      withColumnBorders
      highlightOnHover
      verticalSpacing="sm"
    >
      <Table.Thead>
        <Table.Tr>
          {columns.map((c) => (
            <Th
              key={String(c.key)}
              col={c.key}
              label={c.header}
              sortable={c.sortable !== false}
            />
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((r) => (
          <Table.Tr
            key={String((r as Row).id)}
            onClick={() => {
              navigate(String((r as Row).id));
            }}
          >
            {columns.map((c) => (
              <Table.Td key={String(c.key)}>
                {c.cell ? c.cell(r) : (r as any)[c.key] ?? "—"}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
