import { lazy } from "react";

const DictItemListPage = lazy(() => import("./ui/DictItemListPage"));
const DictItemCreatePage = lazy(() => import("./ui/DictItemCreatePage"));
const DictItemUpdatePage = lazy(() => import("./ui/DictItemUpdatePage"));

export const dictItemRoutes = [
  { path: ":module", element: <DictItemListPage /> },
  { path: ":module/create", element: <DictItemCreatePage /> },
  { path: ":module/:id", element: <DictItemUpdatePage /> },
];
