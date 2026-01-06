import { TextInput, Grid, Container } from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createDictItemSchema, type FormValues } from "../model/schema";
import { FormShell } from "@/shared/ui/FormShell";

type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function DictItemForm({
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
  const { t: tDictItem } = useTranslation("dictionary");
  const { module } = useParams();

  const schema = useMemo(
    () => createDictItemSchema(t, tDictItem),
    [t, tDictItem]
  );

  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    defaultValues: { name: "", ...initialValues },
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
        backTo={"/dictionaries/" + module}
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
              label={tDictItem("name")}
              placeholder=""
              withAsterisk
              {...register("name")}
              error={errors.name?.message}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
    </Container>
  );
}
