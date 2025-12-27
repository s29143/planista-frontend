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
  Checkbox,
  Textarea,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AsyncSelectRHF } from "@/shared/ui/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createActionSchema, type FormValues } from "../model/actionSchema";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { DateInput } from "@mantine/dates";

const API = {
  types: "/action-types",
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
            message: msg.replaceAll("{field}", tAction(field)),
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
            <Anchor component={Link} to="/actions" size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DateInput
                        label={tAction("date")}
                        placeholder={tAction("placeholders.date")}
                        withAsterisk
                        valueFormat="YYYY-MM-DD"
                        value={field.value ?? null}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={errors.date?.message}
                      />
                    )}
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
              <Divider my="xs" />

              <Group justify="flex-end">
                <Button variant="default" component={Link} to="/actions">
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
