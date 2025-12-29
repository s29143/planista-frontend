import { lazy } from "react";

const OrderListPage = lazy(() => import("./ui/OrderListPage"));
const OrderCreatePage = lazy(() => import("./ui/OrderCreatePage"));
const OrderUpdatePage = lazy(() => import("./ui/OrderUpdatePage"));

export const orderRoutes = [
  { index: true, element: <OrderListPage /> },
  { path: ":id", element: <OrderUpdatePage /> },
  { path: "create", element: <OrderCreatePage /> },
];
