import { TextInput, Textarea, Stack, Grid, Container } from "@mantine/core";
import { Section } from "@/shared/ui/Section";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createCompanySchema, type FormValues } from "../model/schema";
import { ClipboardList, ListTodo, Users } from "lucide-react";
import MaskedTextInput from "@/shared/ui/inputs/MaskedTextInput";
import type { Action } from "@/shared/types/action";
import type { Contact } from "@/shared/types/contact";
import type { Order } from "@/shared/types/order";
import { FormShell } from "@/shared/ui/FormShell";
import { useAuthStore } from "@/shared/api/authStore";

const API = {
  acquisitions: "/dict/company-acquires",
  districts: "/dict/districts",
  countries: "/dict/countries",
  statuses: "/dict/company-statuses",
  users: "/users",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function CompanyForm({
  initialValues,
  loading = false,
  save,
  onSuccess,
  title,
  id,
}: {
  onError?: (errors: any) => void;
  initialValues?: Partial<FormValues>;
  loading?: boolean;
  save: SaveFn;
  onSuccess?: (id?: string) => void;
  title?: React.ReactNode;
  id?: number;
}) {
  const { t } = useTranslation();
  const { t: tCompany } = useTranslation("company");
  const { user } = useAuthStore();

  const schema = useMemo(() => createCompanySchema(t, tCompany), [t, tCompany]);

  const {
    register,
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    defaultValues: { userId: user?.id, statusId: 1, ...initialValues },
  });

  useEffect(() => {
    if (initialValues) reset((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues, reset]);

  const canSubmit = useMemo(
    () => isValid && !isSubmitting,
    [isValid, isSubmitting]
  );

  return (
    <Container size="lg">
      <FormShell<FormValues>
        canSubmit={canSubmit}
        loading={loading}
        backTo="/companies"
        submitting={isSubmitting}
        onSubmit={handleSubmit}
        setError={setError}
        title={title}
        save={save}
        onSuccess={onSuccess}
      >
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label={tCompany("shortName")}
              placeholder="np. ACME"
              withAsterisk
              {...register("shortName")}
              error={errors.shortName?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label={tCompany("fullName")}
              placeholder="np. ACME Sp. z o.o."
              withAsterisk
              {...register("fullName")}
              error={errors.fullName?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <MaskedTextInput
              control={control}
              name="nip"
              label={tCompany("nip")}
              placeholder="1234567890"
              mask="0000000000"
              error={errors.nip?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <MaskedTextInput
              control={control}
              label={tCompany("postalCode")}
              placeholder="00-000"
              mask="00-000"
              {...register("postalCode")}
              error={errors.postalCode?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label={tCompany("street")}
              placeholder={tCompany("placeholders.street")}
              {...register("street")}
              error={errors.street?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label={tCompany("houseNumber")}
              placeholder="12A"
              {...register("houseNumber")}
              error={errors.houseNumber?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              label={tCompany("apartmentNumber")}
              placeholder="5"
              {...register("apartmentNumber")}
              error={errors.apartmentNumber?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <MaskedTextInput
              label={tCompany("phoneNumber")}
              placeholder="+48 123 456 789"
              control={control}
              mask={[
                {
                  mask: "000 000 000",
                },
                {
                  mask: "+48 000 000 000",
                },
              ]}
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tCompany("email")}
              placeholder="firma@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tCompany("wwwSite")}
              placeholder="https://example.com"
              {...register("wwwSite")}
              error={errors.wwwSite?.message}
            />
          </Grid.Col>

          <Grid.Col span={12}>
            <Textarea
              label={tCompany("comments")}
              minRows={3}
              autosize
              {...register("comments")}
              error={errors.comments?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="userId"
              label={tCompany("user")}
              withAsterisk
              mapItem={(i) => {
                return {
                  value: String(i.id),
                  label: `${i.firstname} ${i.lastname} (${i.username})`,
                };
              }}
              endpoint={API.users}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="acquiredId"
              label={tCompany("acquired")}
              endpoint={API.acquisitions}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="districtId"
              label={tCompany("district")}
              endpoint={API.districts}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="countryId"
              label={tCompany("country")}
              endpoint={API.countries}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="statusId"
              label={tCompany("status")}
              endpoint={API.statuses}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
      {id && (
        <Stack gap="md" mb="xl">
          <Section<Contact>
            module="contacts"
            translationModule="contact"
            icon={<Users size={16} />}
            label={tCompany("contacts")}
            url={`companies/${id}/contacts`}
            columns={[
              { key: "firstName" },
              { key: "lastName" },
              {
                key: "status",
                cell(row) {
                  return row.status?.name || "—";
                },
              },
              {
                key: "user",
                cell(row) {
                  return row.user?.name || "—";
                },
              },
            ]}
          ></Section>
          <Section<Action>
            module="actions"
            translationModule="action"
            icon={<ListTodo size={16} />}
            label={tCompany("actions")}
            url={`companies/${id}/actions`}
            columns={[
              { key: "date" },
              { key: "text" },
              {
                key: "type",
                cell(row) {
                  return row.type?.name || "—";
                },
              },
              {
                key: "user",
                cell(row) {
                  return row.user?.name || "—";
                },
              },
            ]}
          ></Section>
          <Section<Order>
            module="orders"
            translationModule="order"
            icon={<ClipboardList size={16} />}
            label={tCompany("orders")}
            url={`companies/${id}/orders`}
            columns={[
              { key: "product" },
              { key: "quantity" },
              {
                key: "type",
                cell(row) {
                  return row.type?.name || "—";
                },
              },
              {
                key: "status",
                cell(row) {
                  return row.status?.name || "—";
                },
              },
            ]}
          ></Section>
        </Stack>
      )}
    </Container>
  );
}
