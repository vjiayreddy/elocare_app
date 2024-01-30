import React from "react";
import Card from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { calculatePercentage } from "@/utils/func";

interface AssessmentCounterCardProps {
  title?: string;
  active: number;
  total: number;
  isLoadingAssessments: boolean;
}

const StyledAssessmentCounterCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "& .MuiTypography-body1": {
    [theme.breakpoints.up("sm")]: {
      textAlign: "center",
      fontSize: 20,
      fontWeight: 500,
    },
  },
}));

const AssessmentCounterCard = ({
  active,
  total,
  isLoadingAssessments,
}: AssessmentCounterCardProps) => {
  return (
    <StyledAssessmentCounterCard elevation={0}>
      <CardContent>
        <Grid
          container
          direction="column"
          spacing={3}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item>
            <Typography variant="body1">
              Complete {active} Diary Check-in assessments this week
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress
                variant={isLoadingAssessments ? "indeterminate" : "determinate"}
                value={calculatePercentage(active, total)}
                size={100}
                thickness={5}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" component="div">
                  <span style={{ fontSize: 30 }}>
                    <b>{active}</b>
                  </span>
                  /{total}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </StyledAssessmentCounterCard>
  );
};

export default AssessmentCounterCard;
