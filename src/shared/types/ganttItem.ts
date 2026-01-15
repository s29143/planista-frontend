export type GanttItem = {
  id: string;
  text: string;
  start: string;
  end: string;
  type: "ORDER" | "PROCESS";
  parentId?: string;
};
