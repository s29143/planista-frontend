import { InputBase } from "@mantine/core";
import { IMaskInput } from "react-imask";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type MaskedTextInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error: React.ReactNode;
  withAsterisk?: boolean;
  mask?: any;
};
export default function MaskedTextInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  withAsterisk,
  mask,
}: MaskedTextInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputBase
          label={label}
          placeholder={placeholder}
          value={field.value ?? undefined}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={error}
          component={IMaskInput}
          type="text"
          mask={mask}
          withAsterisk={withAsterisk}
        />
      )}
    />
  );
}
