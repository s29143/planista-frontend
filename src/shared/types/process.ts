import type { Order } from "./order";

export type Process = {
  id: string;
  quantity: number;
  plannedTime: string;
  order: Order;
  technology?: { id: string; name: string };
  status?: { id: string; name: string };
  workstation?: {
    id: string;
    name: string;
    technology: { id: string; name: string };
  };
  createdAt?: string;
  updatedAt?: string;
};
