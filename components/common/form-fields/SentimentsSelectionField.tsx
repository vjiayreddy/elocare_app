import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import { Grid } from "swiper/modules";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Control, FieldValues, Controller } from "react-hook-form";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { APP_COLORS } from "@/theme/colors/colors";

const StyledGridItem = styled(Box)(({ theme }) => ({
  minHeight: 60,
  width: "100%",
  backgroundColor: theme.palette.grey[100],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
}));

interface SentimentsSelectionFieldProps {
  id: string;
  name: string;
  rules?: any;
  error?: any;
  labelName?: string;
  defaultValues?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, data: any) => void;
  options: any[];
  control: Control<FieldValues, object> | any;
  targetValue: string;
  disabled?: boolean;
}

const SentimentsSelectionField = ({
  name,
  control,
  options,
  defaultValues,
  rules,
  targetValue,
  labelName,
  disabled,
  onChange,
}: SentimentsSelectionFieldProps) => {
  const theme = useTheme();
  const isUpSmDevice = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValues}
      render={({ field }) => (
        <RadioGroup row={true} {...field}>
          <Swiper
            slidesPerView={isUpSmDevice ? 4 : 3}
            grid={{
              rows: 4,
              fill: "row",
            }}
            spaceBetween={10}
            centeredSlides={true}
            centeredSlidesBounds={true}
            pagination={{
              clickable: true,
            }}
            modules={[Grid]}
            className="mySwiper"
          >
            {options?.map((option, index) => (
              <SwiperSlide key={index}>
                <FormControlLabel
                  sx={{ width: "100%", margin: 0, padding: 0 }}
                  label=""
                  value={option[targetValue]}
                  control={
                    <Radio
                      onChange={(e) => {
                        onChange?.(e, option);
                      }}
                      disabled={disabled}
                      sx={{ width: "100%", padding: 0 }}
                      icon={
                        <StyledGridItem>
                          {option[`${labelName}`]}
                        </StyledGridItem>
                      }
                      checkedIcon={
                        <StyledGridItem
                          sx={(theme) => ({
                            backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
                            color: theme.palette.common.black,
                          })}
                        >
                          {option[`${labelName}`]}
                        </StyledGridItem>
                      }
                    />
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </RadioGroup>
      )}
    />
  );
};

export default SentimentsSelectionField;
