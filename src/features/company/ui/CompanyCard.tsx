import { Badge, Button, Group, Stack, Text } from "@mantine/core";
import type { Company } from "./CompanyListView";

// 5.6 Renderer karty (grid)
export default function CompanyCard(c: Company) {
  return (
    <Stack gap={6}>
      <Group justify="space-between" align="start">
        <div>
          <Text fw={600}>{c.name}</Text>
          <Text size="sm" c="dimmed">
            {c.city ?? "—"}
          </Text>
        </div>
        {c.status && (
          <Badge
            color={
              c.status === "active"
                ? "green"
                : c.status === "prospect"
                ? "yellow"
                : "gray"
            }
          >
            {c.status === "active"
              ? "Aktywna"
              : c.status === "prospect"
              ? "Prospekt"
              : "Nieaktywna"}
          </Badge>
        )}
      </Group>
      <Text size="sm">Branża: {c.industry ?? "—"}</Text>
      <Text size="sm">NIP: {c.taxId ?? "—"}</Text>
      <Text size="sm">Pracownicy: {c.employeesCount ?? "—"}</Text>
      <Text size="sm">
        Utworzono:{" "}
        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
      </Text>
      <Group justify="end" mt="xs">
        <Button
          component="a"
          href={`/companies/${c.id}`}
          variant="light"
          size="xs"
        >
          Otwórz
        </Button>
      </Group>
    </Stack>
  );
}
