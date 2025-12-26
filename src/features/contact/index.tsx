import { lazy } from "react";

const ContactListPage = lazy(() => import("./ui/ContactListPage"));
const ContactCreatePage = lazy(() => import("./ui/ContactCreatePage"));
const ContactUpdatePage = lazy(() => import("./ui/ContactUpdatePage"));

export const contactRoutes = [
  { index: true, element: <ContactListPage /> },
  { path: ":id", element: <ContactUpdatePage /> },
  { path: "create", element: <ContactCreatePage /> },
];
