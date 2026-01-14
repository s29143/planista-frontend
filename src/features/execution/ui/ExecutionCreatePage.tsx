import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import ExecutionForm from "./ExecutionForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { durationToSeconds } from "@/shared/helpers";

export default function ExecutionCreatePage() {
  const { t } = useTranslation();
  const { t: tExecution } = useTranslation("execution");
  const navigate = useNavigate();
  return (
    <ExecutionForm
      save={async (values) => {
        values.timeInSeconds = durationToSeconds(values.timeForm);
        const { data } = await http.post("/executions", values);
        return { id: data?.id as string | undefined };
      }}
      title={tExecution("title.create")}
      onSuccess={() => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(-1);
      }}
    />
  );
}
