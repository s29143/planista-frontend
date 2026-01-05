import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import ProcessForm from "./ProcessForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/processSchema";
import { useEffect, useState } from "react";

export default function ProcessUpdatePage() {
  const { t } = useTranslation();
  const { t: tProcess } = useTranslation("process");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    processs: "/processes",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );
  const s = (v: unknown) => (v == null ? "" : String(v));
  const idOrUndef = (v: unknown) => (v == null ? undefined : Number(v));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${API.processs}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          quantity: data.quantity ?? undefined,
          plannedTime: s(data.plannedTime),
          orderId: idOrUndef(data?.order?.id),
          statusId: idOrUndef(data?.status?.id),
          technologyId: idOrUndef(data?.technology?.id),
          workstationId: idOrUndef(data?.workstation?.id),
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
        navigate("/processes");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.processs]);

  return (
    <ProcessForm
      loading={loading}
      save={async (values) => {
        await http.put(`/processes/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tProcess("title.update")}
    />
  );
}
