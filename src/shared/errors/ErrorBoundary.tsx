import React from "react";
import { Button, Center, Stack, Text, Title } from "@mantine/core";
import type { TFunction } from "i18next";
type Props = {
  t: TFunction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  Props,
  { hasError: boolean }
> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Center h="100vh">
          <Stack align="center" gap="md">
            <Title order={2}>{t("messages.error")}</Title>
            <Text c="dimmed">{t("messages.interfaceError")}</Text>
            <Button onClick={this.handleReset}>{t("action.retry")}</Button>
          </Stack>
        </Center>
      );
    }

    return this.props.children;
  }
}
