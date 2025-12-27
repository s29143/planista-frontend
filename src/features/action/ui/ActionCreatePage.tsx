import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import ActionForm from "./ActionForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

export default function ActionCreatePage() {
  const { t } = useTranslation();
  const { t: tAction } = useTranslation("action");
  const navigate = useNavigate();
  return (
    <ActionForm
      save={async (values) => {
        const { data } = await http.post("/actions", values);
        return { id: data?.id as string | undefined };
      }}
      title={tAction("title.create")}
      onSuccess={(id) => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(id ? `/actions/${id}` : "/actions");
      }}
    />
  );
}
