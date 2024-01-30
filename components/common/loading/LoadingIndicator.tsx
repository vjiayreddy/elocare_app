import { APP_COLORS } from "@/theme/colors/colors";
import { Box, styled } from "@mui/material";
import React from "react";
import { ThreeDots } from "react-loader-spinner";

const StyledLoadingIndicatorComponent = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
}));

interface LoadingIndicatorComponent {
  dotSize?: string;
  dotColor?: string;
}

const LoadingIndicatorComponent = ({
  dotColor,
  dotSize,
}: LoadingIndicatorComponent) => {
  return (
    <StyledLoadingIndicatorComponent>
      <ThreeDots
        height={dotSize || "40"}
        width={dotSize || "40"}
        radius="9"
        color={dotColor || APP_COLORS.PRIMARY_COLOR}
        ariaLabel="loading"
        visible={true}
      />
    </StyledLoadingIndicatorComponent>
  );
};

export default LoadingIndicatorComponent;
