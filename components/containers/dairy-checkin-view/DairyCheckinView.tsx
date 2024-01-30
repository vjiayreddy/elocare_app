import React, { Fragment, useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { StyledDairyCheckinView } from "./styled";
import Box from "@mui/material/Box";
import {
  calculatePercentage,
  getEmojiSentiments,
  getFileNameWithTimeStamp,
} from "@/utils/func";
import {
  Button,
  CircularProgress,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { ThreeDots } from "react-loader-spinner";
import { APP_COLORS } from "@/theme/colors/colors";
import { useSession } from "next-auth/react";
import {
  useGetSignedUploadUrlMutation,
  useLazyFetchOnboardingQuestionsQuery,
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/assessmentsApi";
import _ from "lodash";
import TabsComponent from "@/views/patient/assessments-list/common/tabs/Tabs";
import { layoutModeEnum } from "@/ts/enum";
import AvatarVideoComponent from "@/components/common/AvatarVideo/AvatarVideo";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
  S3_URL,
} from "@/utils/constants";
import TextInputFieldComponent from "@/components/common/form-fields/textInputField";
import SentimentsSelectionField from "@/components/common/form-fields/SentimentsSelectionField";
import EmojiInputFieldComponent from "@/components/common/form-fields/EmojiInputField";
import { useForm } from "react-hook-form";
import RadioGroupSelectionComponent from "@/components/common/form-fields/RadioGropSelection";
import TitleAndSubtitle from "@/components/common/Headings/TitleAndSubtitle/TitleAndSubtitle";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import {
  audioMp3Converter,
  getAssessmentMediaUploadPayload,
  getDiaryCheckinAssemmentPayload,
  getFileExtension,
  getOnboardingDataByStep,
} from "@/redux/helpers/assessment";
import { Session } from "next-auth";
import { toast } from "react-toastify";
import AudioRecordButtonCompoent from "@/components/common/buttons/audio-button/AudioButton";
import { useVoiceVisualizer } from "react-voice-visualizer";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useGetAudioRecordinTime from "@/hooks/useGetAudioRecordinTime";
import { LiveAudioVisualizer } from "react-audio-visualize";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import InfoContentVersionOneComponent from "@/components/common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";

interface DairyCheckinViewProps {
  open: boolean;
  onClose: () => void;
}

const DairyCheckinView = ({open,onClose}:DairyCheckinViewProps) => {
  // Redux
  const dispatch = useDispatch();
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const uppy = new Uppy();

  // Audio record

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

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  //SpeechRecognition
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const { hourTimer, resetAudioTimer } = useGetAudioRecordinTime(
    recordingTime,
    null
  );

  // State
  const [loading, setIsLoading] = useState<boolean>(false);
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const [sentimentDescription, setSentimentDescription] = useState<
    string | any
  >(null);
  const [sentiment, setSentiment] = useState<string>("");
  const [tabMode, setTabMode] = useState(layoutModeEnum.AVATAR_MODE);
  const [layoutMode, setLayOutMode] = useState(layoutModeEnum.TEXT_ANSWER);
  const [action, setAction] = useState<any>(null);
  const video = useRef<HTMLVideoElement>(null!);
  const { control, handleSubmit, formState, reset, getValues } = useForm({
    mode: "all",
  });

  // state
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const { data: session, update } = useSession();
  const [activeStep, setActiveStep] = useState(1);

  // Redux
  const [
    fetchOnboardingQuestions,
    {
      isLoading: isLoadingOnboardingQuestions,
      isFetching: isFetchingOnboardingQuestions,
      data: assessments,
      isSuccess: isSuccessOnboardingQuestions,
      // isError: isErrorOnboardingQuestions,
    },
  ] = useLazyFetchOnboardingQuestionsQuery({});
  const [
    fetchPatientResponse,
    {
      isSuccess: isSuccessPatientResponse,
      isLoading: isLoadingPatientResponse,
      data: dataPatientResponse,
    },
  ] = useLazyFetchPatientResponseQuery();

  const [savePatientResponse, { isLoading: isLoadingSavedPatientResponse }] =
    useSavePatientResponseMutation();

  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );

  // Fetch Onboarding Questions
  useEffect(() => {
    if (session?.user?.studyId) {
      fetchOnboardingQuestions({
        studyId: session?.user?.studyId,
      });
    }
  }, [session]);

  // Reset Form Data
  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  // Video Events
  useEffect(() => {
    if (!video.current) {
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
  }, [video.current]);

  // Handle Video Playback
  const handleVideoPlayback = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause();
      } else {
        setIsPlaying(true);
        video.current.play();
      }
    }
  };

  useEffect(() => {
    if (assessments?.totalSteps < Number(activeStep)) {
      setIsFinalStep(true);
    } else {
      if (assessments?.length <= 0) {
        setIsFinalStep(true);
      } else {
        dispatch(
          setCurrentAssessmentQuestion(
            getOnboardingDataByStep(
              assessments?.onboardingQuestionsData,
              activeStep
            )
          )
        );
      }
    }
  }, [activeStep, assessments]);

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

  useEffect(() => {
    if (isSuccessOnboardingQuestions) {
      fetchPatientResponse({
        patientId: session?.user?.id,
        studyId: session?.user?.studyId,
        studyRecordId: session?.user?.studyRecordId,
      });
    }
  }, [isLoadingOnboardingQuestions]);

  useEffect(() => {
    if (isSuccessPatientResponse) {
      reset(dataPatientResponse?.formInputValues);
      setSentiment(dataPatientResponse?.selectedSentimentDes?.optionValue);
      setSentimentDescription(
        dataPatientResponse?.selectedSentimentDes?.description
      );
    }
  }, [isLoadingPatientResponse]);

  const onSubmit = async (data: any) => {
    try {
      const finalPayload = getDiaryCheckinAssemmentPayload(
        currentQuestion,
        data,
        session as Session,
        assessments?.emojiData
      );

      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        finalPayload.payload.isLastQuestion = true;
      }

      const response = (await savePatientResponse({
        ...finalPayload?.payload,
      })) as any;

      if (response?.data?.data) {
        if (
          Number(activeStep) === assessments?.onboardingQuestionsData.length
        ) {
          setIsFinalStep(true);
        } else {
          if (finalPayload?.payload?.questionStage === 4) {
            if (finalPayload?.payload?.options?.[0]?.optionValue === "No") {
              setIsFinalStep(true);
            } else {
              setActiveStep(activeStep + 1);
            }
          } else {
            setActiveStep(activeStep + 1);
          }
        }
      }
    } catch (error) {
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  const handleShuffleNavigation = () => {
    setIsLoading(false);
    setLayOutMode(layoutModeEnum.TEXT_ANSWER);
    if (currentQuestion?.state === 1 && tabMode === layoutModeEnum.TEXT_MODE) {
      setActiveStep(activeStep + 3);
    } else {
      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        setIsFinalStep(true);
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const handleSubmitAudioAssessment = async (fileName: string) => {
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
        handleShuffleNavigation();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  // Trigger when press save button
  useEffect(() => {
    if (!recordedBlob) return;
    if (action === "UPLOAD") {
      addAudioElement(recordedBlob);
    }
  }, [recordedBlob, error]);

  // Uppy Events
  uppy.on("error", () => {
    setIsLoading(false);
    toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  });
  uppy.on("upload-success", (data) => {
    handleSubmitAudioAssessment(data?.name as string);
  });

  return (
    <Dialog fullScreen={true} open={open}>
      <StyledDairyCheckinView>
        {isSuccessOnboardingQuestions &&
          !_.isEmpty(assessments?.onboardingQuestionsData) && (
            <Fragment>
              <Box p={2} component="div" className="__header">
                <Grid container>
                  <Grid item container xs={12}>
                    <Grid item xs></Grid>
                    <Grid item>
                      <IconButton
                        onClick={onClose}
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
                      value={calculatePercentage(
                        activeStep,
                        assessments?.totalSteps
                      )}
                    />
                  </Grid>
                  {layoutMode === layoutModeEnum.TEXT_ANSWER && (
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="center"
                      item
                      xs={12}
                    >
                      <Box mt={1.5} mb={1}>
                        <TabsComponent
                          tabValue={tabMode}
                          onChangeTab={(_, value) => {
                            video?.current?.pause();
                            setIsPlaying(false);
                            setTabMode(value);
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
              <Box p={2} component="div" className="__main_content">
                {assessments?.onboardingQuestionsData?.length > 0 && (
                  <Fragment>
                    {assessments?.onboardingQuestionsData.map(
                      (question: any, index: number) => {
                        return (
                          <Fragment key={question?._id}>
                            {Number(activeStep) - 1 === index && (
                              <Fragment>
                                {layoutMode === layoutModeEnum.TEXT_ANSWER && (
                                  <Fragment>
                                    {tabMode === layoutModeEnum.AVATAR_MODE && (
                                      <Box
                                        component="div"
                                        className="__ai_avatar_player"
                                      >
                                        <Grid
                                          container
                                          spacing={2}
                                          justifyContent="center"
                                        >
                                          <Grid item>
                                            <AvatarVideoComponent
                                              type="video/mp4"
                                              videoRef={video}
                                              timer={`${Math.floor(
                                                elapsedSec / 60
                                              )}:${Math.floor(
                                                elapsedSec % 60
                                              )}`}
                                              isPlaying={isPlaying}
                                              src={
                                                assessments
                                                  ?.onboardingQuestionsData[
                                                  activeStep - 1
                                                ].demoVideoUrl
                                              }
                                              handlePlayPauseClick={
                                                handleVideoPlayback
                                              }
                                            />
                                          </Grid>
                                          <Grid item>
                                            <Typography
                                              textAlign="center"
                                              variant="subtitle2"
                                            >
                                              Watch the video question above.
                                            </Typography>
                                            <Typography textAlign="center">
                                              After watching, tap below to
                                              record your response.
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    )}
                                    {tabMode === layoutModeEnum.TEXT_MODE && (
                                      <Fragment>
                                        <Box pl={1} pr={1} mb={2}>
                                          <TitleAndSubtitle
                                            subTitle={question?.hint}
                                            title={
                                              question?.stage === 3
                                                ? `${question?.value} ${sentiment}?`
                                                : question?.value
                                            }
                                          />
                                        </Box>
                                        {question?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.EMOJI_RATING
                                        ) && (
                                          <Box
                                            sx={{
                                              margin: `0 auto`,
                                              width: 300,
                                            }}
                                          >
                                            <EmojiInputFieldComponent
                                              defaultValues={null}
                                              id={question?._id}
                                              name={
                                                question?.stage == 2
                                                  ? question?.stage_1_qus_id +
                                                    QUESTION_ANSWER_TYPE.EMOJI_RATING
                                                  : question?._id +
                                                    QUESTION_ANSWER_TYPE.EMOJI_RATING
                                              }
                                              control={control}
                                              disabled={question?.stage === 2}
                                              rules={{
                                                required: true,
                                              }}
                                              labelName="optionValue"
                                              targetValue="_id"
                                              options={question?.options}
                                            />
                                          </Box>
                                        )}

                                        {question?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
                                        ) && (
                                          <Fragment>
                                            <Box
                                              sx={{
                                                margin: `0 auto`,
                                                width: 300,
                                              }}
                                            >
                                              <EmojiInputFieldComponent
                                                defaultValues={null}
                                                id={question?._id}
                                                name={
                                                  question?.stage_1_qus_id +
                                                  QUESTION_ANSWER_TYPE.EMOJI_RATING
                                                }
                                                control={control}
                                                disabled={true}
                                                rules={{
                                                  required: true,
                                                }}
                                                labelName="optionValue"
                                                targetValue="_id"
                                                options={question?.options}
                                              />
                                            </Box>

                                            <Box
                                              sx={(theme) => ({
                                                margin: `0 auto`,
                                                width: theme.breakpoints.up(
                                                  "sm"
                                                )
                                                  ? 500
                                                  : 300,
                                              })}
                                            >
                                              <Box mt={2}>
                                                <SentimentsSelectionField
                                                  control={control}
                                                  id={question?._id}
                                                  name={
                                                    question?._id +
                                                    QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
                                                  }
                                                  targetValue="_id"
                                                  defaultValues={null}
                                                  rules={{
                                                    required: true,
                                                  }}
                                                  labelName="sentimentValue"
                                                  options={getEmojiSentiments(
                                                    getValues(
                                                      question?.stage_1_qus_id +
                                                        QUESTION_ANSWER_TYPE.EMOJI_RATING
                                                    ),
                                                    question?.options,
                                                    assessments?.emojiData
                                                  )}
                                                  onChange={(
                                                    _,
                                                    {
                                                      description,
                                                      sentimentLabel,
                                                    }
                                                  ) => {
                                                    setSentiment(
                                                      sentimentLabel
                                                    );
                                                    setSentimentDescription(
                                                      description
                                                    );
                                                  }}
                                                />
                                              </Box>
                                            </Box>
                                          </Fragment>
                                        )}

                                        {question?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.BOOLEAN
                                        ) && (
                                          <Box mt={4}>
                                            <RadioGroupSelectionComponent
                                              control={control}
                                              id={question?._id}
                                              name={
                                                question?._id +
                                                QUESTION_ANSWER_TYPE.BOOLEAN
                                              }
                                              radioGroupProps={{
                                                row: false,
                                              }}
                                              targetValue="_id"
                                              varientBtnProps={{
                                                size: "large",
                                                sx: {
                                                  width: 200,
                                                },
                                              }}
                                              gridProps={{
                                                direction: "column",
                                                spacing: 2,
                                              }}
                                              varient="BUTTON"
                                              defaultValues={null}
                                              rules={{
                                                required: true,
                                              }}
                                              labelName="optionValue"
                                              options={question?.options}
                                            />
                                          </Box>
                                        )}

                                        {question?.responseType?.includes(
                                          QUESTION_ANSWER_TYPE.TEXT
                                        ) && (
                                          <TextInputFieldComponent
                                            id={question?._id}
                                            name={
                                              question?._id +
                                              QUESTION_ANSWER_TYPE.TEXT
                                            }
                                            label=""
                                            defaultValue={""}
                                            control={control}
                                            rules={{
                                              required: true,
                                            }}
                                            textFieldProps={{
                                              fullWidth: true,
                                              multiline: true,
                                              rows: 8,
                                            }}
                                          />
                                        )}
                                      </Fragment>
                                    )}
                                  </Fragment>
                                )}

                                {layoutMode === layoutModeEnum.AUDIO && (
                                  <Fragment>
                                    <Box
                                      component="div"
                                      className="__ai_avatar_player"
                                    >
                                      <Grid
                                        container
                                        spacing={2}
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <Grid item>
                                          <AvatarVideoComponent
                                            type="video/mp4"
                                            videoRef={video}
                                            timer={`${Math.floor(
                                              elapsedSec / 60
                                            )}:${Math.floor(elapsedSec % 60)}`}
                                            isPlaying={isPlaying}
                                            src={
                                              assessments
                                                ?.onboardingQuestionsData[
                                                activeStep - 1
                                              ].demoVideoUrl
                                            }
                                            handlePlayPauseClick={
                                              handleVideoPlayback
                                            }
                                          />
                                        </Grid>
                                        <Grid item xs={12}>
                                          {isRecordingInProgress ? (
                                            <Typography
                                              color={"red"}
                                              textAlign="center"
                                            >
                                              {hourTimer} sec
                                            </Typography>
                                          ) : (
                                            <Typography
                                              color={"GrayText"}
                                              textAlign="center"
                                            >
                                              00:00:00
                                            </Typography>
                                          )}
                                        </Grid>
                                        <Grid item>
                                          <Box
                                            component="div"
                                            className="__audio_visulazation"
                                            mt={2}
                                            mb={2}
                                            sx={{
                                              margin: "o auto",
                                              width: "400px",
                                            }}
                                          >
                                            {mediaRecorder ? (
                                              <LiveAudioVisualizer
                                                mediaRecorder={mediaRecorder}
                                                width={480}
                                                height={30}
                                              />
                                            ) : (
                                              <img
                                                alt="sound-wave"
                                                src="/images/sound_wave.svg"
                                              />
                                            )}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12}>
                                          {browserSupportsSpeechRecognition && (
                                            <Fragment>
                                              {!transcript && (
                                                <Typography>
                                                  Live transcriptions...
                                                </Typography>
                                              )}
                                              {transcript && (
                                                <Typography>
                                                  {transcript}
                                                </Typography>
                                              )}
                                            </Fragment>
                                          )}
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </Fragment>
                                )}
                              </Fragment>
                            )}
                          </Fragment>
                        );
                      }
                    )}
                  </Fragment>
                )}
              </Box>
              <Box p={2} component="div" className="__footer">
                <Grid container alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    {layoutMode === layoutModeEnum.TEXT_ANSWER && (
                      <Fragment>
                        {currentQuestion?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.AUDIO
                        ) && (
                          <AudioRecordButtonCompoent
                            onClick={() => {
                              if (!isPlaying) {
                                setLayOutMode(layoutModeEnum.AUDIO);
                              }
                            }}
                          />
                        )}
                      </Fragment>
                    )}
                  </Grid>

                  {layoutMode === layoutModeEnum?.TEXT_ANSWER && (
                    <Fragment>
                      {tabMode === layoutModeEnum.AVATAR_MODE && (
                        <Grid item xs={12}>
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => {
                              if (activeStep == 1) {
                                return;
                              }
                              setActiveStep(activeStep - 1);
                            }}
                          >
                            Back
                          </Button>
                        </Grid>
                      )}
                      {tabMode == layoutModeEnum.TEXT_MODE && (
                        <Fragment>
                          {currentQuestion?.state === 2 &&
                            sentimentDescription && (
                              <Box component="div" className="__info_view">
                                {sentimentDescription}
                              </Box>
                            )}
                          <Grid
                            item
                            xs={12}
                            spacing={2}
                            container
                            alignItems="center"
                          >
                            <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                              <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => {
                                  if (activeStep == 1) {
                                    return;
                                  } else {
                                    setActiveStep(activeStep - 1);
                                  }
                                }}
                              >
                                Back
                              </Button>
                            </Grid>
                            <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                              <Button
                                disabled={false}
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit(onSubmit)}
                              >
                                {isLoadingSavedPatientResponse && (
                                  <ThreeDots
                                    height="20"
                                    width="20"
                                    radius="9"
                                    color={APP_COLORS.WHITE}
                                    ariaLabel="loading"
                                    wrapperStyle={{}}
                                    visible={true}
                                  />
                                )}
                                {!isLoadingSavedPatientResponse && (
                                  <span> Next</span>
                                )}
                              </Button>
                            </Grid>
                          </Grid>
                        </Fragment>
                      )}
                    </Fragment>
                  )}
                  {layoutMode === layoutModeEnum?.AUDIO && (
                    <Fragment>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
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
                            {isRecordingInProgress &&
                              !isPausedRecording &&
                              "Stop"}
                            {!isRecordingInProgress && "Start Recording"}
                            {isRecordingInProgress &&
                              isPausedRecording &&
                              "Paused"}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid
                        mt={2}
                        container
                        alignItems="center"
                        justifyContent="center"
                      >
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
                              setLayOutMode(layoutModeEnum.TEXT_ANSWER);
                            }}
                          >
                            Back
                          </Button>
                        </Grid>
                      </Grid>
                    </Fragment>
                  )}
                </Grid>
              </Box>
            </Fragment>
          )}

        {isLoadingOnboardingQuestions && isFetchingOnboardingQuestions && (
          <Box component="div" className="__loading_indication">
            <ThreeDots
              height="20"
              width="20"
              radius="9"
              color={APP_COLORS.WHITE}
              ariaLabel="loading"
              wrapperStyle={{}}
              visible={true}
            />
          </Box>
        )}
        {isFinalStep && (
          <Box component="div" className="__loading_indication">
            <InfoContentVersionOneComponent
              title="Thank you!"
              subTitle="Congratulations, you’ve completed this assessment."
              btnProps={{
                size: "large",
                onClick: () => {
                  update({
                    ...session,
                    user: {
                      ...session?.user,
                      studyId: null,
                      studyRecordId: null,
                    },
                  });
                  onClose();
                },
              }}
              btnName="Go to Study Dashboard"
            />
          </Box>
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
      </StyledDairyCheckinView>
    </Dialog>
  );
};

export default DairyCheckinView;
