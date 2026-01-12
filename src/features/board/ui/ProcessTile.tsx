import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { Cpu, Package, Wrench } from "lucide-react";
import FieldRow from "./FieldRow";
import { useTranslation } from "react-i18next";

export default function ProcessTile({ process }: { process: any }) {
  const { t } = useTranslation("process");
  return (
    <Paper
      withBorder
      radius="lg"
      p="sm"
      shadow="xs"
      style={{
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0px)";
      }}
    >
      <Group justify="space-between" align="center" mb="xs" wrap="nowrap">
        <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
          <Badge variant="light" radius="xl">
            #{process.id}
          </Badge>
          <Text fw={600} size="sm" lineClamp={1}>
            {process.order?.name ?? "Brak zlecenia"}
          </Text>
        </Group>

        <Badge variant="outline" radius="xl">
          {process.quantity ?? "—"}
        </Badge>
      </Group>

      <Stack gap="xs">
        <FieldRow
          icon={<Cpu size={14} />}
          label={t("technology")}
          value={process.technology?.name}
        />
        <FieldRow
          icon={<Wrench size={14} />}
          label={t("workstation")}
          value={process.workstation?.name}
        />
        <FieldRow
          icon={<Package size={14} />}
          label={t("quantity")}
          value={process.quantity}
        />
      </Stack>
    </Paper>
  );
}
