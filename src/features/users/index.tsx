import { lazy } from "react";

const UserListPage = lazy(() => import("./ui/UserListPage"));
const UserCreatePage = lazy(() => import("./ui/UserCreatePage"));
const UserUpdatePage = lazy(() => import("./ui/UserUpdatePage"));

export const userRoutes = [
  { index: true, element: <UserListPage /> },
  { path: ":id", element: <UserUpdatePage /> },
  { path: "create", element: <UserCreatePage /> },
];
