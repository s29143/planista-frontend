import {
  TextInput,
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
  PasswordInput,
  Select,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createUserSchema, type FormValues } from "../model/userSchema";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import CancelButton from "@/shared/ui/buttons/CancelButton";

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
          setError(field as keyof FormValues, { type: "server", message: msg })
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
            <Anchor component={Link} to="/users" size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
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
    </Container>
  );
}
