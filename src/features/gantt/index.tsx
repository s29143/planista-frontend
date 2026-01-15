import { lazy } from "react";

const GanttPage = lazy(() => import("./ui/GanttPage"));

export const ganttRoutes = [{ index: true, element: <GanttPage /> }];
