import { AppShell, Group, Text } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { LanguageSwitcher } from "../buttons/LanguageSwitcher";
import { ColorSchemeToggle } from "../buttons/ColorSchemeToggle";
import { LogoutButton } from "@/shared/ui/buttons/LogoutButton";

export default function LoginLayout() {
  return (
    <AppShell header={{ height: 56 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={600}>Planista</Text>

          <Group gap="md">
            <LanguageSwitcher />
            <ColorSchemeToggle />
            <LogoutButton />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
