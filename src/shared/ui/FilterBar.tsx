import {
  ActionIcon,
  Grid,
  NumberInput,
  Paper,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { RefreshCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type z from "zod";
import { DatePickerInput } from "@mantine/dates";
import isEqual from "fast-deep-equal";
import AsyncSelect from "./AsyncSelect";
import type { Option } from "../api/fetchOptions";

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
  endpoint: string;
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  mapItem?: (i: any) => Option;
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
  const suppressNextOnChange = useRef(false);
  const { t } = useTranslation();
  const [local, setLocal] = useState<TFilters>(value);
  const [debounced] = useDebouncedValue(local, 300);

  useEffect(() => {
    const parsed = schema.safeParse(debounced);
    if (!parsed.success) return;

    if (suppressNextOnChange.current) {
      suppressNextOnChange.current = false;
      return;
    }

    if (isEqual(parsed.data, value)) return;
    onChange(parsed.data);
  }, [debounced, schema, value, onChange]);

  useEffect(() => {
    if (isEqual(value, local)) return;
    suppressNextOnChange.current = true;
    setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Paper p="md" withBorder radius="lg">
      <Grid columns={5} gutter="md">
        {fields.map((f) => {
          const name = f.name as keyof TFilters;
          const val = local[name];

          switch (f.type) {
            case "text":
              return (
                <Grid.Col
                  span={{ base: 5, sm: 2, lg: 1 }}
                  key={String(f.name + "-col")}
                >
                  <TextInput
                    key={String(f.name)}
                    label={f.label}
                    style={{ width: "100%" as const }}
                    placeholder={(f as TextField<string>).placeholder}
                    leftSection={<Search size={16} />}
                    value={(val as string) ?? ""}
                    onChange={(e) =>
                      setLocal({ ...local, [name]: e.currentTarget.value })
                    }
                  />
                </Grid.Col>
              );
            case "select": {
              const field = f as SelectField<any>;
              return (
                <Grid.Col
                  span={{ base: 5, sm: 2, lg: 1 }}
                  key={String(f.name + "-col")}
                >
                  <AsyncSelect
                    endpoint={f.endpoint}
                    key={String(f.name)}
                    label={f.label}
                    placeholder={field.placeholder}
                    clearable={field.clearable}
                    multiple={field.multiple}
                    value={
                      field.multiple
                        ? (val as string[]) ?? []
                        : (val as string) ?? undefined
                    }
                    mapItem={f.mapItem}
                    onChange={(v) =>
                      setLocal({ ...local, [name]: v ?? undefined })
                    }
                  />
                </Grid.Col>
              );
            }
            case "number": {
              const field = f as NumberField<any>;
              return (
                <Grid.Col
                  span={{ base: 5, sm: 2, lg: 1 }}
                  key={String(f.name + "-col")}
                >
                  <NumberInput
                    key={String(f.name)}
                    label={f.label}
                    style={{ width: "100%" as const }}
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
                  />
                </Grid.Col>
              );
            }
            case "dateRange":
              return (
                <Grid.Col
                  span={{ base: 5, sm: 2, lg: 1 }}
                  key={String(f.name + "-col")}
                >
                  <DatePickerInput
                    key={String(f.name)}
                    label={f.label}
                    style={{ width: "100%" as const }}
                    type="range"
                    placeholder={
                      (f as DateRangeField<string>).placeholder ??
                      "dd.mm.rrrr – dd.mm.rrrr"
                    }
                    value={(val as [Date | null, Date | null]) ?? [null, null]}
                    allowSingleDateInRange
                    onChange={(range) => {
                      if (
                        range &&
                        range[0] &&
                        range[1] &&
                        range[0] > range[1]
                      ) {
                        range = [range[1], range[0]];
                      }
                      setLocal({ ...local, [name]: range });
                    }}
                  />
                </Grid.Col>
              );
          }
        })}

        {onReset && (
          <Grid.Col span="content" style={{ alignSelf: "end" }}>
            <Tooltip label={t("actions.reset") as string}>
              <ActionIcon
                variant="light"
                color="gray"
                onClick={() => {
                  onReset();
                  suppressNextOnChange.current = true;
                  setLocal(schema.parse({}));
                }}
                aria-label="reset-filters"
              >
                <RefreshCw size={18} />
              </ActionIcon>
            </Tooltip>
          </Grid.Col>
        )}
      </Grid>
    </Paper>
  );
}
