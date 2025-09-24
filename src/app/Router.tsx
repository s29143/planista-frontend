import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import MainLayout from "@/shared/ui/layout/MainLayout";
import LoginLayout from "@/shared/ui/layout/LoginLayout";

const AuthModule = lazy(() => import("@/features/auth"));
const CompanyModule = lazy(() => import("@/features/company"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <Center mih={200}>
            <Loader />
          </Center>
        }
      >
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <div>Strona główna - dostęp tylko dla zalogowanych</div>,
      },
      {
        path: "companies",
        element: <CompanyModule />,
      },
      {
        path: "*",
        element: <div>Strona nie istnieje</div>,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense
        fallback={
          <Center mih={200}>
            <Loader />
          </Center>
        }
      >
        <LoginLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <AuthModule />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Strona nie istnieje</div>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
