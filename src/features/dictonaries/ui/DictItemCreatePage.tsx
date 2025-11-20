import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import DictItemForm from "./DictItemForm";
import { useTranslation } from "react-i18next";

export default function DictItemCreatePage() {
  const { t: tDictItem } = useTranslation("dictionary");
  const navigate = useNavigate();
  return (
    <DictItemForm
      save={async (values) => {
        const { data } = await http.post("/companies", values);
        return { id: data?.id as string | undefined };
      }}
      title={tDictItem("title.create")}
      onSuccess={(id) => navigate(id ? `/companies/${id}` : "/companies")}
    />
  );
}
