import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import ContactForm from "./ContactForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/schema";
import { useEffect, useState } from "react";
import { idOrUndef, s } from "@/shared/helpers";

export default function ContactUpdatePage() {
  const { t } = useTranslation();
  const { t: tContact } = useTranslation("contact");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    contacts: "/contacts",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${API.contacts}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          firstName: s(data.firstName),
          lastName: s(data.lastName),
          jobTitle: s(data.jobTitle),
          phoneNumber: s(data.phoneNumber),
          mobileNumber: s(data.mobileNumber),
          email: s(data.email),
          phoneAgreement: data.phoneAgreement ?? false,
          emailAgreement: data.emailAgreement ?? false,
          companyId: idOrUndef(data?.company?.id),
          userId: idOrUndef(data?.user?.id),
          statusId: idOrUndef(data?.status?.id),
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
        navigate("/contacts");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.contacts]);

  return (
    <ContactForm
      loading={loading}
      save={async (values) => {
        await http.put(`/contacts/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tContact("title.update")}
    />
  );
}
