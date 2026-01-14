import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import { fetchContacts, FiltersSchema, type Filters } from "../api/queries";
import { http } from "@/shared/api/http";
import type { Contact } from "@/shared/types/contact";

export default function ContactListPage() {
  const { t } = useTranslation("contact");
  const contactFilterFields: FilterField<keyof Filters & string>[] = [
    {
      type: "text",
      name: "search",
      label: t("common:actions.search"),
      placeholder: t("common:placeholders.search"),
    },
    {
      type: "text",
      name: "company",
      label: t("company"),
      placeholder: t("common:placeholders.search"),
    },
    {
      type: "select",
      name: "user",
      label: t("user"),
      multiple: true,
      clearable: true,
      endpoint: "/users",
      placeholder: t("common:placeholders.any"),
      mapItem: (i) => ({
        value: String(i.id),
        label: `${i.firstname} ${i.lastname} (${i.username})`,
      }),
    },
    {
      type: "select",
      name: "status",
      label: t("status"),
      multiple: true,
      clearable: true,
      endpoint: "/dict/contact-statuses",
      placeholder: t("common:placeholders.any"),
    },
  ];
  const ContactColumns: ColumnDef<Contact>[] = [
    { key: "lastName", header: t("lastName") },
    { key: "firstName", header: t("firstName") },
    {
      key: "company",
      header: t("company"),
      cell: (c) => c.company?.name || "—",
    },
    {
      key: "status",
      header: t("status"),
      cell: (row) => row.status?.name,
    },
    {
      key: "user",
      header: t("user"),
      cell: (c) => c.user?.name || "—",
    },
  ];
  return (
    <DataListView<Filters, Contact>
      filtersConfig={contactFilterFields}
      filtersSchema={FiltersSchema}
      fetcher={fetchContacts}
      columns={ContactColumns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/contacts/" + row.id);
      }}
    />
  );
}
