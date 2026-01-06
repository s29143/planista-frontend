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
} from "@mantine/core";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { createDictItemSchema, type FormValues } from "../model/schema";

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
            message: msg.replaceAll("{field}", tDictItem(field)),
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
            <Anchor component={Link} to={`/dictionaries/${module}`} size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label={tDictItem("name")}
                    placeholder="np. ACME"
                    withAsterisk
                    {...register("name")}
                    error={errors.name?.message}
                  />
                </Grid.Col>
              </Grid>

              <Divider my="xs" />

              <Group justify="flex-end">
                <Button
                  variant="default"
                  component={Link}
                  to={`/dictionaries/${module}`}
                >
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
