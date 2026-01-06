import { DatePickerInput } from "@mantine/dates";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type DateFormInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  error: React.ReactNode;
  withAsterisk?: boolean;
};
export default function DateFormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  withAsterisk,
}: DateFormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePickerInput
          label={label}
          withAsterisk={withAsterisk}
          placeholder={placeholder}
          value={field.value ?? undefined}
          onChange={(value) => field.onChange(value)}
          onBlur={field.onBlur}
          error={error}
          valueFormat="YYYY-MM-DD"
        />
      )}
    />
  );
}
