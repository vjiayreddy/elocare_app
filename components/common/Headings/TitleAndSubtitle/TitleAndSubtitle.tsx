import React from "react";
import Grid from "@mui/material/Grid";
import { Box, Typography, styled } from "@mui/material";

interface TitleAndSubtitleProps {
  title: string;
  subTitle: string;
}

const StyledTitleAndSubtitles = styled(Box)(({ theme }) => ({
  "& .MuiTypography-subtitle2": {
    [theme.breakpoints.only("xs")]: {
      fontSize: 20,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 28,
    },
  },
  "& .MuiTypography-body2": {
    [theme.breakpoints.only("xs")]: {
      fontSize: 16,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 20,
    },
  },
}));

const TitleAndSubtitle = ({ title, subTitle }: TitleAndSubtitleProps) => {
  return (
    <StyledTitleAndSubtitles>
      <Grid container direction="column">
        <Grid item xs={12}>
          <Typography gutterBottom textAlign="center" variant="subtitle2">
            {title}
          </Typography>
          <Typography textAlign="center" variant="body2">
            {subTitle}
          </Typography>
        </Grid>
      </Grid>
    </StyledTitleAndSubtitles>
  );
};

export default TitleAndSubtitle;
