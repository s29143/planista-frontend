import {
  ActionIcon,
  Group,
  NumberInput,
  Paper,
  Select,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type z from "zod";
import { DatePickerInput } from "@mantine/dates";
import isEqual from "fast-deep-equal";

export type FilterFieldBase<K extends string> = {
  name: K;
  label: React.ReactNode;
  span?: number;
};

export type TextField<K extends string> = FilterFieldBase<K> & {
  type: "text";
  placeholder?: string;
};

export type SelectField<K extends string> = FilterFieldBase<K> & {
  type: "select";
  data: { value: string; label: string }[];
  placeholder?: string;
  clearable?: boolean;
};

export type NumberField<K extends string> = FilterFieldBase<K> & {
  type: "number";
  min?: number;
  max?: number;
  placeholder?: string;
};

export type DateRangeField<K extends string> = FilterFieldBase<K> & {
  type: "dateRange";
  placeholder?: string;
};

export type FilterField<K extends string> =
  | TextField<K>
  | SelectField<K>
  | NumberField<K>
  | DateRangeField<K>;

export type FilterBarProps<TFilters extends Record<string, any>> = {
  fields: FilterField<Extract<keyof TFilters, string>>[];
  schema: z.ZodType<TFilters>;
  value: TFilters;
  onChange: (patch: Partial<TFilters>) => void;
  onReset?: () => void;
};

export function FilterBar<TFilters extends Record<string, any>>({
  fields,
  schema,
  value,
  onChange,
  onReset,
}: FilterBarProps<TFilters>) {
  const { t } = useTranslation();
  const [local, setLocal] = useState<TFilters>(value);
  const [debounced] = useDebouncedValue(local, 300);

  useEffect(() => {
    const parsed = schema.safeParse(debounced);
    if (!parsed.success) return;
    if (isEqual(parsed.data, value)) return;

    onChange(parsed.data);
  }, [debounced, schema, value, onChange]);

  useEffect(() => {
    if (isEqual(value, local)) return;
    setLocal(value);
  }, [value, local]);

  return (
    <Paper p="md" withBorder radius="lg">
      <Group align="end" wrap="wrap" gap="md">
        {fields.map((f) => {
          const name = f.name as keyof TFilters;
          const val = local[name];

          switch (f.type) {
            case "text":
              return (
                <TextInput
                  key={String(f.name)}
                  label={f.label}
                  placeholder={(f as TextField<string>).placeholder}
                  leftSection={<Search size={16} />}
                  value={(val as string) ?? ""}
                  onChange={(e) =>
                    setLocal({ ...local, [name]: e.currentTarget.value })
                  }
                  style={{ minWidth: 240 }}
                />
              );
            case "select": {
              const field = f as SelectField<any>;
              return (
                <Select
                  key={String(f.name)}
                  label={f.label}
                  data={field.data}
                  placeholder={field.placeholder}
                  clearable={field.clearable}
                  value={(val as string) ?? null}
                  onChange={(v) =>
                    setLocal({ ...local, [name]: v ?? undefined })
                  }
                />
              );
            }
            case "number": {
              const field = f as NumberField<any>;
              return (
                <NumberInput
                  key={String(f.name)}
                  label={f.label}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  value={typeof val === "number" ? val : undefined}
                  onChange={(v) => {
                    const num =
                      typeof v === "number"
                        ? v
                        : Number.isNaN(Number(v))
                        ? undefined
                        : Number(v);
                    setLocal({ ...local, [name]: num });
                  }}
                  style={{ width: 160 }}
                />
              );
            }
            case "dateRange":
              return (
                <DatePickerInput
                  key={String(f.name)}
                  type="range"
                  label={f.label}
                  placeholder={(f as DateRangeField<string>).placeholder}
                  value={(val as [Date | null, Date | null]) ?? [null, null]}
                  onChange={(range) => {
                    if (range && range[0] && range[1] && range[0] > range[1]) {
                      range = [range[1], range[0]];
                    }
                    setLocal({ ...local, [name]: range });
                  }}
                />
              );
          }
        })}
        {onReset && (
          <Tooltip label={t("actions.reset") as string}>
            <ActionIcon
              variant="light"
              color="gray"
              onClick={onReset}
              aria-label="reset-filters"
            >
              <RefreshCw size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Paper>
  );
}
