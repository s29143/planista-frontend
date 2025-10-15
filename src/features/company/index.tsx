import { lazy } from "react";
import CompanyUpdatePage from "./ui/CompanyUpdatePage";

const CompanyListPage = lazy(() => import("./ui/CompanyListPage"));
const CompanyCreatePage = lazy(() => import("./ui/CompanyCreatePage"));
// const CompanyDetailsPage = lazy(() => import("./ui/CompanyDetailsPage"));

export const companyRoutes = [
  { index: true, element: <CompanyListPage /> },
  { path: ":id", element: <CompanyUpdatePage /> },
  { path: "create", element: <CompanyCreatePage /> },
];
