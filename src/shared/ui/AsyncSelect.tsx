import { MultiSelect, Select } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { fetchOptions, type Option } from "../api/fetchOptions";

type Props = {
  label: React.ReactNode;
  endpoint: string;
  placeholder?: string;
  clearable?: boolean;
  multiple?: boolean;
  value: string | string[] | null | undefined;
  onChange: (v: string | string[] | undefined) => void;
  mapItem?: (i: any) => Option;
};

export default function AsyncSelect({
  label,
  endpoint,
  placeholder,
  clearable,
  multiple,
  value,
  onChange,
  mapItem,
}: Props) {
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 300);
  const [options, setOptions] = useState<Option[]>([]);
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

  if (multiple) {
    return (
      <MultiSelect
        label={label}
        searchable
        searchValue={search}
        onSearchChange={setSearch}
        data={options}
        rightSection={
          loading ? <span className="mantine-loading-dots" /> : null
        }
        placeholder={placeholder}
        clearable={clearable}
        multiple={true}
        limit={20}
        value={(value as string[]) ?? []}
        onChange={(vals) => onChange(vals)}
        style={{ width: "100%" as const }}
      />
    );
  }
  return (
    <Select
      label={label}
      searchable
      searchValue={search}
      onSearchChange={setSearch}
      data={options}
      rightSection={loading ? <span className="mantine-loading-dots" /> : null}
      placeholder={placeholder}
      clearable={clearable}
      limit={20}
      value={(value as string) ?? null}
      onChange={(val) => onChange(val ?? undefined)}
      style={{ width: "100%" as const }}
    />
  );
}
