import { calculatePercentage } from "@/utils/func";
import { Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";

interface ScheduleProgressProps {
  currentValue: number;
  totalSteps: number;
}

const ScheduleProgress = ({totalSteps,currentValue}:ScheduleProgressProps) => {
  return (
    <Box component="div" className="__timeLine__header">
      <Grid container>
        <Grid item xs={12}>
          <Typography>Completed assessments</Typography>
        </Grid>
      </Grid>
      <Box display="flex" alignItems="center">
        <Box mr={2} flexGrow={1}>
          <LinearProgress variant="determinate" value={calculatePercentage(currentValue,totalSteps)} />
        </Box>
        <Box>
          <Typography> {calculatePercentage(currentValue,totalSteps)}%</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleProgress;
