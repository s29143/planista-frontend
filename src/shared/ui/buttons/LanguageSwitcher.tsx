import { SegmentedControl, Group, Text, Menu, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { languages } from "@/shared/i18n/languages";
import { Check, Languages } from "lucide-react";
import { useTransition } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { supportedLngs } from "@/shared/i18n";

function flagFor(code: (typeof supportedLngs)[number]) {
  switch (code) {
    case "pl":
      return "🇵🇱";
    case "en":
      return "🇺🇸";
    default:
      return "🏳️";
  }
}

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;
  const [pending, startTransition] = useTransition();

  const change = (lng: string) => {
    if (lng === current) return;
    startTransition(async () => {
      await i18n.changeLanguage(lng);
      document.documentElement.lang = lng;
      localStorage.setItem("lng", lng);
    });
  };

  const data = languages.map((l) => ({
    value: l.code,
    label: (
      <Group gap={6} wrap="nowrap">
        <span aria-hidden>{flagFor(l.code)}</span>
        <Text size="xs" fw={600}>
          {l.code.toUpperCase()}
        </Text>
      </Group>
    ),
  }));

  return (
    <Group gap="xs">
      <SegmentedControl
        value={current}
        onChange={change}
        data={data}
        radius="xl"
        size="xs"
        color="blue"
        aria-label="Language"
        disabled={pending}
        visibleFrom="sm"
      />
      {useMediaQuery("(max-width: 768px)") && (
        <Menu withinPortal position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              aria-label="Change language"
              loading={pending as unknown as boolean}
            >
              <Languages size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {languages.map((l) => (
              <Menu.Item
                key={l.code}
                onClick={() => change(l.code)}
                rightSection={current === l.code ? <Check size={14} /> : null}
              >
                <Group gap={8} wrap="nowrap">
                  <span aria-hidden>{flagFor(l.code)}</span>
                  <Text size="sm">{l.label}</Text>
                </Group>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
