import { notifications } from "@mantine/notifications";
import { Check, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/shared/api/http";
import CompanyForm from "./CompanyForm";
import { useTranslation } from "react-i18next";
import type { FormValues } from "../model/companySchema";
import { useEffect, useState } from "react";

export default function CompanyUpdatePage() {
  const { t } = useTranslation();
  const { t: tCompany } = useTranslation("company");
  const navigate = useNavigate();
  const { id } = useParams();
  const API = {
    companies: "/companies",
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
        const { data } = await http.get(`${API.companies}/${id}`);
        if (!alive) return;

        const mapped: Partial<FormValues> = {
          shortName: s(data.shortName),
          fullName: s(data.fullName),
          nip: s(data.nip),
          postalCode: s(data.postalCode),
          street: s(data.street),
          houseNumber: s(data.houseNumber),
          apartmentNumber: s(data.apartmentNumber),
          phoneNumber: s(data.phoneNumber),
          email: s(data.email),
          wwwSite: s(data.wwwSite),
          comments: s(data.comments),
          userId: idOrUndef(data?.user?.id),
          acquiredId: idOrUndef(data?.acquired?.id),
          districtId: idOrUndef(data?.district?.id),
          countryId: idOrUndef(data?.country?.id),
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
        navigate("/companies");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, navigate, t, API.companies]);
  async function onSubmit(payload: FormValues) {
    try {
      if (!id) throw new Error("No company id provided");
      await http.put(`/companies/${id}`, payload);

      notifications.show({
        color: "teal",
        icon: <Check size={18} />,
        title: t("messages.success"),
        message: "Firma została utworzona.",
      });

      navigate("/companies");
    } catch (e: any) {
      notifications.show({
        color: "red",
        icon: <X size={18} />,
        title: t("messages.error"),
        message: e?.message ?? t("error.save"),
      });
    }
  }

  return (
    <CompanyForm
      onSubmit={onSubmit}
      loading={loading}
      initialValues={initial}
      title={tCompany("title.update")}
    />
  );
}
