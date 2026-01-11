import { Button, Group, Modal, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ArrowDown, ArrowUp, ArrowUpDown, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  header?: string;
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
  canDelete = false,
  deleteFn,
}: {
  columns: ColumnDef<TRow>[];
  rows: TRow[];
  sort: SortState<TRow>;
  setSort: (by: keyof TRow) => void;
  canDelete?: boolean;
  deleteFn?: (row: any) => Promise<void>;
}) {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowToDelete, setRowToDelete] = useState<TRow | null>(null);
  const { t } = useTranslation();
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

  const handleConfirmDelete = async () => {
    if (!deleteFn || !rowToDelete) return;
    try {
      setIsDeleting(true);
      await deleteFn(rowToDelete);
      close();
      setRowToDelete(null);
    } catch (e) {
      notifications.show({
        title: t("actions.deleteFailed", "Delete failed"),
        message: (e as Error).message,
        color: "red",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const handleTrashClick = (e: React.MouseEvent, row: TRow) => {
    e.stopPropagation();
    if (!deleteFn) return;
    setRowToDelete(row);
    open();
  };
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          if (isDeleting) return;
          close();
        }}
        title={t("actions.delete", "Delete")}
        centered
      >
        <p>{t("actions.confirmDelete", "Confirm delete")}</p>
        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => {
              if (isDeleting) return;
              close();
            }}
          >
            Anuluj
          </Button>
          <Button
            color="red"
            onClick={handleConfirmDelete}
            loading={isDeleting}
          >
            Usuń
          </Button>
        </Group>
      </Modal>
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
                label={c.header ?? String(c.key)}
                sortable={c.sortable !== false}
              />
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <Table.Tr
              key={String((r as Row).id)}
              className="cursor-pointer"
              onClick={() => {
                navigate(String((r as Row).id));
              }}
            >
              {columns.map((c) => (
                <Table.Td key={String(c.key)}>
                  {c.cell ? c.cell(r) : (r as any)[c.key] ?? "—"}
                </Table.Td>
              ))}
              {canDelete && (
                <Table.Td
                  key={String((r as Row).id)}
                  style={{ width: 40 }}
                  onClick={(e) => handleTrashClick(e, r)}
                >
                  <TrashIcon size={16} />
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
