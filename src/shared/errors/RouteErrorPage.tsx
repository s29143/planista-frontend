import {
  Button,
  Center,
  Stack,
  Text,
  Title,
  Paper,
  Group,
  Code,
} from "@mantine/core";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  let details = "";

  if (isRouteErrorResponse(error)) {
    details = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    details = error.message;
  } else if (error) {
    details = String(error);
  }

  return (
    <Center h="100vh" px="md">
      <Paper
        withBorder
        radius="lg"
        p="xl"
        shadow="sm"
        style={{ maxWidth: 520, width: "100%" }}
      >
        <Stack gap="md" align="center">
          <AlertTriangle size={48} />

          <Title order={2} ta="center">
            {t("messages.error")}
          </Title>

          <Text c="dimmed" ta="center">
            {t("messages.interfaceError")}
          </Text>

          {!!details && (
            <Code block w="100%">
              {details}
            </Code>
          )}

          <Group mt="md">
            <Button
              leftSection={<RotateCcw size={16} />}
              onClick={() => navigate(0)}
            >
              {t("actions.retry")}
            </Button>

            <Button
              variant="light"
              leftSection={<Home size={16} />}
              onClick={() => navigate("/")}
            >
              {t("actions.goHome")}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Center>
  );
}
