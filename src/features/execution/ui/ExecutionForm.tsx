import { Container, Grid } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createExecutionSchema, type FormValues } from "../model/schema";
import NumInput from "@/shared/ui/inputs/NumInput";
import { DurationField } from "@/shared/ui/inputs/DurationInput";
import { FormShell } from "@/shared/ui/FormShell";
import { useSearchParams } from "react-router-dom";

const API = {
  processes: "/dict/processes",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function ExecutionForm({
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
  const { t: tExecution } = useTranslation("execution");
  const [searchParams] = useSearchParams();
  const schema = useMemo(
    () => createExecutionSchema(t, tExecution),
    [t, tExecution]
  );

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    defaultValues: {
      processId: Number(searchParams.get("processId")),
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
              label={tExecution("quantity")}
              error={errors.quantity?.message}
              withAsterisk
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DurationField
              name="timeForm"
              control={control}
              label={tExecution("timeInSeconds")}
              required
              error={errors.timeForm?.message as string | undefined}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="processId"
              label={tExecution("process")}
              withAsterisk
              mapItem={(i) => {
                return {
                  value: String(i.id),
                  label: `#${i.id} (${i.product})`,
                };
              }}
              endpoint={API.processes}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
    </Container>
  );
}
