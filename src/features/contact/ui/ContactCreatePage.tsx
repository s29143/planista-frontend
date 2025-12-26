import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import ContactForm from "./ContactForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

export default function ContactCreatePage() {
  const { t } = useTranslation();
  const { t: tCotnact } = useTranslation("contact");
  const navigate = useNavigate();
  return (
    <ContactForm
      save={async (values) => {
        const { data } = await http.post("/contacts", values);
        return { id: data?.id as string | undefined };
      }}
      title={tCotnact("title.create")}
      onSuccess={(id) => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(id ? `/contacts/${id}` : "/contacts");
      }}
    />
  );
}
