import {
  TextInput,
  Textarea,
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
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { Check, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AsyncSelectRHF } from "@/shared/ui/AsyncHFSelect";
import { useMemo } from "react";

const API = {
  createCompany: "/companies",
  acquisitions: "/company-acquires",
  districts: "/districts",
  countries: "/countries",
  statuses: "/company-statuses",
};

const nipRegex = /^\d{10}$/;
const postalRegex = /^\d{2}-\d{3}$/;
const phoneRegex = /^[0-9+\-\s()]{6,20}$/i;

const schema = z.object({
  shortName: z.string().min(2, "Skrócona nazwa jest wymagana"),
  fullName: z.string().min(2, "Pełna nazwa jest wymagana"),
  nip: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine((v) => !v || nipRegex.test(v), {
      message: "NIP powinien zawierać 10 cyfr",
    }),
  postalCode: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine((v) => !v || postalRegex.test(v), {
      message: "Kod pocztowy w formacie 00-000",
    }),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  apartmentNumber: z.string().optional(),
  phoneNumber: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v))
    .refine((v) => !v || phoneRegex.test(v!), {
      message: "Niepoprawny numer telefonu",
    }),
  email: z
    .string()
    .email("Niepoprawny e-mail")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  wwwSite: z
    .string()
    .url("Niepoprawny adres URL")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  comments: z.string().optional(),

  acquiredId: z.string().optional(),
  districtId: z.string().optional(),
  countryId: z.string().optional(),
  statusId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CompanyCreatePage() {
  const navigate = useNavigate();

  const defaults: DefaultValues<FormValues> = {
    shortName: "",
    fullName: "",
  };
  const typedResolver: Resolver<FormValues, any, FormValues> = zodResolver(
    schema
  ) as unknown as Resolver<FormValues, any, FormValues>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues, any, FormValues>({
    resolver: typedResolver,
    mode: "onChange",
    defaultValues: defaults,
  });

  const canSubmit = useMemo(
    () => isValid && !isSubmitting,
    [isValid, isSubmitting]
  );

  async function onSubmit(values: FormValues) {
    const payload = {
      shortName: values.shortName?.trim(),
      fullName: values.fullName?.trim(),
      nip: values.nip || null,
      postalCode: values.postalCode || null,
      street: values.street?.trim() || null,
      houseNumber: values.houseNumber?.trim() || null,
      apartmentNumber: values.apartmentNumber?.trim() || null,
      phoneNumber: values.phoneNumber || null,
      email: values.email || null,
      wwwSite: values.wwwSite || null,
      comments: values.comments || null,
      acquiredId: values.acquiredId ? Number(values.acquiredId) : null,
      districtId: values.districtId ? Number(values.districtId) : null,
      countryId: values.countryId ? Number(values.countryId) : null,
      statusId: values.statusId ? Number(values.statusId) : null,
    };

    try {
      const res = await fetch(API.createCompany, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await safeText(res);
        throw new Error(errText || "Nieznany błąd serwera");
      }

      const created = await res.json();
      const newId = created?.id;

      notifications.show({
        color: "teal",
        icon: <Check size={18} />,
        title: "Zapisano",
        message: "Firma została utworzona.",
      });

      navigate(newId ? `/companies/${newId}` : "/companies");
    } catch (e: any) {
      notifications.show({
        color: "red",
        icon: <X size={18} />,
        title: "Błąd zapisu",
        message: e?.message ?? "Wystąpił błąd podczas zapisu.",
      });
    }
  }

  return (
    <Container size="lg">
      <Paper withBorder radius="lg" p="xl" mt="md" pos="relative">
        <LoadingOverlay visible={isSubmitting} zIndex={1000} />
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={2}>Nowa firma</Title>
            <Anchor component={Link} to="/companies" size="sm">
              ← Wróć do listy
            </Anchor>
          </Group>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack gap="lg">
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Skrócona nazwa"
                    placeholder="np. ACME"
                    withAsterisk
                    {...register("shortName")}
                    error={errors.shortName?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Pełna nazwa"
                    placeholder="np. ACME Sp. z o.o."
                    withAsterisk
                    {...register("fullName")}
                    error={errors.fullName?.message}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="NIP"
                    placeholder="1234567890"
                    {...register("nip")}
                    error={errors.nip?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Kod pocztowy"
                    placeholder="00-000"
                    {...register("postalCode")}
                    error={errors.postalCode?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Miejscowość / Dzielnica"
                    placeholder="(opcjonalnie)"
                    disabled
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Ulica"
                    placeholder="ul. Przykładowa"
                    {...register("street")}
                    error={errors.street?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Nr domu"
                    placeholder="12A"
                    {...register("houseNumber")}
                    error={errors.houseNumber?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <TextInput
                    label="Nr lokalu"
                    placeholder="5"
                    {...register("apartmentNumber")}
                    error={errors.apartmentNumber?.message}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Telefon"
                    placeholder="+48 123 456 789"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="E-mail"
                    placeholder="firma@example.com"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Strona WWW"
                    placeholder="https://example.com"
                    {...register("wwwSite")}
                    error={errors.wwwSite?.message}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Textarea
                    label="Uwagi"
                    minRows={3}
                    autosize
                    {...register("comments")}
                    error={errors.comments?.message}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="acquiredId"
                    label="Źródło pozyskania"
                    endpoint={API.acquisitions}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="districtId"
                    label="Dzielnica"
                    endpoint={API.districts}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="countryId"
                    label="Kraj"
                    endpoint={API.countries}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 3 }}>
                  <AsyncSelectRHF<FormValues>
                    control={control}
                    name="statusId"
                    label="Status"
                    endpoint={API.statuses}
                  />
                </Grid.Col>
              </Grid>

              <Divider my="xs" />

              <Group justify="flex-end">
                <Button variant="default" component={Link} to="/companies">
                  Anuluj
                </Button>
                <Button type="submit" disabled={!canSubmit}>
                  Zapisz firmę
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}

// ——— Helpers ———
async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
