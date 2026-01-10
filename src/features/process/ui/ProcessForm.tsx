import { Container, Grid } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createProcessSchema, type FormValues } from "../model/schema";
import NumInput from "@/shared/ui/inputs/NumInput";
import { DurationField } from "@/shared/ui/inputs/DurationInput";
import { FormShell } from "@/shared/ui/FormShell";

const API = {
  technologies: "/dict/technologies",
  order: "/orders",
  workstation: "/dict/workstations",
  status: "/dict/process-statuses",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function ProcessForm({
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
  const { t: tProcess } = useTranslation("process");

  const schema = useMemo(() => createProcessSchema(t, tProcess), [t, tProcess]);

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    defaultValues: { ...initialValues },
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
      <FormShell
        canSubmit={canSubmit}
        loading={loading}
        submitting={isSubmitting}
        onSubmit={handleSubmit}
        setError={setError}
        title={title}
        save={save}
        onSuccess={onSuccess}
      >
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumInput<FormValues>
              control={control}
              name="quantity"
              label={tProcess("quantity")}
              error={errors.quantity?.message}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DurationField
              name="plannedTimeForm"
              control={control}
              label={tProcess("plannedTime")}
              required
              error={errors.plannedTimeForm?.message as string | undefined}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="orderId"
              label={tProcess("order")}
              withAsterisk
              mapItem={(i) => {
                return {
                  value: String(i.id),
                  label: `#${i.id} (${i.product})`,
                };
              }}
              endpoint={API.order}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="workstationId"
              label={tProcess("workstation")}
              endpoint={API.workstation}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="statusId"
              label={tProcess("status")}
              endpoint={API.status}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="technologyId"
              label={tProcess("technology")}
              endpoint={API.technologies}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
    </Container>
  );
}
