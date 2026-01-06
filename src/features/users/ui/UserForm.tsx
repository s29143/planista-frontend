import {
  TextInput,
  Grid,
  PasswordInput,
  Select,
  Container,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createUserSchema, type FormValues } from "../model/schema";

import { FormShell } from "@/shared/ui/FormShell";

type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function UserForm({
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
  const { t: tUser } = useTranslation("user");

  const schema = useMemo(() => createUserSchema(t, tUser), [t, tUser]);

  const {
    control,
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues, any, FormValues>,
    mode: "onChange",
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
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
        backTo="/users"
        submitting={isSubmitting}
        onSubmit={handleSubmit}
        setError={setError}
        title={title}
        save={save}
        onSuccess={onSuccess}
      >
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tUser("username")}
              withAsterisk
              {...register("username")}
              error={errors.username?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tUser("firstname")}
              withAsterisk
              {...register("firstname")}
              error={errors.firstname?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label={tUser("lastname")}
              withAsterisk
              {...register("lastname")}
              error={errors.lastname?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <PasswordInput
              label={tUser("password")}
              withAsterisk
              {...register("password")}
              error={errors.password?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <PasswordInput
              label={tUser("repassword")}
              withAsterisk
              {...register("repassword")}
              error={errors.repassword?.message}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Controller
              control={control}
              name={"role"}
              render={({ field, fieldState }) => (
                <Select
                  label={tUser("role")}
                  placeholder={"Select role"}
                  data={[
                    { value: "ADMIN", label: tUser("roles.admin") },
                    { value: "MANAGER", label: tUser("roles.manager") },
                    { value: "PLANNER", label: tUser("roles.planner") },
                    {
                      value: "PRODUCTION",
                      label: tUser("roles.production"),
                    },
                  ]}
                  value={String(field.value ?? null)}
                  onChange={(v) => field.onChange(v ?? undefined)}
                  clearable={true}
                  error={fieldState.error?.message}
                  nothingFoundMessage={t("messages.noData")}
                />
              )}
            />
          </Grid.Col>
        </Grid>
      </FormShell>
    </Container>
  );
}
