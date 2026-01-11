import {
  Anchor,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import CancelButton from "./buttons/CancelButton";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import type {
  FieldValues,
  UseFormHandleSubmit,
  UseFormSetError,
} from "react-hook-form";

export function FormShell<T extends FieldValues>({
  title,
  backTo,
  loading,
  submitting,
  canSubmit,
  onSubmit,
  setError,
  save,
  onSuccess,
  children,
}: {
  title?: React.ReactNode;
  backTo?: string;
  loading: boolean;
  submitting: boolean;
  canSubmit: boolean;
  onSubmit: UseFormHandleSubmit<T>;
  setError: UseFormSetError<T>;
  save: (values: T) => Promise<{ id?: string } | void>;
  onSuccess?: (id?: string) => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const submit = async (payload: T) => {
    try {
      const result = await save(payload);
      if (onSuccess) {
        onSuccess?.(result?.id);
      } else {
        navigate(-1);
      }
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
          setError(field as any, { type: "server", message: msg })
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
  return (
    <Paper withBorder radius="lg" p="xl" mt="md" pos="relative">
      <LoadingOverlay visible={loading || submitting} zIndex={1000} />
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2}>{title}</Title>
          {backTo && (
            <Anchor component={Link} to={backTo} size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          )}
        </Group>

        <form onSubmit={onSubmit(submit)} noValidate>
          <Stack gap="lg">
            {children}
            <Divider my="xs" />
            <Group justify="flex-end">
              <CancelButton />
              <Button type="submit" disabled={!canSubmit} loading={submitting}>
                {t("actions.save")}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
