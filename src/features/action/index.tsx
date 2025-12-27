import { lazy } from "react";

const ActionListPage = lazy(() => import("./ui/ActionListPage"));
const ActionCreatePage = lazy(() => import("./ui/ActionCreatePage"));
const ActionUpdatePage = lazy(() => import("./ui/ActionUpdatePage"));

export const actionRoutes = [
  { index: true, element: <ActionListPage /> },
  { path: ":id", element: <ActionUpdatePage /> },
  { path: "create", element: <ActionCreatePage /> },
];
