import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import { alpha, styled } from "@mui/material/styles";
import React from "react";
import { Control, FieldValues, Controller } from "react-hook-form";

interface CustomTextInputFieldProps {
  id: string;
  name: string;
  control: Control<FieldValues, object> | any;
  rules?: any;
  label?: string;
  defaultValue: string;
  baseTextFieldProps: InputBaseProps;
  formControlVariant?: "standard" | "outlined" | "filled" | undefined;
}

const BaseTextInputField = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid",
    borderColor: theme.palette.divider,
    fontSize: 16,
    width: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

const CustomTextInputField = ({
  id,
  name,
  control,
  rules,
  label,
  defaultValue,
  baseTextFieldProps,
  formControlVariant = "standard",
}: CustomTextInputFieldProps) => {
  return (
    <FormControl sx={{ width: "100%" }} variant={formControlVariant}>
      {label && (
        <InputLabel shrink htmlFor="bootstrap-input">
          {label}
        </InputLabel>
      )}

      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          return (
            <>
              <BaseTextInputField
                fullWidth={true}
                id={id}
                error={!!fieldState?.error}
                {...field}
                {...baseTextFieldProps}
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

export default CustomTextInputField;
