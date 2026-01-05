import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import ActionForm from "./ActionForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/actionSchema";
import { useEffect, useState } from "react";

export default function ActionUpdatePage() {
  const { t } = useTranslation();
  const { t: tAction } = useTranslation("action");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    actions: "/actions",
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
        const { data } = await http.get(`${API.actions}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          date: s(data.date),
          text: s(data.text),
          done: data.done ?? false,
          prior: data.prior ?? false,
          reminder: data.reminder ?? false,
          companyId: idOrUndef(data?.company?.id),
          userId: idOrUndef(data?.user?.id),
          typeId: idOrUndef(data?.type?.id),
          contactId: idOrUndef(data?.contact?.id),
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
        navigate("/actions");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.actions]);

  return (
    <ActionForm
      loading={loading}
      save={async (values) => {
        await http.put(`/actions/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tAction("title.update")}
    />
  );
}
