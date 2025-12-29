import { useNavigate } from "react-router-dom";
import { http } from "@/shared/api/http";
import OrderForm from "./OrderForm";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";

export default function OrderCreatePage() {
  const { t } = useTranslation();
  const { t: tOrder } = useTranslation("order");
  const navigate = useNavigate();
  return (
    <OrderForm
      save={async (values) => {
        const { data } = await http.post("/orders", values);
        return { id: data?.id as string | undefined };
      }}
      title={tOrder("title.create")}
      onSuccess={(id) => {
        notifications.show({
          title: t("success"),
          message: t("messages.created"),
          color: "green",
        });
        navigate(id ? `/orders/${id}` : "/orders");
      }}
    />
  );
}
