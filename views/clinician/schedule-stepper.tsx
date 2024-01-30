import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors/colors";

const StyledStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-label": {
    fontWeight: 600,
    [theme.breakpoints.up("sm")]: {
      fontSize: 20,
    },
    "& .Mui-active": {
      fontWeight: 600,
    },
  },
  "& .MuiStepContent-root": {
    paddingLeft: 27,
  },
}));

interface ScheduleStepperProps {
  steps: any[];
  handleNextStep: () => void;
  activeStep: number;
  isStepSumiting: boolean;
}

const ScheduleStepper = ({
  steps,
  activeStep,
  handleNextStep,
  isStepSumiting,
}: ScheduleStepperProps) => {
  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed } = props;
    return (
      <div>
        {active && (
          <img alt="step_not_started" src="/icons/step_not_started.svg" />
        )}
        {completed && (
          <img
            width={25}
            height={25}
            alt="step_completed"
            src="/icons/step_completed.svg"
          />
        )}
      </div>
    );
  }

  return (
    <Box sx={{ maxWidth: 400 }}>
      <StyledStepper activeStep={activeStep} orientation="vertical">
        {steps.map((step: any, index) => (
          <Step key={step._id}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              {step.title}
            </StepLabel>
            <StepContent>
              <Button
                disabled={isStepSumiting}
                onClick={handleNextStep}
                sx={{ padding: 0, height: 20, textDecoration: "underline" }}
                fullWidth={false}
                variant="text"
                endIcon={
                  isStepSumiting ? (
                    <ThreeDots
                      color={APP_COLORS.PRIMARY_COLOR}
                      height={14}
                      width={14}
                      visible={true}
                      radius="9"
                      ariaLabel="loading"
                    />
                  ) : (
                    <img alt="back-arrow" src="/icons/back-arrow-colored.svg" />
                  )
                }
              >
                {steps[index + 1]?.title
                  ? `Continue ${steps[index + 1]?.title}`
                  : `Continue ${steps[index]?.title}`}
              </Button>
            </StepContent>
          </Step>
        ))}
      </StyledStepper>
    </Box>
  );
};
export default ScheduleStepper;
