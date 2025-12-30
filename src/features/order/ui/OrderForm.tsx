import {
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
  TextInput,
  NumberInput,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AsyncSelectRHF } from "@/shared/ui/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createOrderSchema, type FormValues } from "../model/orderSchema";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { DateInput } from "@mantine/dates";

const API = {
  types: "/order-types",
  company: "/companies",
  contact: "/contacts",
  status: "/order-statuses",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function OrderForm({
  initialValues,
  loading = false,
  save,
  onSuccess,
  title,
}: {
  onError?: (errors: any) => void;
  initialValues?: Partial<FormValues>;
  loading?: boolean;
  save: SaveFn;
  onSuccess?: (id?: string) => void;
  title?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { t: tOrder } = useTranslation("order");

  const schema = useMemo(() => createOrderSchema(t, tOrder), [t, tOrder]);

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
    defaultValues: { product: "", ...initialValues },
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
            message: msg.replaceAll("{field}", tOrder(field)),
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
      <Paper withBorder radius="lg" p="xl" mt="md" pos="relative">
        <LoadingOverlay visible={loading || isSubmitting} zIndex={1000} />
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={2}>{title}</Title>
            <Anchor component={Link} to="/orders" size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label={tOrder("product")}
                    withAsterisk
                    placeholder={tOrder("placeholders.product")}
                    {...register("product")}
                    error={errors.product?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <NumberInput
                        label={tOrder("quantity")}
                        withAsterisk
                        placeholder={tOrder("placeholders.quantity")}
                        value={field.value ?? undefined}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={errors.quantity?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Controller
                    name="dateFrom"
                    control={control}
                    render={({ field }) => (
                      <DateInput
                        label={tOrder("dateFrom")}
                        placeholder={t("placeholders.date")}
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        value={field.value ?? null}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={errors.dateFrom?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Controller
                    name="dateTo"
                    control={control}
                    render={({ field }) => (
                      <DateInput
                        label={tOrder("dateTo")}
                        placeholder={t("placeholders.date")}
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        value={field.value ?? null}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={errors.dateTo?.message}
                      />
                    )}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="companyId"
                    label={tOrder("company")}
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
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="contactId"
                    label={tOrder("contact")}
                    mapItem={(i) => {
                      return {
                        value: String(i.id),
                        label: `${i.firstName} ${i.lastName})`,
                      };
                    }}
                    endpoint={API.contact}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="statusId"
                    label={tOrder("status")}
                    endpoint={API.status}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="typeId"
                    label={tOrder("type")}
                    endpoint={API.types}
                  />
                </Grid.Col>
              </Grid>
              <Divider my="xs" />

              <Group justify="flex-end">
                <Button variant="default" component={Link} to="/orders">
                  {t("actions.cancel")}
                </Button>
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
    </Container>
  );
}
