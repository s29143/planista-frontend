import { lazy } from "react";

const ProcessCreatePage = lazy(() => import("./ui/ProcessCreatePage"));
const ProcessUpdatePage = lazy(() => import("./ui/ProcessUpdatePage"));

export const processRoutes = [
  { path: ":id", element: <ProcessUpdatePage /> },
  { path: "create", element: <ProcessCreatePage /> },
];
