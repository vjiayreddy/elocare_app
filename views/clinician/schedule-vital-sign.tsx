import { APP_COLORS } from "@/theme/colors/colors";
import { shouldForwardProp } from "@/utils/func";
import { Box, Button, Typography, styled } from "@mui/material";
import React, { Fragment } from "react";
import { ThreeDots } from "react-loader-spinner";

interface ScheduleVitalSignProps {
  onClick: () => void;
  disabled?: boolean;
  showLoading?: boolean;
}

const StyledScheduleVitalSign = styled(Button, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ disabled: boolean }>(["disabled"], prop),
})<{ disabled: boolean }>(({ theme, disabled }) => ({
  width: "100%",
  minHeight: 90,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 5,
  backgroundColor: theme.palette.primary.main,
  ...(disabled && {
    backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
  }),
}));

const ScheduleVitalSign = ({
  onClick,
  disabled,
  showLoading,
}: ScheduleVitalSignProps) => {
  return (
    <StyledScheduleVitalSign
      disabled={disabled as boolean}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      {showLoading && (
        <ThreeDots
          height={"40"}
          width={"40"}
          radius="9"
          color={APP_COLORS.WHITE}
          ariaLabel="loading"
          visible={true}
        />
      )}
      {!showLoading && (
        <Fragment>
          <Box mt={1}>
            <img width={45} alt="vital-sign" src="/icons/vitals.svg" />
          </Box>
          <Box pl={2}>
            <Typography textAlign="left" variant="subtitle1">
              Vital <br />
              Signals
            </Typography>
          </Box>
        </Fragment>
      )}
    </StyledScheduleVitalSign>
  );
};

export default ScheduleVitalSign;
