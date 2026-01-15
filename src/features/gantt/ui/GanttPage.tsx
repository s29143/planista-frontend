import { useEffect, useMemo, useState } from "react";
import { Paper, Group, Loader, Button, Text } from "@mantine/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Gantt, WillowDark } from "@svar-ui/react-gantt";
import "@svar-ui/react-gantt/all.css";
import { useNavigate } from "react-router-dom";
import { useGanttStore } from "../store/store";
import dayjs from "dayjs";
import classes from "./GanttPage.module.css";
import { useTranslation } from "react-i18next";

export default function GanttPage() {
  const { items, loading, fetch } = useGanttStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { t: tGantt } = useTranslation("gantt");
  const [cursor, setCursor] = useState(() => dayjs().startOf("month"));

  useEffect(() => {
    const from = cursor.startOf("month").format("YYYY-MM-DD");
    const to = cursor.endOf("month").format("YYYY-MM-DD");
    fetch(from, to);
  }, [fetch, cursor]);

  const tasks = useMemo(
    () =>
      items.map((o) => ({
        id: o.id,
        text: o.text,
        start: new Date(o.start),
        end: new Date(o.end),
        type: "task",
        parent: o.parentId ?? undefined,
        open: o.type === "ORDER",
        details: o.type,
      })),
    [items]
  );

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <Button
            variant="light"
            size="xs"
            leftSection={<ChevronLeft size={16} />}
            onClick={() => setCursor((d) => d.subtract(1, "month"))}
          >
            {t("actions.back")}
          </Button>

          <Text fw={600}>{cursor.format("MMMM YYYY")}</Text>

          <Button
            variant="light"
            size="xs"
            rightSection={<ChevronRight size={16} />}
            onClick={() => setCursor((d) => d.add(1, "month"))}
          >
            {t("actions.next")}
          </Button>
        </Group>

        {loading && <Loader size="sm" />}
      </Group>

      <div className={classes.ganttWrap}>
        <WillowDark>
          <Gantt
            tasks={tasks}
            columns={[
              {
                id: "text",
                header: tGantt("columns.task"),
                width: 360,
                tree: true,
              },
              { id: "details", header: tGantt("columns.type"), width: 120 },
            ]}
            onTaskClick={(id) => {
              const s = String(id);
              if (s.startsWith("ORDER-"))
                navigate(`/orders/${s.replace("ORDER-", "")}`);
              if (s.startsWith("PROCESS-"))
                navigate(`/processes/${s.replace("PROCESS-", "")}`);
            }}
          />
        </WillowDark>
      </div>
    </Paper>
  );
}
