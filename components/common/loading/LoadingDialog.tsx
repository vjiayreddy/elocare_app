import React from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { ThreeDots } from "react-loader-spinner";
import Typography from "@mui/material/Typography";
import { APP_COLORS } from "@/theme/colors/colors";

interface LoadingDialogComponentProps extends DialogProps {
  loadingMessage?: string;
}

const LoadingDialogComponent = ({
  loadingMessage,
  ...props
}: LoadingDialogComponentProps) => {
  return (
    <Dialog {...props}>
      <Card>
        <CardContent>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <ThreeDots
                height={40}
                width={40}
                radius="9"
                color={APP_COLORS.PRIMARY_COLOR}
                ariaLabel="loading"
                wrapperStyle={{}}
                visible={true}
              />
            </Grid>
            {loadingMessage && (
              <Grid item>
                <Typography textAlign="center" variant="caption">
                  {loadingMessage}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Dialog>
  );
};

export default LoadingDialogComponent;
