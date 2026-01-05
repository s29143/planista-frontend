import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import OrderForm from "./OrderForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/orderSchema";
import { useEffect, useState } from "react";

export default function OrderUpdatePage() {
  const { t } = useTranslation();
  const { t: tOrder } = useTranslation("order");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    orders: "/orders",
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [initial, setInitial] = useState<Partial<FormValues> | undefined>(
    undefined
  );
  const s = (v: unknown) => (v == null ? "" : String(v));
  const idOrUndef = (v: unknown) => (v == null ? undefined : Number(v));

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get(`${API.orders}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          product: s(data.product),
          quantity: data.quantity ?? undefined,
          dateFrom: s(data.dateFrom),
          dateTo: s(data.dateTo),
          companyId: idOrUndef(data?.company?.id),
          statusId: idOrUndef(data?.status?.id),
          typeId: idOrUndef(data?.type?.id),
          contactId: idOrUndef(data?.contact?.id),
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
        navigate("/orders");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.orders]);

  return (
    <OrderForm
      loading={loading}
      save={async (values) => {
        await http.put(`/orders/${id}`, values);
        return { id };
      }}
      onSuccess={() => navigate(-1)}
      initialValues={initial}
      title={tOrder("title.update")}
    />
  );
}
