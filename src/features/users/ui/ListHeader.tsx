import { useTranslation } from "react-i18next";
import { useUserStore } from "../model/store";
import { Badge, Group, Select } from "@mantine/core";

export default function ListHeader() {
  const { t } = useTranslation();
  const { pageSize, setPageSize, total } = useUserStore();

  return (
    <Group justify="space-between" align="center">
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
