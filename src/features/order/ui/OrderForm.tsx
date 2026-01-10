import { Stack, Grid, Container, TextInput } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createOrderSchema, type FormValues } from "../model/schema";
import { Workflow } from "lucide-react";
import { Section } from "@/shared/ui/Section";
import type { Process } from "@/shared/types/process";
import DateFormInput from "@/shared/ui/inputs/DateFormInput";
import { FormShell } from "@/shared/ui/FormShell";
import NumInput from "@/shared/ui/inputs/NumInput";

const API = {
  types: "/dict/order-types",
  company: "/companies",
  contact: "/contacts",
  status: "/dict/order-statuses",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function OrderForm({
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

  const canSubmit = useMemo(
    () => isValid && !isSubmitting,
    [isValid, isSubmitting]
  );

  return (
    <Container size="lg">
      <FormShell<FormValues>
        canSubmit={canSubmit}
        loading={loading}
        backTo="/orders"
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
              label={tOrder("product")}
              withAsterisk
              placeholder={tOrder("placeholders.product")}
              {...register("product")}
              error={errors.product?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumInput
              control={control}
              label={tOrder("quantity")}
              withAsterisk
              name="quantity"
              placeholder={tOrder("placeholders.quantity")}
              error={errors.quantity?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateFormInput
              control={control}
              name="dateFrom"
              label={tOrder("dateFrom")}
              placeholder={t("placeholders.date")}
              withAsterisk
              error={errors.dateFrom?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateFormInput
              control={control}
              name="dateTo"
              label={tOrder("dateTo")}
              placeholder={t("placeholders.date")}
              withAsterisk
              error={errors.dateTo?.message}
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
      </FormShell>
      {id && (
        <Stack gap="md" mb="xl" className="pt-6">
          <Section<Process>
            module="processes"
            translationModule="process"
            icon={<Workflow size={16} />}
            label={tOrder("processes")}
            url={`orders/${id}/processes`}
            columns={[
              { key: "quantity" },
              { key: "plannedTime" },
              {
                key: "status",
                cell(row) {
                  return row.status?.name || "—";
                },
              },
              {
                key: "technology",
                cell(row) {
                  return row.technology?.name || "—";
                },
              },
              {
                key: "workstation",
                cell(row) {
                  return row.workstation?.name || "—";
                },
              },
            ]}
          ></Section>
        </Stack>
      )}
    </Container>
  );
}
