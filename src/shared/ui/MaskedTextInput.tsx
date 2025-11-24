import { InputBase, type InputBaseProps } from "@mantine/core";
import { IMaskInput, type IMaskInputProps } from "react-imask";
import { forwardRef } from "react";

type MaskedTextInputProps = InputBaseProps &
  Omit<IMaskInputProps<HTMLInputElement>, keyof InputBaseProps>;

export const MaskedTextInput = forwardRef<
  HTMLInputElement,
  MaskedTextInputProps
>((props, ref) => (
  <InputBase {...props} component={IMaskInput} inputRef={ref} type="text" />
));

MaskedTextInput.displayName = "MaskedTextInput";
