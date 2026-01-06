import { Navigate, useLocation } from "react-router-dom";
import { Loader, Center } from "@mantine/core";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/api/authStore";
import { useMe } from "@/shared/api/queries";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isBootstrapped, setBootstrapped, accessToken, setSession } =
    useAuthStore();
  const location = useLocation();

  const { data, isLoading, isError } = useMe(!isBootstrapped);

  useEffect(() => {
    if (!isBootstrapped && data) {
      setSession(data, accessToken ?? "");
      setBootstrapped(true);
    } else if (!isBootstrapped && (isError || !isLoading)) {
      setBootstrapped(true);
    }
  }, [
    isBootstrapped,
    data,
    isError,
    isLoading,
    accessToken,
    setBootstrapped,
    setSession,
  ]);

  if (!isBootstrapped || isLoading) {
    return (
      <Center mih={200}>
        <Loader />
      </Center>
    );
  }

  if (!useAuthStore.getState().user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
