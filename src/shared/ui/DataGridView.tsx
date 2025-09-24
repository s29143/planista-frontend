import { Card, Group, SimpleGrid, Text } from "@mantine/core";

export function DataGridView<TRow>({
  rows,
  renderCard,
  emptyLabel,
}: {
  rows: TRow[];
  renderCard: (row: TRow) => React.ReactNode;
  emptyLabel?: React.ReactNode;
}) {
  if (!rows.length)
    return (
      <Group justify="center" py="xl">
        <Text c="dimmed">{emptyLabel ?? "No data"}</Text>
      </Group>
    );

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {rows.map((r, i) => (
        <Card key={i} withBorder shadow="sm" radius="lg" p="md">
          {renderCard(r)}
        </Card>
      ))}
    </SimpleGrid>
  );
}
