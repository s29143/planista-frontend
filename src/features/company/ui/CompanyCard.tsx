import { Button, Group, Stack, Text } from "@mantine/core";
import type { Company } from "../model/store";

export default function CompanyCard(c: Company) {
  return (
    <Stack gap={6}>
      <Group justify="space-between" align="start">
        <div>
          <Text fw={600}>{c.shortName}</Text>
        </div>
      </Group>
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
