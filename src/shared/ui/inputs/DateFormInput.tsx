import { NumberInput } from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type NumInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error: React.ReactNode;
  withAsterisk?: boolean;
};
export default function NumInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  withAsterisk,
}: NumInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <NumberInput
          label={label}
          withAsterisk={withAsterisk}
          placeholder={placeholder}
          value={field.value ?? undefined}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={error}
        />
      )}
    />
  );
}
