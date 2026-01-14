import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Accordion,
  Box,
  Group,
  Text,
  Table,
  Pagination,
  Loader,
  Center,
  Button,
} from "@mantine/core";
import { ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/http";
import type { ColumnDef } from "./DataTableView";
import { useTranslation } from "react-i18next";

type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

type Identifiable = { id: number | string };

export function Section<TRow extends Identifiable>({
  icon,
  label,
  url,
  module,
  translationModule,
  columns,
  params,
  pageSize = 20,
  getRowPath,
}: {
  icon: React.ReactNode;
  label: string;
  url: string;
  module: string;
  translationModule: string;
  columns: ColumnDef<TRow>[];
  params?: Record<string, string>;
  pageSize?: number;
  getRowPath?: (row: TRow) => string;
}) {
  const navigate = useNavigate();

  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Page<TRow> | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(translationModule);

  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;
  const queryParams = new URLSearchParams(params);

  const fetchRows = useCallback(
    async (params: { page: number; size: number }) => {
      const res = await http<Page<TRow>>(url, { params });
      return res.data;
    },
    [url]
  );

  useEffect(() => {
    setPage(1);
  }, [url]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchRows({ page: page - 1, size: pageSize })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchRows, page, pageSize]);

  const headerCells = useMemo(
    () =>
      columns.map((c, idx) => (
        <Table.Th key={idx} style={c.width ? { width: c.width } : undefined}>
          {t(c.header ?? String(c.key))}
        </Table.Th>
      )),
    [columns, t]
  );

  const bodyRows = useMemo(() => {
    const content = data?.content ?? [];
    return content.map((r) => {
      const path = getRowPath?.(r) ?? `/${module}/${r.id}`;

      return (
        <Table.Tr
          key={String(r.id)}
          onClick={() => navigate(path)}
          style={{ cursor: "pointer" }}
        >
          {columns.map((c, idx) => {
            const value =
              c.cell?.(r) ?? (c.key ? (r[c.key] as React.ReactNode) : null);

            return <Table.Td key={idx}>{value}</Table.Td>;
          })}
        </Table.Tr>
      );
    });
  }, [data, columns, navigate, module, getRowPath]);

  return (
    <Accordion
      chevron={<ChevronDown size={16} />}
      variant="contained"
      value={opened ? "panel" : null}
      onChange={(v) => setOpened(v === "panel")}
    >
      <Accordion.Item value="panel">
        <Accordion.Control icon={icon}>
          <Group justify="space-between" w="100%">
            <Group gap="xs" align="center">
              <Text fw={600}>{`${label} (${totalElements})`}</Text>
              <Link
                to={{
                  pathname: `/${module}/create`,
                  search: queryParams.toString(),
                }}
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="filled"
                  color="blue"
                  leftSection={
                    <span style={{ fontWeight: "bold", fontSize: 18 }}>+</span>
                  }
                >
                  {t("common:actions.add", "Add")}
                </Button>
              </Link>
            </Group>

            {loading ? <Loader size="xs" /> : null}
          </Group>
        </Accordion.Control>

        <Accordion.Panel>
          <Box>
            {loading && !data ? (
              <Center py="md">
                <Loader size="sm" />
              </Center>
            ) : (
              <>
                <Table
                  striped
                  highlightOnHover
                  withTableBorder
                  withColumnBorders
                >
                  <Table.Thead>
                    <Table.Tr>{headerCells}</Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {bodyRows.length ? (
                      bodyRows
                    ) : (
                      <Table.Tr>
                        <Table.Td colSpan={columns.length}>
                          <Text c="dimmed" size="sm">
                            {t("common:messages.noData", "No data")}
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>

                <Group justify="space-between" mt="md">
                  <Text size="sm" c="dimmed">
                    {page} z {Math.max(totalPages, 1)}
                  </Text>

                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={Math.max(totalPages, 1)}
                    disabled={loading || totalPages <= 1}
                  />
                </Group>
              </>
            )}
          </Box>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
