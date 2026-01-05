import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Moon, Sun } from "lucide-react";

export function ColorSchemeToggle() {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const next = colorScheme === "light" ? "dark" : "light";
    return (
    <ActionIcon
        variant="subtle"
        onClick={() => setColorScheme(next)}
        aria-label="Toggle color scheme"
    >
        {colorScheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </ActionIcon>
    );
}
