import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import { useSession } from "next-auth/react";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const ScheduleHeader = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Box pt={2} pb={2} component="div" className="__header">
      <Grid container alignItems="center">
        <Grid item>
          <Button
            onClick={() => {
              router.push(APP_ROUTES.CLINICIAL_HOME);
            }}
            startIcon={<ArrowBackIosIcon />}
            variant="text"
          >
            Back
          </Button>
        </Grid>
        <Grid item xs>
          <Typography textAlign="center" variant="subtitle1">
            {session?.user?.clinician?.user?.firstName}{" "}
            {session?.user?.clinician?.user?.lastName} Today’s Schedule
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleHeader;
