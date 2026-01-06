import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Group, NumberInput, Text } from "@mantine/core";
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
        const value = field.value ?? { hours: 0, minutes: 0, seconds: 0 };

        return (
          <div>
            <Text fw={500} mb={6}>
              {label} {required ? "*" : null}
            </Text>

            <Group gap="sm" align="flex-start">
              <NumberInput
                label="h"
                min={0}
                allowDecimal={false}
                value={value.hours}
                onChange={(hours) =>
                  field.onChange({
                    ...value,
                    hours: Number(hours ?? 0),
                  })
                }
                onBlur={field.onBlur}
                error={error}
              />

              <NumberInput
                label="m"
                min={0}
                max={59}
                allowDecimal={false}
                value={value.minutes}
                onChange={(minutes) =>
                  field.onChange({
                    ...value,
                    minutes: Number(minutes ?? 0),
                  })
                }
                onBlur={field.onBlur}
                error={error}
              />

              <NumberInput
                label="s"
                min={0}
                max={59}
                allowDecimal={false}
                value={value.seconds}
                onChange={(seconds) =>
                  field.onChange({
                    ...value,
                    seconds: Number(seconds ?? 0),
                  })
                }
                onBlur={field.onBlur}
                error={error}
              />
            </Group>
          </div>
        );
      }}
    />
  );
}
