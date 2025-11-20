import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import DictItemForm from "./DictItemForm";
import type { FormValues } from "../model/dictItemSchema";

export default function DictItemUpdatePage() {
  const { t } = useTranslation();
  const { t: tDictItem } = useTranslation("dictionary");
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );
  const { module } = useParams();
  const s = (v: unknown) => (v == null ? "" : String(v));
  if (!module) {
    navigate("/");
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${module}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          name: s(data.name),
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
        navigate("/");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, module]);

  return (
    <DictItemForm
      loading={loading}
      save={async (values) => {
        await http.put(`/${module}/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(`/dictionaries/${module}`)}
      initialValues={initial}
      title={tDictItem("title.update")}
    />
  );
}
