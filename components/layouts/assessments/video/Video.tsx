import { APP_COLORS } from "@/theme/colors/colors";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { calculatePercentage } from "@/utils/func";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
  styled,
} from "@mui/material";
import React, { Fragment } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface VideoAssessmentLayoutProps {
  children: React.ReactNode;
  dataLoadingIndicator?: boolean;
  onClickNextButton: () => void;
  onSavedSignature?: () => void;
  disabledNextButton?: boolean;
  onClickBackButton: () => void;
  currentStep: number;
  onClickCloseIcon: () => void;
  onClickAudioButton?: () => void;
  onClickBackToText: () => void;
  showAudioButton?: boolean;
  totalSteps: number;
  currentQuestion: any;
  isFinalStep?: boolean;
  showLoadingOnNextButton?: boolean;
}

const StyledVideoLayout = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 16,
  position: "relative",
  "& .__header": {
    [theme.breakpoints.up("sm")]: {
      width: 650,
      margin: "0 auto",
    },
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 24,
    paddingBottom: 24,
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__footer": {
    paddingTop: 24,
    "& .MuiButton-root": {
      height: 40,
      borderRadius: 5,
    },
    "& .Mui-disabled": {
      backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
      color: theme.palette.common.white,
    },
    "& .__info_view": {
      minHeight: 55,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 100,
      width: "100%",
      marginBottom: 20,
      textAlign: "left",
    },
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
}));

const VideoAssessmentLayout = ({
  children,
  currentStep,
  totalSteps,
  onClickCloseIcon,
  currentQuestion,
  dataLoadingIndicator,
}: VideoAssessmentLayoutProps) => {
  return (
    <StyledVideoLayout>
      <Box component="div" className="__header">
        <Grid container>
          <Grid item container xs={12}>
            <Grid item xs></Grid>
            <Grid item>
              <IconButton
                onClick={onClickCloseIcon}
                sx={{ padding: 0, marginBottom: "10px" }}
                size="medium"
              >
                <AiOutlineClose />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress
              variant="determinate"
              value={calculatePercentage(currentStep, totalSteps)}
            />
          </Grid>
        </Grid>
      </Box>

      {children}
      {!dataLoadingIndicator && currentQuestion && (
        <Fragment>
          {currentQuestion?.responseType?.includes(
            QUESTION_ANSWER_TYPE.INTRODUCTION
          ) && (
            <Fragment>
              <Box
                component="div"
                className="__main_content"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  container
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Box mb={8}>
                      <Typography
                        gutterBottom
                        textAlign="center"
                        variant="subtitle2"
                      >
                        {currentQuestion?.title}
                      </Typography>
                      <Typography variant="body2" textAlign="center">
                        {currentQuestion?.value}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Fragment>
          )}
        </Fragment>
      )}
    </StyledVideoLayout>
  );
};

export default VideoAssessmentLayout;
