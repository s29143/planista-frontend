import { DataListView } from "@/shared/ui/DataListView";
import type { ColumnDef } from "@/shared/ui/DataTableView";
import type { FilterField } from "@/shared/ui/FilterBar";
import { useTranslation } from "react-i18next";
import type { User } from "../model/store";
import {
  userFiltersSchema,
  fetchUsers,
  type UserFilters,
} from "../api/queries";

const userFilterFields: FilterField<keyof UserFilters & string>[] = [
  {
    type: "text",
    name: "search",
    label: "Szukaj",
  },
];

export default function UserListPage() {
  const { t } = useTranslation("user");
  const userColumns: ColumnDef<User>[] = [
    { key: "username", header: t("username") },
    { key: "firstname", header: t("firstname") },
    {
      key: "lastname",
      header: t("lastname"),
    },
  ];
  return (
    <DataListView<UserFilters, User>
      filtersConfig={userFilterFields}
      filtersSchema={userFiltersSchema}
      fetcher={fetchUsers}
      columns={userColumns}
      initialPageSize={10}
    />
  );
}
