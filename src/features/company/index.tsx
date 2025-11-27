import { lazy } from "react";

const CompanyListPage = lazy(() => import("./ui/CompanyListPage"));
const CompanyCreatePage = lazy(() => import("./ui/CompanyCreatePage"));
const CompanyUpdatePage = lazy(() => import("./ui/CompanyUpdatePage"));

export const companyRoutes = [
  { index: true, element: <CompanyListPage /> },
  { path: ":id", element: <CompanyUpdatePage /> },
  { path: "create", element: <CompanyCreatePage /> },
];
