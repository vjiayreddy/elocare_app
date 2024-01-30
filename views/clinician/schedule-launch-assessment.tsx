import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SxProps, styled } from "@mui/material/styles";
import React, { Fragment } from "react";

interface ScheduleLaunchAssessmentProps {
  element?: React.ReactNode;
  onClick?: () => void;
  sxProps?: SxProps;
}

const ScheduleLaunchAssessment = ({
  element,
  onClick,
  sxProps,
}: ScheduleLaunchAssessmentProps) => {
  return (
    <Fragment>
      <Box
        sx={sxProps}
        component="div"
        className="__lanuch_assessement"
        onClick={onClick}
      >
        <Box>
          <img alt="task_icon" src="/icons/task.svg" />
        </Box>
        {element}
      </Box>
    </Fragment>
  );
};

export default ScheduleLaunchAssessment;
