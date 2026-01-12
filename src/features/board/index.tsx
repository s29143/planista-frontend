import { lazy } from "react";

const KanbanBoard = lazy(() => import("./ui/KanbanBoard"));

export const boardPage = [{ index: true, element: <KanbanBoard /> }];
