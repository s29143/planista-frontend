import { Center, Loader, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { appTheme } from "@/shared/ui/theme";
import { AppRouter } from "./Router";
import "@/shared/i18n";
import { Suspense } from "react";
import { Providers } from "./Providers";

export default function App() {
  return (
    <MantineProvider theme={appTheme}>
      <ModalsProvider>
        <Notifications position="top-right" />
        <Providers>
          <Suspense
            fallback={
              <Center mih={200}>
                <Loader />
              </Center>
            }
          >
            <AppRouter />
          </Suspense>
        </Providers>
      </ModalsProvider>
    </MantineProvider>
  );
}
