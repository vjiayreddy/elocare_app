import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box, Typography } from "@mui/material";

const StyledUpToDateCard = styled(Card)(({ theme }) => ({
  "& .MuiTypography-body2": {
    color: theme.palette.grey[600],
  },
}));

const AssessmentNotification = () => {
  return (
    <StyledUpToDateCard>
      <CardContent>
        <CardMedia
          component="img"
          height="140"
          image="/images/uptodate.svg"
          alt="update-date"
        />
        <Box mt={1}>
          <Typography variant="subtitle2">You're up to date!</Typography>{" "}
          <Typography variant="body2">
            Your next assessment will be available Monday, 7:00 AM
          </Typography>
        </Box>
      </CardContent>
    </StyledUpToDateCard>
  );
};

export default AssessmentNotification
