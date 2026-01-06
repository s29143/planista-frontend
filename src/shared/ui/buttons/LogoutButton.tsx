import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/shared/api/authStore";
import { useLogout } from "@/shared/api/queries";

export function LogoutButton() {
  const logout = useLogout();
  const clear = useAuthStore((s) => s.clearSession);
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const onClick = async () => {
    try {
      await logout.mutateAsync();
    } finally {
      clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <Button variant="subtle" onClick={onClick}>
      {t("actions.logout", "Logout")}
    </Button>
  );
}
