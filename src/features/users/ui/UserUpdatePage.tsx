import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import CompanyForm from "./UserForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/schema";
import { useEffect, useState } from "react";

export default function UserUpdatePage() {
  const { t } = useTranslation();
  const { t: tUser } = useTranslation("user");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    users: "/users",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );
  const s = (v: unknown) => (v == null ? "" : String(v));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${API.users}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          username: s(data.username),
          firstname: s(data.firstname),
          lastname: s(data.lastname),
          password: s(data.password),
          role: s(data.role),
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
        navigate("/users");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.users]);

  return (
    <CompanyForm
      loading={loading}
      save={async (values) => {
        await http.put(`/users/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tUser("title.update")}
    />
  );
}
