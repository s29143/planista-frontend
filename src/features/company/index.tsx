import { lazy } from "react";

const CompanyListPage = lazy(() => import("./ui/CompanyListPage"));
const CompanyCreatePage = lazy(() => import("./ui/CompanyCreatePage"));
// const CompanyDetailsPage = lazy(() => import("./ui/CompanyDetailsPage"));

export const companyRoutes = [
  { index: true, element: <CompanyListPage /> },
  { path: "create", element: <CompanyCreatePage /> },
  // { path: ":id", element: <CompanyDetailsPage /> },
];
