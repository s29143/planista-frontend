import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import CompanyForm from "./CompanyForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

export default function CompanyCreatePage() {
  const { t } = useTranslation();
  const { t: tCompany } = useTranslation("company");
  const navigate = useNavigate();
  return (
    <CompanyForm
      save={async (values) => {
        const { data } = await http.post("/companies", values);
        return { id: data?.id as string | undefined };
      }}
      title={tCompany("title.create")}
      onSuccess={(id) => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(id ? `/companies/${id}` : "/companies");
      }}
    />
  );
}
