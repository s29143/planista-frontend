import { InputBase, type InputBaseProps } from "@mantine/core";
import { IMaskInput } from "react-imask";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Props<T extends FieldValues> = Omit<
  InputBaseProps,
  "value" | "defaultValue" | "onChange" | "name" | "component"
> & {
  control: Control<T>;
  name: Path<T>;
  mask?: any;
  placeholder?: string;
  transform?: (value: string) => any;
};

export default function MaskedTextInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  mask,
  transform,
  ...inputProps
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputBase
          placeholder={placeholder}
          {...inputProps}
          component={IMaskInput as any}
          type="text"
          value={(field.value ?? "") as any}
          onAccept={(value: unknown) => {
            const v = String(value ?? "");
            field.onChange(transform ? transform(v) : v);
          }}
          onBlur={field.onBlur}
          mask={mask}
          ref={field.ref as any}
        />
      )}
    />
  );
}
