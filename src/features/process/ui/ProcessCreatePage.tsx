import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import ProcessForm from "./ProcessForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

export default function ProcessCreatePage() {
  const { t } = useTranslation();
  const { t: tProcess } = useTranslation("process");
  const navigate = useNavigate();
  return (
    <ProcessForm
      save={async (values) => {
        const { data } = await http.post("/processes", values);
        return { id: data?.id as string | undefined };
      }}
      title={tProcess("title.create")}
      onSuccess={(id) => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(id ? `/processes/${id}` : "/processes");
      }}
    />
  );
}
