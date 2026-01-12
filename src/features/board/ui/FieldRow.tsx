import { Group, Stack, Text, ThemeIcon } from "@mantine/core";

export default function FieldRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  return (
    <Group gap={8} wrap="nowrap" align="flex-start">
      <ThemeIcon variant="light" size="sm" radius="xl">
        {icon}
      </ThemeIcon>
      <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500} lineClamp={1}>
          {value ?? "—"}
        </Text>
      </Stack>
    </Group>
  );
}
