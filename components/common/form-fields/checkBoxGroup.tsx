import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBox from "@mui/material/Checkbox";
import Grid, { GridProps } from "@mui/material/Grid";
import React from "react";
import { Control, FieldValues, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material";
import CusCheckBoxButtonComponent from "./customCheckBoxIcon";

interface CheckBoxControlGroupProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  labelName?: string;
  defaultValues?: any;
  variant?: "IMAGE" | "CHIP" | "NORMAL" | "COLOR_BOX";
  onChange: (checkValue: any, field: string) => void;
  options: any[];
  control: Control<FieldValues, object>;
  gridProps?: GridProps;
  gridItemProps?: GridProps;
  colorBoxSx?: SxProps;
}

const CheckBoxControlGroup = ({
  gridProps,
  name,
  control,
  options,
  onChange,
  defaultValues,
  variant,
  labelName,
  gridItemProps,
  rules,
  colorBoxSx,
}: CheckBoxControlGroupProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValues}
        render={({ field, fieldState }) => {
          return (
            <Grid container spacing={0} {...gridProps}>
              {options.map((option) => (
                <Grid item {...gridItemProps} key={option._id}>
                  <FormControlLabel
                    sx={{ width: "100%", margin: 0, padding: 0 }}
                    label={""}
                    control={
                      <CheckBox
                        sx={{width:"100%"}}
                        {...field}
                        value={field.value}
                        checked={field?.value?.includes(option._id)}
                        onChange={() => {
                          field.onChange(onChange(option._id, name));
                        }}
                        icon={
                          <CusCheckBoxButtonComponent
                            label={option[`${labelName}`]}
                          />
                        }
                        checkedIcon={ <CusCheckBoxButtonComponent
                          isSelected={true}
                          label={option[`${labelName}`]}
                        />}
                      />
                    }
                  />
                </Grid>
              ))}
              {fieldState?.error && (
                <Grid item xs={12}>
                  <p>Please Select</p>
                </Grid>
              )}
            </Grid>
          );
        }}
      />
    </FormControl>
  );
};

export default CheckBoxControlGroup;
