import React, { Fragment } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Chip from "@mui/material/Chip";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

interface AutoCompleteControlProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  label?: string;
  targetValue?: string;
  optionTargetValue?: string;
  isEqualValue: string;
  defaultValues?: any;
  options: any[];
  control: Control<FieldValues, object> | any;
  size?: "small" | "medium";
  onChange?: (data: any) => void;
  multiple?: boolean;
  readOnly?: boolean;
  inputPlaceHolder?: string;
}

const FormAutoCompleteInputFiled = ({
  id,
  name,
  control,
  rules,
  defaultValues,
  isEqualValue,
  targetValue,
  options,
  onChange,
  size,
  multiple,
  readOnly,
  inputPlaceHolder,
}: AutoCompleteControlProps) => {
  console.log(options);
  console.log(targetValue);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValues || null}
      rules={rules}
      render={({ field, fieldState }) => (
        <Fragment>
          <Autocomplete
            id={id}
            size={size}
            readOnly={readOnly}
            options={options}
            multiple={multiple}
            filterSelectedOptions
            getOptionLabel={(option) =>option.label}
            isOptionEqualToValue={(option, value) =>
              option[isEqualValue] === value[isEqualValue]
            }
            onChange={(_, data) => {
              field.onChange(data);
              onChange?.(data);
            }}
            renderTags={(options, getTagProps) => {
              return options.map((option, index: number) => (
                <Chip
                  {...getTagProps({
                    index: index,
                  })}
                  key={option._id}
                  label={option[targetValue as string]}
                  variant="outlined"
                />
              ));
            }}
            renderOption={(props, option) => (
              <ListItem {...props} key={option?.label} alignItems="flex-start">
                <ListItemText
                  primary={`${option[targetValue as string]}`}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {option?.email}
                    </Typography>
                  }
                />
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                error={!!fieldState?.error}
                label=""
                placeholder={inputPlaceHolder}
              />
            )}
            value={field.value}
          />
          {fieldState?.error && (
            <FormHelperText error>{fieldState.error.message}</FormHelperText>
          )}
        </Fragment>
      )}
    ></Controller>
  );
};

export default FormAutoCompleteInputFiled;
