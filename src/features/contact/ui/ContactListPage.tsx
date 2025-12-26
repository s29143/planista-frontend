import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import type { Contact } from "../model/store";
import {
  contactFiltersSchema,
  fetchContacts,
  type ContactFilters,
} from "../api/queries";
import { http } from "@/shared/api/http";

const contactFilterFields: FilterField<keyof ContactFilters & string>[] = [
  {
    type: "text",
    name: "search",
    label: "Szukaj",
    placeholder: "Nazwa, NIP, miasto...",
  },
  {
    type: "select",
    name: "district",
    label: "Województwo",
    multiple: true,
    clearable: true,
    endpoint: "/districts",
    placeholder: "Dowolna",
  },
  {
    type: "select",
    name: "user",
    label: "Opiekun",
    multiple: true,
    clearable: true,
    endpoint: "/users",
    placeholder: "Dowolna",
    mapItem: (i) => ({
      value: String(i.id),
      label: `${i.firstname} ${i.lastname} (${i.username})`,
    }),
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    multiple: true,
    clearable: true,
    endpoint: "/contact-statuses",
    placeholder: "Dowolny",
  },
];

export default function ContactListPage() {
  const { t } = useTranslation("contact");
  const ContactColumns: ColumnDef<Contact>[] = [
    { key: "lastName", header: t("lastName") },
    { key: "firstName", header: t("firstName") },
    {
      key: "company",
      header: t("company"),
      cell: (c) => c.company?.shortName || "—",
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
    <DataListView<ContactFilters, Contact>
      filtersConfig={contactFilterFields}
      filtersSchema={contactFiltersSchema}
      fetcher={fetchContacts}
      columns={ContactColumns}
      initialPageSize={10}
      canDelete={true}
      deleteFn={async (row) => {
        http.delete("/companies/" + row.id);
      }}
    />
  );
}
