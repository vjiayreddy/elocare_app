import React from "react";
import Button, { ButtonProps } from "@mui/material/Button";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors/colors";

interface LoadingButtonComponentProps extends ButtonProps {
  children: React.ReactNode;
  showLoading?: boolean;
  dotSize?: string;
  dotColor?: string;
}

const LoadingButtonComponent = ({
  children,
  showLoading,
  dotSize,
  dotColor,
  ...props
}: LoadingButtonComponentProps) => {
  return (
    <Button {...props}>
      {showLoading && (
        <ThreeDots
          height={dotSize || "40"}
          width={dotSize || "40"}
          radius="9"
          color={dotColor || APP_COLORS.WHITE}
          ariaLabel="loading"
          visible={true}
        />
      )}
      {!showLoading && <> {children}</>}
    </Button>
  );
};

export default LoadingButtonComponent;
