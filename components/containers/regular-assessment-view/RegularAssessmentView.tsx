import React, { Fragment, useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { StyledRegularAssessmentView } from "./styled";
import Box from "@mui/material/Box";
import {
  calculatePercentage,
  checkUnitType,
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
import { LOGIN_TYPE, layoutModeEnum } from "@/ts/enum";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
  S3_URL,
} from "@/utils/constants";
import TextInputFieldComponent from "@/components/common/form-fields/textInputField";
import { useForm } from "react-hook-form";
import RadioGroupSelectionComponent from "@/components/common/form-fields/RadioGropSelection";
import TitleAndSubtitle from "@/components/common/Headings/TitleAndSubtitle/TitleAndSubtitle";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import {
  audioMp3Converter,
  getAssessmentMediaUploadPayload,
  getFileExtension,
  getOnboardingDataByStep,
  getTodayAssessmentsPayload,
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
import TimePickerInputFieldComponent from "@/components/common/form-fields/timePicker";
import DatePickerInputFieldComponent from "@/components/common/form-fields/datePickerInputField";
import CheckBoxControlGroup from "@/components/common/form-fields/checkBoxGroup";
import SignatureCanvas from "react-signature-canvas";

interface RegularAssessmentViewProps {
  open: boolean;
  onClose: () => void;
}

const RegularAssessmentView = ({
  open,
  onClose,
}: RegularAssessmentViewProps) => {
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
  const {
    handleSubmit,
    formState,
    reset,
    control,
    register,
    watch,
    getValues,
  } = useForm({
    mode: "all",
  });
  const watchFromStatus = watch();

  // state
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const { data: session, update } = useSession();
  const [activeStep, setActiveStep] = useState(1);
  const signatureRef = useRef<any>();

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
      const uid =
        session?.user?.role === LOGIN_TYPE.CLINICIAN
          ? session?.user?.clinician?.user?._id
          : session?.user?.id;
      const signedUrlResponse = (await getSignedUploadUrl({
        fileName: fileInfo?.name,
        contentType: fileInfo?.type,
        userId: uid as string,
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
      const uid =
        session?.user?.role === LOGIN_TYPE.CLINICIAN
          ? session?.user?.clinician?.user?._id
          : session?.user?.id;
      fetchPatientResponse({
        patientId: uid,
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
      const payload = getTodayAssessmentsPayload(
        currentQuestion,
        data,
        session as Session
      );
      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        payload.isLastQuestion = true;
      }
      if (
        currentQuestion?.questionType?.includes(
          QUESTION_ANSWER_TYPE.INTRODUCTION
        )
      ) {
        setActiveStep(activeStep + 1);
      } else {
        const response = (await savePatientResponse({
          ...payload,
        })) as any;

        if (response?.data?.data) {
          if (
            Number(activeStep) === assessments?.onboardingQuestionsData.length
          ) {
            setIsFinalStep(true);
          } else {
            setActiveStep(activeStep + 1);
          }
        }
      }
    } catch (error) {
      console.log(error);
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
      const uid =
      session?.user?.role === LOGIN_TYPE.CLINICIAN
        ? session?.user?.clinician?.user?._id
        : session?.user?.id;
  
      const response = (await savePatientResponse({
        ...payload,
        filePath: `${S3_URL}/${uid}/${fileName}`,
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

  const getConditionBasedQuestion = (
    rootQuestionId: any,
    selectedQuestion: any
  ) => {
    let subQuestion: any = null;
    if (selectedQuestion?.conditions?.length > 0) {
      selectedQuestion?.conditions?.map((item: any) => {
        if (item?.optionIds?.includes(rootQuestionId)) {
          if (selectedQuestion?.subQuestion?.length > 0) {
            selectedQuestion?.subQuestion.map((_q: any) => {
              if (item?.subQuestionIds?.includes(_q?._id)) {
                subQuestion = _q;
              }
            });
          }
        }
      });
    }

    return subQuestion;
  };

  const getMultiSelectConditionBasedQuestion = (
    rootQuestionIds: any,
    selectedQuestion: any
  ) => {
    let subQuestion: any = null;
    rootQuestionIds?.map((question: any) => {
      if (selectedQuestion?.conditions?.length > 0) {
        selectedQuestion?.conditions?.map((item: any) => {
          if (item?.optionIds?.includes(question)) {
            if (selectedQuestion?.subQuestion?.length > 0) {
              selectedQuestion?.subQuestion.map((_q: any) => {
                if (item?.subQuestionIds?.includes(_q?._id)) {
                  subQuestion = _q;
                }
              });
            }
          }
        });
      }
    });

    return subQuestion;
  };

  const handleCheck = (checkedId: any, fieldName: string) => {
    let newIds = [];
    const { [fieldName]: ids } = getValues();
    if (ids?.includes(checkedId)) {
      newIds = ids?.filter((id: any) => id !== checkedId);
    } else {
      newIds = [...(ids ?? []), checkedId];
    }
    return newIds;
  };

  const convertBase64ToFile = (url: string, fileName: string) => {
    let arr = url.split(",");
    let mime = arr[0].match(/:(.*?);/)![1];
    let data = arr[1];
    let dataStr = atob(data);
    let n = dataStr.length;
    let dataArr = new Uint8Array(n);
    while (n--) {
      dataArr[n] = dataStr.charCodeAt(n);
    }
    let file = new File([dataArr], fileName, { type: mime });
    return file;
  };

  // const handleUploadSignature = async () => {
  //   if (signatureRef?.current?.isEmpty()) {
  //     toast.warn("Signature is required");
  //   } else {
  //     setIsLoading(true);
  //     const fileName = getFileNameWithTimeStamp("IMAGE");
  //     const fileInfo = convertBase64ToFile(
  //       signatureRef?.current?.toDataURL(),
  //       fileName + ".png"
  //     );

  //     try {
  //       const signedUrlResponse = (await getSignedUploadUrl({
  //         fileName: fileInfo?.name,
  //         contentType: fileInfo?.type,
  //         userId: session?.user?.id as string,
  //       })) as any;
  //       const { url } = signedUrlResponse?.data?.data;
  //       uppy.addFile({
  //         name: fileInfo?.name,
  //         type: fileInfo?.type,
  //         data: fileInfo,
  //       });
  //       uppy.use(XHRUpload, {
  //         endpoint: url,
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": fileInfo?.type,
  //         },
  //       });
  //       uppy.upload();
  //     } catch (error) {
  //       setIsLoading(false);
  //       toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
  //     }
  //   }
  // };

  return (
    <Dialog fullScreen={true} open={open}>
      <StyledRegularAssessmentView>
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
                                {question?.questionType.includes(
                                  QUESTION_ANSWER_TYPE.TEXT
                                ) && (
                                  <Fragment>
                                    <Box pl={1} pr={1} mb={2}>
                                      <TitleAndSubtitle
                                        subTitle={question?.hint}
                                        title={question?.value}
                                      />
                                    </Box>
                                  </Fragment>
                                )}
                                {question?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE?.BOOLEAN
                                ) && (
                                  <Fragment>
                                    <RadioGroupSelectionComponent
                                      control={control}
                                      id={`${QUESTION_ANSWER_TYPE.BOOLEAN}-${index}`}
                                      name={
                                        question?._id +
                                        QUESTION_ANSWER_TYPE.BOOLEAN
                                      }
                                      radioGroupProps={{
                                        row: false,
                                      }}
                                      gridProps={{
                                        direction: "row",
                                        spacing: 2,
                                      }}
                                      gridItemProps={{
                                        xs: 12,
                                      }}
                                      defaultValues={null}
                                      options={question?.options || []}
                                      targetValue="_id"
                                      labelName="optionValue"
                                      varient="CHECK_BOX_BUTTON"
                                      rules={{
                                        required: true,
                                      }}
                                    />
                                    {!_.isEmpty(question?.conditions) &&
                                      question?.hasSubQuestion &&
                                      !_.isEmpty(question?.subQuestion) && (
                                        <Box mt={3}>
                                          {getConditionBasedQuestion(
                                            watchFromStatus[
                                              question?._id +
                                                QUESTION_ANSWER_TYPE.BOOLEAN
                                            ],
                                            question
                                          )?.questionType?.includes(
                                            QUESTION_ANSWER_TYPE.TEXT
                                          ) && (
                                            <Fragment>
                                              {getConditionBasedQuestion(
                                                watchFromStatus[
                                                  question?._id +
                                                    QUESTION_ANSWER_TYPE.BOOLEAN
                                                ],
                                                question
                                              )?.responseType?.includes(
                                                QUESTION_ANSWER_TYPE.TEXT
                                              ) && (
                                                <Fragment>
                                                  <TextInputFieldComponent
                                                    id={
                                                      getConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.BOOLEAN
                                                        ],
                                                        question
                                                      )?._id
                                                    }
                                                    name={
                                                      getConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.BOOLEAN
                                                        ],
                                                        question
                                                      )?._id +
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
                                                      multiline: checkUnitType(
                                                        question?.unit
                                                      )?.multiLine,
                                                      type: checkUnitType(
                                                        question?.unit
                                                      )?.type,
                                                      placeholder:
                                                        getConditionBasedQuestion(
                                                          watchFromStatus[
                                                            question?._id +
                                                              QUESTION_ANSWER_TYPE.BOOLEAN
                                                          ],
                                                          question
                                                        )?.inputConfig
                                                          ?.placeholder,
                                                      rows: 8,
                                                    }}
                                                  />
                                                </Fragment>
                                              )}
                                            </Fragment>
                                          )}

                                          {getConditionBasedQuestion(
                                            watchFromStatus[
                                              question?._id +
                                                QUESTION_ANSWER_TYPE.BOOLEAN
                                            ],
                                            question
                                          )?.responseType?.includes(
                                            QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                          ) && (
                                            <Fragment>
                                              {getConditionBasedQuestion(
                                                watchFromStatus[
                                                  question?._id +
                                                    QUESTION_ANSWER_TYPE.BOOLEAN
                                                ],
                                                question
                                              )?.responseType?.includes(
                                                QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                              ) && (
                                                <Fragment>
                                                  <RadioGroupSelectionComponent
                                                    control={control}
                                                    id={`${QUESTION_ANSWER_TYPE.SINGLE_SELECTION}-${index}`}
                                                    name={
                                                      getConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.BOOLEAN
                                                        ],
                                                        question
                                                      )?._id +
                                                      QUESTION_ANSWER_TYPE.SINGLE_SELECTION
                                                    }
                                                    radioGroupProps={{
                                                      row: false,
                                                    }}
                                                    gridProps={{
                                                      direction: "row",
                                                      spacing: 2,
                                                    }}
                                                    gridItemProps={{
                                                      xs: 12,
                                                    }}
                                                    defaultValues={null}
                                                    options={
                                                      getConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.BOOLEAN
                                                        ],
                                                        question
                                                      )?.options || []
                                                    }
                                                    targetValue="_id"
                                                    labelName="optionValue"
                                                    varient="CHECK_BOX_BUTTON"
                                                    rules={{
                                                      required: true,
                                                    }}
                                                  />
                                                </Fragment>
                                              )}
                                            </Fragment>
                                          )}
                                        </Box>
                                      )}
                                  </Fragment>
                                )}
                                {currentQuestion?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE.SIGNATURE
                                ) && (
                                  <Fragment>
                                    <Box
                                      sx={{
                                        margin: "0 auto",
                                        border: `1px solid gray`,
                                        width: 328,
                                        height: 208,
                                      }}
                                    >
                                      <SignatureCanvas
                                        ref={signatureRef}
                                        penColor="black"
                                        onEnd={() => {}}
                                        canvasProps={{
                                          width: 328,
                                          height: 208,
                                          className: "sigCanvas",
                                        }}
                                      />
                                    </Box>

                                    <Box mt={2}>
                                      <Button
                                        variant="text"
                                        onClick={() => {
                                          if (signatureRef?.current) {
                                            signatureRef?.current?.clear();
                                          }
                                        }}
                                      >
                                        Clear
                                      </Button>
                                    </Box>
                                  </Fragment>
                                )}

                                {question?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE.TEXT
                                ) && (
                                  <TextInputFieldComponent
                                    id={`${question?._id}${QUESTION_ANSWER_TYPE.TEXT}-${index}`}
                                    name={`${question?._id}${QUESTION_ANSWER_TYPE.TEXT}`}
                                    label=""
                                    defaultValue={""}
                                    control={control}
                                    rules={{
                                      required: true,
                                    }}
                                    textFieldProps={{
                                      fullWidth: true,
                                      multiline: checkUnitType(
                                        question?.inputConfig?.inputType
                                      )?.multiLine,
                                      type: checkUnitType(
                                        question?.inputConfig?.inputType
                                      )?.type,
                                      placeholder:
                                        question?.inputConfig?.placeholder,
                                      ...(checkUnitType(
                                        question?.inputConfig?.inputType
                                      )?.multiLine && {
                                        rows: 4,
                                      }),
                                    }}
                                  />
                                )}

                                {question?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE.DATE_TIME
                                ) && (
                                  <Fragment>
                                    {question?.hasSubQuestion &&
                                      _.isEmpty(question?.conditions) &&
                                      !_.isEmpty(question?.subQuestion) && (
                                        <Fragment>
                                          {question?.subQuestion?.map(
                                            (subQus: any, index: number) => {
                                              return (
                                                <Fragment key={subQus._id}>
                                                  <input
                                                    type="hidden"
                                                    {...register(
                                                      question?._id +
                                                        QUESTION_ANSWER_TYPE.DATE_TIME
                                                    )}
                                                  />
                                                  {subQus?.responseType?.includes(
                                                    QUESTION_ANSWER_TYPE.TIME
                                                  ) && (
                                                    <Fragment>
                                                      <Box mb={2}>
                                                        <Typography
                                                          gutterBottom
                                                        >
                                                          {subQus?.value}
                                                        </Typography>

                                                        <TimePickerInputFieldComponent
                                                          control={control}
                                                          label=""
                                                          defaultValue="04:00 AM"
                                                          rules={{
                                                            required: true,
                                                          }}
                                                          name={`${subQus?._id}${QUESTION_ANSWER_TYPE.TIME}`}
                                                        />
                                                      </Box>
                                                    </Fragment>
                                                  )}
                                                  {subQus?.responseType?.includes(
                                                    QUESTION_ANSWER_TYPE.DATE
                                                  ) && (
                                                    <Fragment>
                                                      {JSON.stringify(
                                                        subQus?._id
                                                      )}
                                                      <Box mb={2}>
                                                        <Typography
                                                          gutterBottom
                                                        >
                                                          {subQus?.value}
                                                        </Typography>

                                                        <DatePickerInputFieldComponent
                                                          control={control}
                                                          label=""
                                                          defaultValue=""
                                                          rules={{
                                                            required: true,
                                                          }}
                                                          name={`${subQus?._id}${QUESTION_ANSWER_TYPE.DATE}`}
                                                        />
                                                      </Box>
                                                    </Fragment>
                                                  )}
                                                </Fragment>
                                              );
                                            }
                                          )}
                                        </Fragment>
                                      )}
                                  </Fragment>
                                )}
                                {question?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                ) && (
                                  <Fragment>
                                    <CheckBoxControlGroup
                                      gridProps={{
                                        direction: "column",
                                      }}
                                      gridItemProps={{
                                        xs: 12,
                                      }}
                                      variant="NORMAL"
                                      options={question?.options}
                                      defaultValues={[]}
                                      labelName="optionValue"
                                      id={`${question?._id}${QUESTION_ANSWER_TYPE.MULTI_SELECTION}`}
                                      control={control}
                                      name={`${question?._id}${QUESTION_ANSWER_TYPE.MULTI_SELECTION}`}
                                      onChange={handleCheck}
                                    />

                                    {!_.isEmpty(question?.conditions) &&
                                      question?.hasSubQuestion &&
                                      !_.isEmpty(question?.subQuestion) && (
                                        <Box mt={3}>
                                          {getMultiSelectConditionBasedQuestion(
                                            watchFromStatus[
                                              question?._id +
                                                QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                            ],
                                            question
                                          )?.questionType?.includes(
                                            QUESTION_ANSWER_TYPE.TEXT
                                          ) && (
                                            <Fragment>
                                              {getMultiSelectConditionBasedQuestion(
                                                watchFromStatus[
                                                  question?._id +
                                                    QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                                ],
                                                question
                                              )?.responseType?.includes(
                                                QUESTION_ANSWER_TYPE.TEXT
                                              ) && (
                                                <Fragment>
                                                  <TextInputFieldComponent
                                                    id={
                                                      getMultiSelectConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                                        ],
                                                        question
                                                      )?._id
                                                    }
                                                    name={
                                                      getMultiSelectConditionBasedQuestion(
                                                        watchFromStatus[
                                                          question?._id +
                                                            QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                                        ],
                                                        question
                                                      )?._id +
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
                                                      multiline: checkUnitType(
                                                        question?.unit
                                                      )?.multiLine,
                                                      type: checkUnitType(
                                                        question?.unit
                                                      )?.type,
                                                      placeholder:
                                                        getMultiSelectConditionBasedQuestion(
                                                          watchFromStatus[
                                                            question?._id +
                                                              QUESTION_ANSWER_TYPE.MULTI_SELECTION
                                                          ],
                                                          question
                                                        )?.inputConfig
                                                          ?.placeholder,
                                                      rows: 8,
                                                    }}
                                                  />
                                                </Fragment>
                                              )}
                                            </Fragment>
                                          )}
                                        </Box>
                                      )}
                                  </Fragment>
                                )}
                                {question?.responseType?.includes(
                                  QUESTION_ANSWER_TYPE.INTRODUCTION
                                ) && (
                                  <Grid
                                    container
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Grid item>
                                      <Box mb={8}>
                                        <TitleAndSubtitle
                                          subTitle={question?.value}
                                          title={question?.title}
                                        />
                                      </Box>
                                    </Grid>
                                  </Grid>
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
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={() => {
                        if (activeStep === 1) {
                          return;
                        }
                        setActiveStep(activeStep - 1);
                      }}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item xs={6} md={6} sm={6} lg={6} xl={6}>
                    <Button
                      disabled={
                        !formState?.isValid ||
                        assessments?.totalSteps < Number(activeStep)
                      }
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isLoadingSavedPatientResponse ? (
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

        {(isLoadingOnboardingQuestions || isFetchingOnboardingQuestions) && (
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
      </StyledRegularAssessmentView>
    </Dialog>
  );
};

export default RegularAssessmentView;
