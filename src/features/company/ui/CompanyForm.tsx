import {
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Title,
  Paper,
  Grid,
  LoadingOverlay,
  Divider,
  Anchor,
  Container,
} from "@mantine/core";
import { Section } from "@/shared/ui/Section";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AsyncSelectRHF } from "@/shared/ui/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createCompanySchema, type FormValues } from "../model/companySchema";
import { notifications } from "@mantine/notifications";
import { ClipboardList, ListTodo, Users, X } from "lucide-react";
import { MaskedTextInput } from "@/shared/ui/MaskedTextInput";
import type { Contact } from "@/features/contact/model/store";
import type { Action } from "@/features/action/model/store";
import CancelButton from "@/shared/ui/CancelButton";
import type { Order } from "@/features/order/model/store";

const API = {
  acquisitions: "/company-acquires",
  districts: "/districts",
  countries: "/countries",
  statuses: "/company-statuses",
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
    defaultValues: { shortName: "", fullName: "", ...initialValues },
  });

  useEffect(() => {
    if (initialValues) reset((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues, reset]);

  const submit = async (payload: FormValues) => {
    try {
      const result = await save(payload);
      onSuccess?.(result?.id);
    } catch (e: any) {
      const n = e?.normalized as
        | {
            fieldErrors?: Record<string, string>;
            title?: string;
            message?: string;
          }
        | undefined;

      if (n?.fieldErrors) {
        Object.entries(n.fieldErrors).forEach(([field, msg]) =>
          setError(field as keyof FormValues, {
            type: "server",
            message: msg.replaceAll("{field}", tCompany(field)),
          })
        );
      }
      if (!n?.fieldErrors || Object.keys(n.fieldErrors).length === 0) {
        setError("root.server" as any, {
          type: "server",
          message: n?.message ?? t("error.save"),
        });
      }
      notifications.show({
        color: "red",
        icon: <X size={18} />,
        title: n?.title ?? t("messages.error"),
        message: n?.message ?? t("error.save"),
      });
    }
  };

  const canSubmit = useMemo(
    () => isValid && !isSubmitting,
    [isValid, isSubmitting]
  );

  return (
    <Container size="lg">
      <Stack gap="md">
        <Paper withBorder radius="lg" p="xl" mt="md" pos="relative">
          <LoadingOverlay visible={loading || isSubmitting} zIndex={1000} />
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Title order={2}>{title}</Title>
              <Anchor component={Link} to="/companies" size="sm">
                ← {t("actions.backToList")}
              </Anchor>
            </Group>

            <form onSubmit={handleSubmit(submit)} noValidate>
              <Stack gap="lg">
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
                    <Controller
                      name="nip"
                      control={control}
                      render={({ field }) => (
                        <MaskedTextInput
                          label={tCompany("nip")}
                          placeholder="1234567890"
                          mask="0000000000"
                          value={field.value ?? ""}
                          onAccept={(value) => field.onChange(value)}
                          onBlur={field.onBlur}
                          error={errors.nip?.message}
                        />
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Controller
                      name="postalCode"
                      control={control}
                      render={({ field }) => (
                        <MaskedTextInput
                          label={tCompany("postalCode")}
                          placeholder="00-000"
                          mask="00-000"
                          {...register("postalCode")}
                          error={errors.postalCode?.message}
                          value={field.value ?? ""}
                          onAccept={(value) => field.onChange(value)}
                          onBlur={field.onBlur}
                        />
                      )}
                    ></Controller>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput
                      label={tCompany("street")}
                      placeholder="ul. Przykładowa"
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
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <MaskedTextInput
                          label={tCompany("phoneNumber")}
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
                          value={field.value ?? ""}
                          onAccept={(value) => field.onChange(value)}
                          onBlur={field.onBlur}
                        />
                      )}
                    ></Controller>
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

                <Divider my="xs" />

                <Group justify="flex-end">
                  <CancelButton />
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    loading={isSubmitting}
                  >
                    {t("actions.save")}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Paper>
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
      </Stack>
    </Container>
  );
}
