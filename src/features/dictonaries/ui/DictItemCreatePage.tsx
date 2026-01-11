import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import DictItemForm from "./DictItemForm";
import { useTranslation } from "react-i18next";

export default function DictItemCreatePage() {
  const { t: tDictItem } = useTranslation("dictionary");
  const navigate = useNavigate();
  const { module } = useParams();

  return (
    <DictItemForm
      save={async (values) => {
        const { data } = await http.post(`/dict/${module}`, values);
        return { id: data?.id as string | undefined };
      }}
      title={tDictItem("title.create")}
      onSuccess={() => navigate(`/dictionaries/${module}`)}
    />
  );
}
