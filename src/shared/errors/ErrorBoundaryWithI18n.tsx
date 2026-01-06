import { useTranslation } from "react-i18next";
import { ErrorBoundary } from "./ErrorBoundary";

export function ErrorBoundaryWithI18n({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return <ErrorBoundary t={t}>{children}</ErrorBoundary>;
}
