import FormControl from "@mui/material/FormControl";
import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePickerProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface TimePickerInputFieldComponentProps {
  id?: string;
  name: string;
  control: Control<FieldValues, object> | any;
  rules?: any;
  label: string;
  defaultValue: any;
  dateInputFieldProps?: DatePickerProps<Date>;
}

const TimePickerInputFieldComponent = ({
  name,
  control,
  rules,
  label,
  defaultValue,
}: TimePickerInputFieldComponentProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue ? dayjs(new Date(defaultValue)) : null}
        rules={rules}
        render={({
          field: { ref, onBlur, name, onChange, ...field },
          fieldState,
        }) => {
          return (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  inputRef={ref}
                  {...field}
                  label={label}
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      required: true,
                      onBlur,
                      name,
                      error: !!fieldState?.error,
                      helperText: fieldState?.error?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            </>
          );
        }}
      />
    </FormControl>
  );
};

export default TimePickerInputFieldComponent;
