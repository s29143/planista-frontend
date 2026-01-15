import { TextInput, Grid, Container, Checkbox, Stack } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createContactSchema, type FormValues } from "../model/schema";
import MaskedTextInput from "@/shared/ui/inputs/MaskedTextInput";
import { FormShell } from "@/shared/ui/FormShell";
import { useAuthStore } from "@/shared/api/authStore";
import { useSearchParams } from "react-router-dom";
import { Section } from "@/shared/ui/Section";
import { ClipboardList, ListTodo } from "lucide-react";
import type { Action } from "@/shared/types/action";
import type { Order } from "@/shared/types/order";

const API = {
  statuses: "/dict/contact-statuses",
  company: "/companies",
  users: "/users",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function ContactForm({
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
  id?: string;
}) {
  const { t } = useTranslation();
  const { t: tContact } = useTranslation("contact");
  const [searchParams] = useSearchParams();
  const schema = useMemo(() => createContactSchema(t, tContact), [t, tContact]);
  const { user } = useAuthStore();

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
    defaultValues: {
      userId: user?.id,
      companyId: Number(searchParams.get("companyId")),
      statusId: 1,
      ...initialValues,
    },
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
        backTo="/contacts"
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
              label={tContact("firstName")}
              placeholder={tContact("placeholders.firstName")}
              withAsterisk
              {...register("firstName")}
              error={errors.firstName?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label={tContact("lastName")}
              placeholder={tContact("placeholders.lastName")}
              withAsterisk
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12 }}>
            <TextInput
              label={tContact("jobTitle")}
              placeholder={tContact("placeholders.jobTitle")}
              {...register("jobTitle")}
              error={errors.jobTitle?.message}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MaskedTextInput
              control={control}
              label={tContact("phoneNumber")}
              placeholder="+48 123 456 789"
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

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MaskedTextInput
              control={control}
              label={tContact("mobileNumber")}
              placeholder="+48 123 456 789"
              mask={[
                {
                  mask: "000 000 000",
                },
                {
                  mask: "+48 000 000 000",
                },
              ]}
              {...register("mobileNumber")}
              error={errors.mobileNumber?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tContact("email")}
              placeholder={tContact("placeholders.email")}
              {...register("email")}
              error={errors.email?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Checkbox
              label={tContact("phoneAgreement")}
              {...register("phoneAgreement")}
              error={errors.phoneAgreement?.message}
              className="mt-8"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Checkbox
              label={tContact("emailAgreement")}
              {...register("emailAgreement")}
              error={errors.emailAgreement?.message}
              className="mt-8"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="companyId"
              label={tContact("company")}
              withAsterisk
              mapItem={(i) => {
                return {
                  value: String(i.id),
                  label: `${i.shortName} (${i.nip})`,
                };
              }}
              endpoint={API.company}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="userId"
              label={tContact("user")}
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
              name="statusId"
              label={tContact("status")}
              endpoint={API.statuses}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
      {id && (
        <Stack gap="md" mb="xl" mt="lg">
          <Section<Action>
            module="actions"
            translationModule="action"
            icon={<ListTodo size={16} />}
            label={tContact("actions")}
            params={{ contactId: String(id) }}
            url={`contacts/${id}/actions`}
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
            label={tContact("orders")}
            params={{ contactId: String(id) }}
            url={`contacts/${id}/orders`}
            columns={[
              { key: "product" },
              { key: "dateFrom" },
              { key: "dateTo" },
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
