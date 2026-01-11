import { Grid, Container, Checkbox, Textarea } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createActionSchema, type FormValues } from "../model/schema";
import DateFormInput from "@/shared/ui/inputs/DateFormInput";
import { FormShell } from "@/shared/ui/FormShell";

const API = {
  types: "/dict/action-types",
  company: "/companies",
  contact: "/contacts",
  users: "/users",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function ActionForm({
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
  const { t: tAction } = useTranslation("action");

  const schema = useMemo(() => createActionSchema(), []);

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
    defaultValues: { text: "", ...initialValues },
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
        backTo="/actions"
        submitting={isSubmitting}
        onSubmit={handleSubmit}
        setError={setError}
        title={title}
        save={save}
        onSuccess={onSuccess}
      >
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <DateFormInput
              control={control}
              name="date"
              label={tAction("date")}
              placeholder={t("placeholders.date")}
              withAsterisk
              error={errors.date?.message}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label={tAction("text")}
              minRows={3}
              autosize
              {...register("text")}
              error={errors.text?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Checkbox
              label={tAction("done")}
              {...register("done")}
              error={errors.done?.message}
              className="mt-8"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Checkbox
              label={tAction("prior")}
              {...register("prior")}
              error={errors.prior?.message}
              className="mt-8"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Checkbox
              label={tAction("reminder")}
              {...register("reminder")}
              error={errors.reminder?.message}
              className="mt-8"
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }}>
            <AsyncSelectRHF<FormValues>
              control={control}
              name="companyId"
              label={tAction("company")}
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
              label={tAction("contact")}
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
              name="userId"
              label={tAction("user")}
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
              name="typeId"
              label={tAction("type")}
              endpoint={API.types}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
    </Container>
  );
}
