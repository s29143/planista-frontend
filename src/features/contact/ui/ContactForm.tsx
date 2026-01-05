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
  Checkbox,
} from "@mantine/core";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AsyncSelectRHF } from "@/shared/ui/AsyncSelectRHF";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createContactSchema, type FormValues } from "../model/contactSchema";
import { notifications } from "@mantine/notifications";
import { X } from "lucide-react";
import { MaskedTextInput } from "@/shared/ui/MaskedTextInput";
import CancelButton from "@/shared/ui/CancelButton";

const API = {
  statuses: "/contact-statuses",
  company: "/companies",
  users: "/users",
};
type SaveFn = (values: FormValues) => Promise<{ id?: string } | void>;

export default function ContactForm({
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
  const { t: tContact } = useTranslation("contact");

  const schema = useMemo(() => createContactSchema(t, tContact), [t, tContact]);

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
    defaultValues: { firstName: "", lastName: "", ...initialValues },
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
            message: msg.replaceAll("{field}", tContact(field)),
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
            <Anchor component={Link} to="/contacts" size="sm">
              ← {t("actions.backToList")}
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(submit)} noValidate>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label={tContact("firstName")}
                    placeholder={tContact("placeholders.firstName")}
                    withAsterisk
                    {...register("firstName")}
                    error={errors.firstName?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label={tContact("lastName")}
                    placeholder={tContact("placeholders.lastName")}
                    withAsterisk
                    {...register("lastName")}
                    error={errors.lastName?.message}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 12 }}>
                  <TextInput
                    label={tContact("jobTitle")}
                    placeholder={tContact("placeholders.jobTitle")}
                    {...register("jobTitle")}
                    error={errors.jobTitle?.message}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    render={({ field }) => (
                      <MaskedTextInput
                        label={tContact("phoneNumber")}
                        placeholder="+48 123 456 789"
                        mask={[
                          {
                            mask: "000 000 000",
                          },
                          {
                            mask: "+48 000 000 000",
                          },
                        ]}
                        {...register("phoneNumber")}
                        error={errors.phoneNumber?.message}
                        value={field.value ?? ""}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                      />
                    )}
                  ></Controller>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <MaskedTextInput
                        label={tContact("mobileNumber")}
                        placeholder="+48 123 456 789"
                        mask={[
                          {
                            mask: "000 000 000",
                          },
                          {
                            mask: "+48 000 000 000",
                          },
                        ]}
                        {...register("mobileNumber")}
                        error={errors.mobileNumber?.message}
                        value={field.value ?? ""}
                        onAccept={(value) => field.onChange(value)}
                        onBlur={field.onBlur}
                      />
                    )}
                  ></Controller>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label={tContact("email")}
                    placeholder={tContact("placeholders.email")}
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Checkbox
                    label={tContact("phoneAgreement")}
                    {...register("phoneAgreement")}
                    error={errors.phoneAgreement?.message}
                    className="mt-8"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Checkbox
                    label={tContact("emailAgreement")}
                    {...register("emailAgreement")}
                    error={errors.emailAgreement?.message}
                    className="mt-8"
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="companyId"
                    label={tContact("company")}
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
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="userId"
                    label={tContact("user")}
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
                    name="statusId"
                    label={tContact("status")}
                    endpoint={API.statuses}
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
