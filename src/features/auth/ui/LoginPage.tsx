import { z } from "zod";
import { useForm as useRHF } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Stack,
  Title,
  Group,
  Center,
} from "@mantine/core";
import { useLogin, useMe } from "../api/queries";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/api/authStore";

export default function LoginPage() {
  const { t } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");
  const schema = z.object({
    username: z.string().nonempty({
      message: t("validation.required", "Username is required", {
        field: tAuth("fields.username", "Username"),
      }),
    }),
    password: z.string().nonempty({
      message: t("validation.required", "Password is required", {
        field: tAuth("fields.password", "Password"),
      }),
    }),
  });
  type FormData = z.infer<typeof schema>;
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { isBootstrapped, setBootstrapped, accessToken, setSession } =
    useAuthStore();

  const { data, isLoading, isError } = useMe(!isBootstrapped);

  useEffect(() => {
    if (!isBootstrapped && data) {
      setSession(data, accessToken ?? "");
      setBootstrapped(true);
    } else if (!isBootstrapped && (isError || !isLoading)) {
      setBootstrapped(true);
    }
  }, [
    isBootstrapped,
    data,
    isError,
    isLoading,
    accessToken,
    setBootstrapped,
    setSession,
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    setFocus,
  } = useRHF<FormData>({ resolver: zodResolver(schema), mode: "onBlur" });

  const login = useLogin();

  const onSubmit = async (data: FormData) => {
    try {
      clearErrors();
      const session = await login.mutateAsync(data);
      useAuthStore.getState().setSession(session.user, session.accessToken);
      navigate(from, { replace: true });
    } catch (e: unknown) {
      let message = tAuth("errors.loginFailed", "Login failed");
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 401) {
          message = tAuth(
            "errors.invalidCredentials",
            "Invalid username or password"
          );
        }
        message = e.response?.data?.message ?? message;
      }
      setError("root", { type: "server", message });
      setError("password", { type: "server", message });
      setFocus("password");
    }
  };

  if (user) return <Navigate to={from} replace />;

  return (
    <Center h={"calc(100svh - 56px)"} px="sm">
      <Paper maw={420} mx="auto" p="lg" withBorder w={"100%"}>
        <Title order={3} mb="md">
          {t("pages.signin", "Login")}
        </Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={20}>
            <TextInput
              label={tAuth("fields.username", "Username")}
              {...register("username")}
              error={errors.username?.message}
            />
            <PasswordInput
              label={tAuth("fields.password", "Password")}
              {...register("password")}
              error={errors.password?.message}
            />
            <Group justify="space-between">
              <Button type="submit" loading={isSubmitting}>
                {t("actions.login", "Login")}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
