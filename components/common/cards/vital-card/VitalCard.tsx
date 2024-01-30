import { Box, Button, Typography, styled } from "@mui/material";
import React, { Fragment } from "react";
import Grid from "@mui/material/Grid";
import _ from "lodash";
import moment from "moment";

const StyledVitalCard = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  flexDirection: "column",
  "& .MuiButtonBase-root": {
    width: 80,
  },
  "& sub": {
    verticalAlign: "super",
    fontSize: "14px !important",
  },
}));

interface VitalCardProps {
  title: string;
  vitalData?: any;
  iconUrl: string;
  subString?: string;
  onPressEnter: () => void;
}

const VitalCard = ({
  title,
  iconUrl,
  vitalData,
  onPressEnter,
}: VitalCardProps) => {
  console.log(vitalData);

  return (
    <StyledVitalCard>
      <Box p={1}>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <img width={100} alt={title} src={iconUrl} />
          </Grid>
          <Grid
            item
            xs={6}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowSpacing={1}
          >
            {_.isEmpty(vitalData) && (
              <Grid item>
                <img alt={title} src="/vitals/no-data.svg" />
              </Grid>
            )}
            {!_.isEmpty(vitalData) && (
              <Fragment>
                <Grid item>
                  {title === "blood_preasure" ? (
                    <Fragment>
                      <Typography
                        textAlign="center"
                        sx={{ fontWeight: 600 }}
                        variant="h4"
                      >
                        {vitalData?.systolicPressure?.value}
                        <sub>{vitalData?.systolicPressure?.unit}</sub>
                      </Typography>
                      <Typography
                        textAlign="center"
                        sx={{ fontWeight: 600 }}
                        variant="h4"
                      >
                        {vitalData?.diastolicPressure?.value}
                      </Typography>
                    </Fragment>
                  ) : (
                    <Typography
                      textAlign="center"
                      sx={{ fontWeight: 600 }}
                      variant="h4"
                    >
                      {vitalData?.value} <sub>{vitalData?.unit}</sub>
                    </Typography>
                  )}
                </Grid>
                {title === "blood_preasure"}
                <Grid item>
                  <Typography
                    textAlign="left"
                    sx={{ fontWeight: 500, fontSize: 14 }}
                    variant="body1"
                  >
                    {moment(
                      new Date(vitalData?.recordedDate?.mongoTimestamp)
                    ).format("MMM Do YYYY")}
                  </Typography>
                  <Typography
                    textAlign="left"
                    sx={{ fontWeight: 500, fontSize: 14 }}
                    variant="body1"
                  >
                    {moment(
                      new Date(vitalData?.recordedDate?.mongoTimestamp)
                    ).format("h:mm  a")}
                  </Typography>
                </Grid>
              </Fragment>
            )}
            <Grid item>
              <Button onClick={onPressEnter} size="small">
                Enter
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </StyledVitalCard>
  );
};

export default VitalCard;
