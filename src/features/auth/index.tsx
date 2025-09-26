import { lazy } from "react";

const LoginPage = lazy(() => import("./ui/LoginPage"));

export const authRoutes = [{ index: true, element: <LoginPage /> }];
