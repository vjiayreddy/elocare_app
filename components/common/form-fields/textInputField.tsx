import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FormHelperText } from "@mui/material";

interface TextInputFieldComponentProps {
  id: string;
  name: string;
  control: Control<FieldValues, object> | any;
  rules?: any;
  label: string;
  defaultValue: string;
  textFieldProps: TextFieldProps;
  onInputChange?: (value: any) => void;
}

const TextInputFieldComponent = ({
  id,
  name,
  control,
  rules,
  label,
  defaultValue,
  textFieldProps,
  onInputChange,
}: TextInputFieldComponentProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        rules={rules}
        render={({ field: { onChange, ...rest }, fieldState }) => {
          return (
            <>
              <TextField
                {...rest}
                id={id}
                variant="outlined"
                label={label}
                error={!!fieldState?.error}
                margin="none"
                onChange={(value)=>{
                  onChange(value);
                  onInputChange?.(value);
                }}
                {...textFieldProps}
              />
              {!!fieldState?.error && (
                <FormHelperText sx={{ marginLeft: 0 }} error={true}>
                  {fieldState?.error?.message}
                </FormHelperText>
              )}
            </>
          );
        }}
      />
    </FormControl>
  );
};

export default TextInputFieldComponent;
