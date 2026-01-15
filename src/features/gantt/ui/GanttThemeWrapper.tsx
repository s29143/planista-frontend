import type { MantineColorScheme } from "@mantine/core";
import { Willow, WillowDark } from "@svar-ui/react-gantt";
import type { ReactNode } from "react";

type Props = {
  colorScheme: MantineColorScheme;
  children: ReactNode;
};
export function GanttThemeWrapper({ colorScheme, children }: Props) {
  const Theme = colorScheme === "dark" ? WillowDark : Willow;
  return <Theme>{children}</Theme>;
}
