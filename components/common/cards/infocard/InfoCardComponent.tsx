import React from "react";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

interface InfoCardComponentProps {
  iconUrl?: string;
  title: string;
  subTitle?: string;
}

const InfoCardComponent = ({
  title,
  subTitle,
  iconUrl,
}: InfoCardComponentProps) => {
  return (
    <Card>
      <CardContent>
        <Box mt={3}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <Box mb={1}>
                <img
                  width={100}
                  alt="noItems"
                  src={iconUrl || "/icons/no_items.svg"}
                />
              </Box>
            </Grid>
            <Grid item>
              <Typography textAlign="center" variant="subtitle2">
                {title}
              </Typography>
              {subTitle && (
                <Typography textAlign="center" variant="body1">
                  {subTitle}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InfoCardComponent;
