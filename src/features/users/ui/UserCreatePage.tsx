import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import CompanyForm from "./UserForm";
import { useTranslation } from "react-i18next";

export default function UserCreatePage() {
  const { t: tUser } = useTranslation("user");
  const navigate = useNavigate();
  return (
    <CompanyForm
      save={async (values) => {
        const { data } = await http.post("/users", values);
        return { id: data?.id as string | undefined };
      }}
      title={tUser("title.create")}
      onSuccess={() => navigate(-1)}
    />
  );
}
