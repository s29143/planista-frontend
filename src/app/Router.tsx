import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { Center, Loader } from "@mantine/core";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import MainLayout from "@/shared/ui/layout/MainLayout";
import LoginLayout from "@/shared/ui/layout/LoginLayout";
import { authRoutes } from "@/features/auth";
import { companyRoutes } from "@/features/company";
import { dictItemRoutes } from "@/features/dictonaries";

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
        children: companyRoutes,
      },
      {
        path: "dictionaries",
        children: dictItemRoutes,
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
    children: authRoutes,
  },
  {
    path: "*",
    element: <div>Strona nie istnieje</div>,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
