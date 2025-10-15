import { notifications } from "@mantine/notifications";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import CompanyForm from "./CompanyForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/companySchema";

export default function CompanyCreatePage() {
  const { t } = useTranslation();
  const { t: tCompany } = useTranslation("company");
  const navigate = useNavigate();
  async function onSubmit(payload: FormValues) {
    try {
      const res = await http.post("/companies", payload);
      const created = await res.data;
      const newId = created?.id;

      notifications.show({
        color: "teal",
        icon: <Check size={18} />,
        title: t("messages.success"),
        message: "Firma została utworzona.",
      });

      navigate(newId ? `/companies/${newId}` : "/companies");
    } catch (e: any) {
      notifications.show({
        color: "red",
        icon: <X size={18} />,
        title: t("messages.error"),
        message: e?.message ?? t("error.save"),
      });
    }
  }

  return <CompanyForm onSubmit={onSubmit} title={tCompany("title.update")} />;
}
