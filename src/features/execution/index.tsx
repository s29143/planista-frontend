import { lazy } from "react";

const ExecutionCreatePage = lazy(() => import("./ui/ExecutionCreatePage"));
const ExecutionUpdatePage = lazy(() => import("./ui/ExecutionUpdatePage"));

export const executionRoutes = [
  { path: ":id", element: <ExecutionUpdatePage /> },
  { path: "create", element: <ExecutionCreatePage /> },
];
