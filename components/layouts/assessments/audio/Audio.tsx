import React, { Fragment, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { AiOutlineClose } from "react-icons/ai";
//import { audioMp3Converter, getFileNameWithTimeStamp } from "@/utils/actions";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
  S3_URL,
} from "@/utils/constants";
import Button from "@mui/material/Button";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { useVoiceVisualizer } from "react-voice-visualizer";
import useGetAudioRecordinTime from "@/hooks/useGetAudioRecordinTime";
import { useSession } from "next-auth/react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { toast } from "react-toastify";
import { Session } from "next-auth";
import { APP_COLORS } from "@/theme/colors/colors";
import { audioMp3Converter, getAssessmentMediaUploadPayload, getFileExtension } from "@/redux/helpers/assessment";
import { getFileNameWithTimeStamp } from "@/utils/func";
import { useGetSignedUploadUrlMutation, useSavePatientResponseMutation } from "@/redux/api/assessmentsApi";

interface AudioLayoutProps {
  children: React.ReactNode;
  onClickNextButton: () => void;
  onTriggerAfterSavedAudioAssessment?: (state: number) => void;
  onClickCloseIcon: () => void;
  onClickBackToText: () => void;
  currentQuestion: any;
  isFinalStep: boolean;
}

const StyledAudioLayout = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  padding: 16,
  position: "relative",
  "& .__header": {
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__audio_visulazation": {
    marginTop: 20,
    [theme.breakpoints.up("sm")]: {
      width: 500,
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

const AudioLayout = ({
  onClickCloseIcon,
  currentQuestion,
  onClickNextButton,
  children,
  onTriggerAfterSavedAudioAssessment,
  isFinalStep,
}: AudioLayoutProps) => {
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    error,
    startRecording,
    recordingTime,
    stopRecording,
    togglePauseResume,
    isRecordingInProgress,
    isPausedRecording,
  } = recorderControls;

  // Session
  const { data: session } = useSession();
  // State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isResetAudio, setIsResetAudio] = useState<boolean>(false);
  const [action, setAction] = useState<any>(null);
  // Uppy
  const uppy = new Uppy();

  // Redux
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const [savePatientResponse] = useSavePatientResponseMutation();

  // Conver Mp3 Audio
  const addAudioElement = async (blob: any) => {
    setIsUploading(true);
    const fileExtension = getFileExtension(blob, "audio/");
    const fileName = getFileNameWithTimeStamp("AUDIO");
    const audioMp3ConverterResponse: any = await audioMp3Converter(
      blob,
      fileName,
      fileExtension,
      "mp3"
    );
    handleUploadAudioFile(audioMp3ConverterResponse);
  };

  // Reording Time Hook
  const { minuteSecTimer, timerStop, resetAudioTimer } =
    useGetAudioRecordinTime(recordingTime, 30);

  // Effect Functions
  useEffect(() => {
    if (!recordedBlob) return;
    if (!isResetAudio) {
      if (action === "UPLOAD") {
        addAudioElement(recordedBlob);
      }
    }
  }, [recordedBlob, error]);

  useEffect(() => {
    return () => {
      resetAudioTimer();
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (timerStop) {
      togglePauseResume();
    }
  }, [timerStop]);

  // Handle Close
  const handleClose = () => {
    setAction(null);
    stopRecording();
    resetAudioTimer();
    onClickCloseIcon();
  };

  // Upload Audio file
  const handleUploadAudioFile = async (fileInfo: any) => {
    try {
      const signedUrlResponse = (await getSignedUploadUrl({
        fileName: fileInfo?.name,
        contentType: fileInfo?.type,
        userId: session?.user?.id as string,
      })) as any;
      const { url } = signedUrlResponse?.data?.data;
      uppy.addFile({
        name: fileInfo?.name,
        type: fileInfo?.type,
        data: fileInfo?.data || fileInfo,
      });
      uppy.use(XHRUpload, {
        endpoint: url,
        method: "PUT",
        headers: {
          "Content-Type": fileInfo?.type,
        },
      });
      uppy.upload();
    } catch (error) {
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Submit Assessment
  const handleSubmitAssessment = async (fileName: string) => {
    try {
      const payload = getAssessmentMediaUploadPayload(
        "AUDIO",
        currentQuestion,
        session as Session
      );
      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${session?.user?.id}/${fileName}`,
        isLastQuestion: isFinalStep,
      })) as any;
      if (response?.data?.status === "success") {
        setIsUploading(false);
        onTriggerAfterSavedAudioAssessment?.(currentQuestion?.stage);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Uppy Events
  uppy.on("error", () => {
    setIsUploading(false);
    toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  });
  uppy.on("upload-success", (data) => {
    handleSubmitAssessment(data?.name as string);
  });

  return (
    <StyledAudioLayout>
      <Box component="div" className="__header">
        {currentQuestion?.responseType?.includes(
          QUESTION_ANSWER_TYPE.AUDIO
        ) && (
          <Grid container>
            <Grid item container xs={12}>
              <Grid item xs></Grid>
              <Grid item>
                <IconButton
                  onClick={handleClose}
                  sx={{ padding: 0, marginBottom: "10px" }}
                  size="medium"
                >
                  <AiOutlineClose />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
      {currentQuestion?.questionType?.includes(
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
                    Voice Base-line
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    For this assessment we ask you to provide a 30-second audio
                    recording. Specifically, we’d like you to read a paragraph
                    aloud. The paragraph we'll use is known as the Rainbow
                    Passage.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box component="div" className="__footer">
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleClose}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickNextButton}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}
      {currentQuestion?.responseType?.includes(QUESTION_ANSWER_TYPE.AUDIO) && (
        <Fragment>
          <Box component="div" className="__main_content">
            <Grid
              container
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {children}
            </Grid>
          </Box>
          <Box component="div" className="__footer">
            <Grid container alignItems="center">
              <Grid item xs={4}>
                {isPausedRecording && (
                  <Button
                    onClick={() => {
                      setAction(null);
                      setIsResetAudio(true);
                      stopRecording();
                      resetAudioTimer();
                    }}
                    color="inherit"
                    variant="text"
                  >
                    Restart
                  </Button>
                )}
              </Grid>
              <Grid item xs={4} container justifyContent="center">
                {timerStop ? (
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setAction("UPLOAD");
                        setIsResetAudio(false);
                        resetAudioTimer();
                        stopRecording();
                      }}
                      size="small"
                    >
                      <img
                        width={50}
                        height={50}
                        alt="save-record"
                        src={"/assets/images/save_audio.svg"}
                      />
                    </IconButton>
                  </Grid>
                ) : (
                  <Grid item>
                    {isRecordingInProgress && (
                      <Fragment>
                        {isPausedRecording && (
                          <IconButton
                            onClick={() => {
                              togglePauseResume();
                            }}
                            size="small"
                          >
                            <img
                              width={50}
                              height={50}
                              alt="start-record"
                              src={"/assets/images/paused_record.svg"}
                            />
                          </IconButton>
                        )}
                        {!isPausedRecording && (
                          <IconButton
                            onClick={() => {
                              togglePauseResume();
                            }}
                            size="small"
                          >
                            <img
                              width={50}
                              height={50}
                              alt="start-record"
                              src={"/assets/images/stop_audio.svg"}
                            />
                          </IconButton>
                        )}
                      </Fragment>
                    )}
                    {!isRecordingInProgress && (
                      <IconButton
                        onClick={() => {
                          startRecording();
                        }}
                        size="small"
                      >
                        <img
                          width={50}
                          height={50}
                          alt="start-record"
                          src="/assets/images/audio_button.svg"
                        />
                      </IconButton>
                    )}
                  </Grid>
                )}
              </Grid>
              <Grid item xs={4}>
                <Box mb={1}>
                  {!timerStop && (
                    <Typography textAlign="center" variant="body2">
                      {recordingTime ? minuteSecTimer : "00:30 sec"}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box mt={1}>
                  {timerStop ? (
                    <Typography textAlign="center" variant="body2">
                      Save
                    </Typography>
                  ) : (
                    <Typography textAlign="center" variant="body2">
                      {isRecordingInProgress && !isPausedRecording && "Stop"}
                      {!isRecordingInProgress && "Start Recording"}
                      {isRecordingInProgress && isPausedRecording && "Paused"}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}
      {isUploading && (
        <Dialog open={isUploading}>
          <DialogContent>
            <Grid
              container
              justifyContent="center"
              flexDirection="column"
              spacing={2}
            >
              <Grid item>
                <CircularProgress />
              </Grid>
              <Grid item>
                <Typography textAlign="center">Saving</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </StyledAudioLayout>
  );
};

export default AudioLayout;
