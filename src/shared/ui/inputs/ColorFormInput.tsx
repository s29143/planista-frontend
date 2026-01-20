import { ColorInput } from "@mantine/core";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type ColorInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error: React.ReactNode;
  withAsterisk?: boolean;
};
export default function ColorFormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  withAsterisk,
}: ColorInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ColorInput
          format="hex"
          withPicker
          label={label}
          placeholder={placeholder}
          value={field.value ?? undefined}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={error}
          type="text"
          withAsterisk={withAsterisk}
        />
      )}
    />
  );
}
