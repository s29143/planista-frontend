import { create } from "zustand";
import { http } from "@/shared/api/http";
import type { Process } from "@/shared/types/process";
import { fetchOptions, type Option } from "@/shared/api/fetchOptions";

type KanbanState = {
  statuses: Option[];
  processes: Process[];
  loading: boolean;
  fetchAll: () => Promise<void>;
};

export const useKanbanStore = create<KanbanState>((set) => ({
  statuses: [],
  processes: [],
  loading: false,

  fetchAll: async () => {
    set({ loading: true });

    const [statuses, processes] = await Promise.all([
      fetchOptions("/dict/process-statuses"),
      http.get("/processes").then((r) => r.data.content ?? r.data),
    ]);
    set({
      statuses,
      processes,
      loading: false,
    });
  },
}));
