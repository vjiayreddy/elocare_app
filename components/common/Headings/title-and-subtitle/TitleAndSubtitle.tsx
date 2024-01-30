import React from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

interface TitleAndSubtitleProps {
  title: string;
  subTitle: string;
}

const TitleAndSubtitle = ({ title, subTitle }: TitleAndSubtitleProps) => {
  return (
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
  );
};

export default TitleAndSubtitle;
