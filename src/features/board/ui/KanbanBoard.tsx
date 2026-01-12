import {
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useKanbanStore } from "../store/store";
import { useTranslation } from "react-i18next";
import ProcessTile from "./ProcessTile";

export default function KanbanBoard() {
  const { statuses, loading, fetchAll } = useKanbanStore();
  const processes = useKanbanStore((s) => s.processes);
  const { t } = useTranslation("process");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const byStatus = useMemo(() => {
    const map = new Map<number, any[]>();
    statuses.forEach((s) => map.set(Number(s.value), []));
    processes.forEach((p: any) => {
      const sid = p?.status?.id;
      if (sid != null) {
        const key = Number(sid);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(p);
      }
    });
    return map;
  }, [statuses, processes]);

  if (loading) {
    return (
      <Paper withBorder radius="xl" p="md">
        <Loader />
      </Paper>
    );
  }

  return (
    <Center>
      <Box className="mt-8">
        <Group
          align="flex-start"
          wrap="nowrap"
          gap="md"
          style={{ overflowX: "auto" }}
        >
          {statuses.map((status) => {
            const items = byStatus.get(Number(status.value)) ?? [];

            return (
              <Paper
                key={status.value}
                withBorder
                radius="xl"
                p="md"
                w={340}
                style={{
                  flex: "0 0 340px",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0) 100%)",
                }}
              >
                <Group justify="space-between" mb="sm" wrap="nowrap">
                  <Group gap={8} wrap="nowrap" style={{ minWidth: 0 }}>
                    <Title order={5} lineClamp={1}>
                      {status.label}
                    </Title>
                  </Group>
                  <Badge variant="light" radius="xl">
                    {items.length}
                  </Badge>
                </Group>

                <ScrollArea h={520} type="auto" offsetScrollbars>
                  <Stack gap="sm">
                    {items.length === 0 ? (
                      <Paper withBorder radius="lg" p="sm">
                        <Text size="sm" c="dimmed">
                          {t("noProcesses")}
                        </Text>
                      </Paper>
                    ) : (
                      items.map((process) => (
                        <ProcessTile key={process.id} process={process} />
                      ))
                    )}
                  </Stack>
                </ScrollArea>
              </Paper>
            );
          })}
        </Group>
      </Box>
    </Center>
  );
}
