import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { GridProps } from "@mui/material/Grid";
import React, { Fragment } from "react";
import { Control, FieldValues, Controller } from "react-hook-form";
import RadioGroup, { RadioGroupProps } from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import { Button, ButtonProps, SxProps } from "@mui/material";
import CheckBoxButtonComponent from "../buttons/check-box-button/CheckBoxButton";

interface RadioGroupSelectionProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  labelName?: string;
  defaultValues?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: any[];
  control: Control<FieldValues, object> | any;
  gridProps?: GridProps;
  gridItemProps?: GridProps;
  colorBoxSx?: SxProps;
  targetValue: string;
  disabled?: boolean;
  varient?: "BUTTON" | "NORMAL" | "CHECK_BOX_BUTTON";
  radioGroupProps?: RadioGroupProps;
  varientBtnProps?: ButtonProps;
}

const RadioGroupSelectionComponent = ({
  name,
  control,
  options,
  defaultValues,
  rules,
  targetValue,
  labelName,
  disabled,
  gridProps,
  gridItemProps,
  radioGroupProps,
  varient = "NORMAL",
  varientBtnProps,
  onChange,
}: RadioGroupSelectionProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValues}
        render={({ field }) => {
          return (
            <RadioGroup row={true} {...radioGroupProps} {...field}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                {...gridProps}
              >
                {options?.map((option, index) => {
                  return (
                    <Grid item key={index} {...gridItemProps}>
                      <FormControlLabel
                        key={index}
                        sx={{ width: "100%", margin: 0, padding: 0 }}
                        label={
                          varient === "NORMAL" ? option[`${labelName}`] : ""
                        }
                        value={option[targetValue]}
                        control={
                          <Radio
                            onChange={onChange}
                            disabled={disabled}
                            sx={{ width: "100%", padding: 0 }}
                            icon={
                              <Fragment>
                                {varient === "BUTTON" && (
                                  <Button
                                    variant="outlined"
                                    {...varientBtnProps}
                                  >
                                    {option[`${labelName}`]}
                                  </Button>
                                )}
                                {varient === "CHECK_BOX_BUTTON" && (
                                  <CheckBoxButtonComponent
                                    label={option[`${labelName}`]}
                                  />
                                )}
                              </Fragment>
                            }
                            checkedIcon={
                              <Fragment>
                                {varient === "BUTTON" && (
                                  <Button
                                    variant="contained"
                                    {...varientBtnProps}
                                  >
                                    {option[`${labelName}`]}
                                  </Button>
                                )}
                                {varient === "CHECK_BOX_BUTTON" && (
                                  <CheckBoxButtonComponent
                                    isSelected={true}
                                    label={option[`${labelName}`]}
                                  />
                                )}
                              </Fragment>
                            }
                          />
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </RadioGroup>
          );
        }}
      />
    </FormControl>
  );
};

export default RadioGroupSelectionComponent;
