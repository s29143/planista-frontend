import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import ExecutionForm from "./ExecutionForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/schema";
import { useEffect, useState } from "react";
import {
  durationToSeconds,
  idOrUndef,
  secondsToDurationParts,
} from "@/shared/helpers";

export default function ExecutionUpdatePage() {
  const { t } = useTranslation();
  const { t: tExecution } = useTranslation("execution");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    execution: "/executions",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${API.execution}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          quantity: data.quantity,
          timeForm: secondsToDurationParts(data.timeInSeconds),
          processId: idOrUndef(data?.process?.id),
        };

        setInitial(mapped);
      } catch (e: any) {
        console.error(e);
        notifications.show({
          color: "red",
          icon: <X size={18} />,
          title: t("messages.error"),
          message: e?.message ?? t("messages.notFound"),
        });
        navigate("/executions");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.execution]);

  return (
    <ExecutionForm
      loading={loading}
      save={async (values) => {
        values.timeInSeconds = durationToSeconds(values.timeForm);
        await http.put(`/executions/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tExecution("title.update")}
    />
  );
}
