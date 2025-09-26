import { useEffect, useState } from "react";
import { Select, type SelectProps } from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { useDebouncedValue } from "@mantine/hooks";
import { fetchOptions } from "../api/fetchOptions";
import { useTranslation } from "react-i18next";

export type Option = { value: string; label: string };

type AsyncSelectRHFProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  endpoint: string;
  mapItem?: (i: any) => Option;
  debounceMs?: number;
  placeholder?: string;
} & Omit<
  SelectProps,
  "data" | "onChange" | "searchValue" | "onSearchChange" | "value"
>;

export function AsyncSelectRHF<T extends FieldValues>({
  control,
  name,
  label,
  endpoint,
  mapItem,
  debounceMs = 300,
  placeholder,
  ...rest
}: AsyncSelectRHFProps<T>) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Option[]>([]);
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, debounceMs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const opts = await fetchOptions(endpoint, debounced, mapItem);
        if (alive) setOptions(opts);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [endpoint, debounced, mapItem]);

  if (!placeholder) {
    placeholder = t("actions.select");
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          placeholder={placeholder}
          searchable
          data={options}
          searchValue={search}
          onSearchChange={setSearch}
          value={field.value ?? null}
          onChange={(v) => field.onChange(v ?? undefined)}
          error={fieldState.error?.message}
          nothingFoundMessage={
            loading ? t("messages.loading") : t("messages.noData")
          }
          {...rest}
        />
      )}
    />
  );
}
