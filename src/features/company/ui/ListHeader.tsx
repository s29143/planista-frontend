import { useTranslation } from "react-i18next";
import { useCompanyStore } from "../model/store";
import { Badge, Group, SegmentedControl, Select, Text } from "@mantine/core";
import { Grid3x3, TableIcon } from "lucide-react";

export default function ListHeader() {
  const { t } = useTranslation();
  const { view, setView, pageSize, setPageSize, total } = useCompanyStore();

  return (
    <Group justify="space-between" align="center">
      <SegmentedControl
        value={view}
        onChange={(v) => setView(v as any)}
        data={[
          {
            value: "table",
            label: (
              <Group gap={6}>
                <TableIcon size={16} />
                <Text>{t("companies.view.table")}</Text>
              </Group>
            ),
          },
          {
            value: "grid",
            label: (
              <Group gap={6}>
                <Grid3x3 size={16} />
                <Text>{t("companies.view.grid")}</Text>
              </Group>
            ),
          },
        ]}
      />

      <Group gap="sm">
        <Select
          value={String(pageSize)}
          onChange={(v) => v && setPageSize(Number(v))}
          data={[10, 20, 50, 100].map((n) => ({
            value: String(n),
            label: t("data.perPage", { count: n }),
          }))}
        />
        <Badge variant="light" radius="sm">
          {t("data.total", { count: total })}
        </Badge>
      </Group>
    </Group>
  );
}
