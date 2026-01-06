import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Group, NumberInput, Stack, Text } from "@mantine/core";

type DurationParts = { hours: number; minutes: number; seconds: number };

type DurationFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  required?: boolean;
  error?: string;
};

export function DurationField<T extends FieldValues>({
  name,
  control,
  label,
  required,
  error,
}: DurationFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={{ hours: 0, minutes: 0, seconds: 0 } as any}
      render={({ field }) => {
        const value: DurationParts =
          field.value ??
          ({ hours: 0, minutes: 0, seconds: 0 } as DurationParts);

        const commonProps = {
          min: 0,
          allowDecimal: false,
          onBlur: field.onBlur,
          styles: {
            input: {
              borderColor: error ? "var(--mantine-color-red-6)" : undefined,
            },
          } as const,
        };

        return (
          <Stack gap={4}>
            <Text fw={500}>
              {label}{" "}
              {required ? <span className="text-red-500">*</span> : null}
            </Text>

            <Group gap={0} align="flex-start" wrap="nowrap">
              <NumberInput
                {...commonProps}
                value={value.hours}
                onChange={(hours) =>
                  field.onChange({ ...value, hours: Number(hours ?? 0) })
                }
                rightSection={<Text size="xs">h</Text>}
                rightSectionWidth={22}
                radius="md"
                styles={{
                  ...commonProps.styles,
                  input: {
                    ...commonProps.styles.input,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderRightWidth: 0,
                  },
                }}
              />

              <NumberInput
                {...commonProps}
                value={value.minutes}
                max={59}
                onChange={(minutes) =>
                  field.onChange({ ...value, minutes: Number(minutes ?? 0) })
                }
                rightSection={<Text size="xs">m</Text>}
                rightSectionWidth={22}
                radius={0}
                styles={{
                  ...commonProps.styles,
                  input: {
                    ...commonProps.styles.input,
                    borderRadius: 0,
                    borderRightWidth: 0,
                  },
                }}
              />

              <NumberInput
                {...commonProps}
                value={value.seconds}
                max={59}
                onChange={(seconds) =>
                  field.onChange({ ...value, seconds: Number(seconds ?? 0) })
                }
                rightSection={<Text size="xs">s</Text>}
                rightSectionWidth={22}
                radius="md"
                styles={{
                  ...commonProps.styles,
                  input: {
                    ...commonProps.styles.input,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  },
                }}
              />
            </Group>

            {error ? (
              <Text c="red" size="xs">
                {error}
              </Text>
            ) : null}
          </Stack>
        );
      }}
    />
  );
}
