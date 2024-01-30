import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { AiOutlineClose } from "react-icons/ai";
import { useVoiceVisualizer } from "react-voice-visualizer";
import { LiveAudioVisualizer } from "react-audio-visualize";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { AUTH_API_STATUS, S3_URL } from "@/utils/constants";
import { Session } from "next-auth";
import useGetAudioRecordinTime from "@/hooks/useGetAudioRecordinTime";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors/colors";
import { layoutModeEnum } from "@/ts/enum";
import {
  useGetSignedUploadUrlMutation,
  useSavePatientResponseMutation,
} from "@/redux/api/assessmentsApi";
import {
  audioMp3Converter,
  getAssessmentMediaUploadPayload,
  getFileExtension,
} from "@/redux/helpers/assessment";
import { calculatePercentage, getFileNameWithTimeStamp } from "@/utils/func";
import AudioRecordButtonCompoent from "@/components/common/buttons/audio-button/AudioButton";
import TitleAndSubtitle from "@/components/common/Headings/TitleAndSubtitle/TitleAndSubtitle";
import TabsComponent from "@/views/patient/assessments-list/common/tabs/Tabs";
import AvatarVideoComponent from "@/components/common/AvatarVideo/AvatarVideo";

const StyledDiaryCheckinLayout = styled(Container)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  paddingTop: 16,
  paddingBottom: 16,
  position: "relative",

  "& .__ai_avatar_player": {
    "& .__video_container": {
      height: 200,
      borderRadius: 100,
      width: 200,
      overflow: "hidden",
      position: "relative",
      "& video": {
        width: "100%",
        height: "100%",
        position: "absolute",
      },
      "& .__timer": {
        color: theme.palette.common.white,
        zIndex: 2,
        position: "absolute",
        left: "45%",
        bottom: "10px",
      },
      "& .__action__button": {
        zIndex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
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
      [theme.breakpoints.up("sm")]: {
        minHeight: 70,
        fontSize: 20,
      },
    },
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
    "& .icon": {
      height: 50,
      width: 50,
      [theme.breakpoints.up("sm")]: {
        height: 65,
        width: 65,
      },
    },
    "& .MuiTypography-body2": {
      [theme.breakpoints.up("sm")]: {
        fontSize: 20,
      },
    },
    "& .MuiButtonBase-root": {
      [theme.breakpoints.up("sm")]: {
        fontSize: 18,
        height: 55,
      },
    },
  },
}));

interface DiaryCheckinLayoutProps {
  children: React.ReactNode;
  onClickNextButton: () => void;
  onTriggerAfterSavedAudioAssessment?: (state: number) => void;
  disabledNextButton?: boolean;
  onClickBackButton: () => void;
  currentStep: number;
  showLoadingOnNextButton?: boolean;
  onClickCloseIcon: () => void;
  onClickAudioButton?: () => void;
  onClickBackToText: () => void;
  showAudioButton?: boolean;
  showInfoView?: boolean;
  infoContent?: string;
  totalSteps: number;
  layoutMode: layoutModeEnum;
  currentQuestion: any;
  isFinalStep?: boolean;
  dataLoadingIndicator?: boolean;
  tabMode: string;
  onTabChange: (val: string) => void;
}

const DiaryCheckinLayout = ({
  children,
  onClickBackButton,
  dataLoadingIndicator,
  showLoadingOnNextButton,
  onClickNextButton,
  disabledNextButton,
  currentStep,
  onClickCloseIcon,
  onClickAudioButton,
  showAudioButton,
  showInfoView,
  infoContent,
  totalSteps,
  currentQuestion,
  onClickBackToText,
  layoutMode = layoutModeEnum.TEXT_ANSWER,
  onTriggerAfterSavedAudioAssessment,
  isFinalStep,
  tabMode,
  onTabChange,
}: DiaryCheckinLayoutProps) => {
  const video = useRef<HTMLVideoElement>(null!);

  // state
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  // next-auth session
  const { data: session } = useSession();
  // voice visualizer
  const recorderControls = useVoiceVisualizer();
  const {
    recordedBlob,
    error,
    startRecording,
    recordingTime,
    stopRecording,
    togglePauseResume,
    mediaRecorder,
    isRecordingInProgress,
    isPausedRecording,
  } = recorderControls;

  // Redux
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const [savePatientResponse] = useSavePatientResponseMutation();

  // Speach to text
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  //SpeechRecognition
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  // uppy
  const uppy = new Uppy();

  // state
  const [loading, setIsLoading] = useState<boolean>(false);
  const [action, setAction] = useState<any>(null);

  // Hooks
  const { hourTimer, resetAudioTimer } = useGetAudioRecordinTime(
    recordingTime,
    null
  );

  // convert recording file to mp3
  const addAudioElement = async (blob: any) => {
    setIsLoading(true);
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

  // Trigger when press save button
  useEffect(() => {
    if (!recordedBlob) return;
    if (action === "UPLOAD") {
      addAudioElement(recordedBlob);
    }
  }, [recordedBlob, error]);

  // Trigger when error occur
  useEffect(() => {
    if (!error) return;
  }, [error]);

  // call back when page unmount
  useEffect(() => {
    return () => {
      stopRecording();
      SpeechRecognition.stopListening();
      resetTranscript();
    };
  }, []);

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
        setIsLoading(false);
        resetTranscript();
        onTriggerAfterSavedAudioAssessment?.(currentQuestion?.stage);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Uppy Events
  uppy.on("error", () => {
    setIsLoading(false);
    toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  });
  uppy.on("upload-success", (data) => {
    handleSubmitAssessment(data?.name as string);
  });

  // Video Events
  useEffect(() => {
    if (!video.current) {
      console.log("video.current");
      return;
    }

    const onWaiting = () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    };

    const onPlay = () => {
      if (isWaiting) {
        setIsWaiting(false);
      } else {
        setIsPlaying(true);
      }
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsWaiting(false);
    };

    const element = video.current;
    element.addEventListener("timeupdate", function () {
      setIsWaiting(false);
      setElapsedSec(element.currentTime);
    });

    element.addEventListener("waiting", onWaiting);
    element.addEventListener("play", onPlay);
    element.addEventListener("playing", onPlay);
    element.addEventListener("pause", onPause);

    // clean up
    return () => {
      element.removeEventListener("waiting", onWaiting);
      element.removeEventListener("play", onPlay);
      element.removeEventListener("playing", onPlay);
      element.removeEventListener("pause", onPause);
    };
  }, [video.current,currentStep]);

  // Handle Video Playback
  const handleVideoPlayback = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause();
      } else {
        video.current.play();
      }
    }
  };


  

  return (
    <StyledDiaryCheckinLayout disableGutters maxWidth="sm">
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
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            item
            xs={12}
          ></Grid>
          {layoutMode === layoutModeEnum.TEXT_ANSWER && (
            <Grid item xs={12}>
              <Box mt={1.5} mb={1}>
                <TabsComponent
                  tabValue={tabMode as string}
                  onChangeTab={(_, value) => {
                    onTabChange(value);
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {layoutMode === layoutModeEnum.TEXT_ANSWER && (
        <Fragment>
          {dataLoadingIndicator && (
            <Box
              component="div"
              className="__main_content"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <ThreeDots
                height="30"
                width="30"
                radius="9"
                color={APP_COLORS.PRIMARY_COLOR}
                ariaLabel="loading"
                wrapperStyle={{}}
                visible={true}
              />
            </Box>
          )}
          {!dataLoadingIndicator && currentQuestion && (
            <Fragment>
              {tabMode === layoutModeEnum.AVATAR_MODE && (
                <Fragment>
                  <Box component="div" className="__main_content">
                    <Box component="div" className="__ai_avatar_player">
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                          <AvatarVideoComponent
                            type="video/mp4"
                            videoRef={video}
                            timer={`${Math.floor(elapsedSec / 60)}:${Math.floor(
                              elapsedSec % 60
                            )}`}
                            isPlaying={isPlaying}
                            src={currentQuestion?.demoVideoUrl}
                            handlePlayPauseClick={handleVideoPlayback}
                          />
                        </Grid>
                        <Grid item>
                          <Typography textAlign="center" variant="subtitle2">
                            Watch the video question above.
                          </Typography>
                          <Typography textAlign="center">
                            After watching, tap below to record your response.
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  <Box component="div" className="__footer">
                    <AudioRecordButtonCompoent
                      onClick={() => {
                        if (!isPlaying) {
                          onClickAudioButton?.();
                        }
                      }}
                    />
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      spacing={2}
                    >
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={()=>{
                            resetTranscript();
                            onClickBackButton()
                          }}
                        >
                          Back
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fragment>
              )}
              {tabMode === layoutModeEnum.TEXT_MODE && (
                <Fragment>
                  <Box component="div" className="__main_content">
                    {children}
                  </Box>
                  <Box component="div" className="__footer">
                    {showAudioButton && (
                      <AudioRecordButtonCompoent onClick={onClickAudioButton} />
                    )}
                    {showInfoView && (
                      <Box component="div" className="__info_view">
                        {infoContent}
                      </Box>
                    )}
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={onClickBackButton}
                        >
                          Back
                        </Button>
                      </Grid>
                      <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                        <Button
                          disabled={disabledNextButton}
                          variant="contained"
                          color="primary"
                          onClick={onClickNextButton}
                        >
                          {showLoadingOnNextButton ? (
                            <ThreeDots
                              height="20"
                              width="20"
                              radius="9"
                              color={APP_COLORS.WHITE}
                              ariaLabel="loading"
                              wrapperStyle={{}}
                              visible={true}
                            />
                          ) : (
                            <span> Next</span>
                          )}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Fragment>
              )}
            </Fragment>
          )}
        </Fragment>
      )}
      {layoutMode === layoutModeEnum.AUDIO && (
        <Fragment>
          <Box component="div" className="__audio_visulazation">
            <Box mt={{ sx: 1, sm: 3 }}>
              <TitleAndSubtitle
                subTitle={
                  isRecordingInProgress
                    ? hourTimer
                    : "Tap the button below to start recording your audio response"
                }
                title={currentQuestion?.value}
              />
            </Box>

            <Box mt={2} mb={2} sx={{ margin: "o auto", width: "400px" }}>
              {mediaRecorder && (
                <LiveAudioVisualizer
                  mediaRecorder={mediaRecorder}
                  width={400}
                  height={30}
                />
              )}
            </Box>
          </Box>
          <Box component="div" className="__main_content">
            {browserSupportsSpeechRecognition && (
              <Fragment>
                {!transcript && <Typography>Live transcriptions...</Typography>}
                {transcript && <Typography>{transcript}</Typography>}
              </Fragment>
            )}
          </Box>
          <Box component="div" className="__footer">
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <Button
                  onClick={() => {
                    setAction(null);
                    stopRecording();
                    resetAudioTimer();
                    resetTranscript();
                  }}
                  variant="text"
                  color="inherit"
                >
                  Delete
                </Button>
              </Grid>
              <Grid item>
                {isRecordingInProgress && (
                  <Fragment>
                    {isPausedRecording && (
                      <IconButton
                        onClick={() => {
                          togglePauseResume();
                          SpeechRecognition.startListening({
                            continuous: true,
                          });
                        }}
                        size="small"
                      >
                        <img
                          className="icon"
                          alt="start-record"
                          src={"/icons/paused_record.svg"}
                        />
                      </IconButton>
                    )}
                    {!isPausedRecording && (
                      <IconButton
                        onClick={() => {
                          togglePauseResume();
                          SpeechRecognition.stopListening();
                        }}
                        size="small"
                      >
                        <img
                          className="icon"
                          alt="start-record"
                          src={"/icons/stop_audio.svg"}
                        />
                      </IconButton>
                    )}
                  </Fragment>
                )}
                {!isRecordingInProgress && (
                  <IconButton
                    onClick={() => {
                      startRecording();
                      startListening();
                    }}
                    size="small"
                  >
                    <img
                      className="icon"
                      alt="start-record"
                      src="/icons/audio_button.svg"
                    />
                  </IconButton>
                )}
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    if (isPausedRecording) {
                      setAction("UPLOAD");
                      stopRecording();
                    }
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            <Grid
              mt={2}
              mb={2}
              container
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="body2" textAlign="center">
                  {isRecordingInProgress && !isPausedRecording && "Stop"}
                  {!isRecordingInProgress && "Start Recording"}
                  {isRecordingInProgress && isPausedRecording && "Paused"}
                </Typography>
              </Grid>
            </Grid>
            <Grid mt={2} container alignItems="center" justifyContent="center">
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  onClick={() => {
                    setAction(null);
                    resetAudioTimer();
                    SpeechRecognition.stopListening();
                    resetTranscript();
                    stopRecording();
                    onClickBackToText();
                  }}
                >
                  Back to Text Answer
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      )}
      {loading && (
        <Dialog open={loading}>
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
    </StyledDiaryCheckinLayout>
  );
};

export default DiaryCheckinLayout;
