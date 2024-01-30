import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { GridProps } from "@mui/material/Grid";
import React from "react";
import { Control, FieldValues, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Grid from "@mui/material/Grid";
import { SxProps } from "@mui/material";
import { stringReplaceWithWhiteSpace } from "@/utils/func";

interface EmojiInputProps {
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
}

const EmojiInputFieldComponent = ({
  name,
  control,
  options,
  defaultValues,
  rules,
  targetValue,
  labelName,
  disabled,
  onChange,
}: EmojiInputProps) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValues}
        render={({ field }) => {
          return (
            <RadioGroup row={true} {...field}>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                {options?.map((option, index) => {
                  return (
                    <Grid item key={index}>
                      <FormControlLabel
                        key={index}
                        sx={{ width: "100%", margin: 0, padding: 0 }}
                        label=""
                        value={option[targetValue]}
                        control={
                          <Radio
                            onChange={onChange}
                            disabled={disabled}
                            sx={{ width: "100%", padding: 0 }}
                            icon={
                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <Box m={0.5}>
                                  <img
                                    style={{
                                      opacity: disabled ? 0.5 : 1,
                                    }}
                                    width={50}
                                    src={`/assets/images/icons/${stringReplaceWithWhiteSpace(
                                      option[`${labelName}`],
                                      "_"
                                    )}.svg`}
                                  />
                                </Box>
                                <Box
                                  sx={(theme) => ({
                                    minWidth: 10,
                                    minHeight: 10,
                                    maxWidth: 10,
                                    borderRadius: 100,
                                    backgroundColor: "transparent",
                                  })}
                                ></Box>
                              </Box>
                            }
                            checkedIcon={
                              <Box
                                sx={{
                                  width: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "column",
                                }}
                              >
                                <Box m={0.5}>
                                  <img
                                    width={50}
                                    src={`/assets/images/icons/${stringReplaceWithWhiteSpace(
                                      option[`${labelName}`],
                                      "_"
                                    )}.svg`}
                                  />
                                </Box>
                                <Box
                                  sx={(theme) => ({
                                    minWidth: 10,
                                    minHeight: 10,
                                    maxWidth: 10,
                                    borderRadius: 100,
                                    backgroundColor: theme.palette.primary.main,
                                  })}
                                ></Box>
                              </Box>
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

export default EmojiInputFieldComponent;
