import { create } from "zustand";
import { http } from "@/shared/api/http";
import type { GanttItem } from "@/shared/types/ganttItem";

type State = {
  items: GanttItem[];
  loading: boolean;
  fetch: (from: string, to: string) => Promise<void>;
};

export const useGanttStore = create<State>((set) => ({
  items: [],
  loading: false,
  fetch: async (from, to) => {
    set({ loading: true });
    try {
      const { data } = await http.get<GanttItem[]>("/gantt", {
        params: { from, to },
      });
      set({ items: data });
    } finally {
      set({ loading: false });
    }
  },
}));
