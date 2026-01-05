import {
  Button,
  Group,
  Stack,
  Title,
  Paper,
  Grid,
  LoadingOverlay,
  Divider,
  Container,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AsyncSelectRHF } from "@/shared/ui/inputs/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createProcessSchema, type FormValues } from "../model/processSchema";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { TimePicker } from "@mantine/dates";
import CancelButton from "@/shared/ui/buttons/CancelButton";
import NumInput from "@/shared/ui/inputs/NumInput";

const API = {
  technologies: "/technologies",
  order: "/orders",
  workstation: "/workstations",
  status: "/process-statuses",
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
    defaultValues: { plannedTime: "", ...initialValues },
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
            message: msg.replaceAll("{field}", tProcess(field)),
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
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
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
                  <Controller
                    name="plannedTime"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        label={tProcess("plannedTime")}
                        withAsterisk
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                        error={errors.plannedTime?.message}
                        format="24h"
                      />
                    )}
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
                    mapItem={(i) => {
                      return {
                        value: String(i.id),
                        label: `${i.firstName} ${i.lastName})`,
                      };
                    }}
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
