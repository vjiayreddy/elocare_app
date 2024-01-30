// import { ,  } from "@/utils/actions";
import {
  AUTH_API_STATUS,
  QUESTION_ANSWER_TYPE,
  S3_URL,
} from "@/utils/constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { useSession } from "next-auth/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import { useSavePatientResponseMutation } from "@/redux/api/assessmentsApi";
import { Session } from "next-auth";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { ThreeDots } from "react-loader-spinner";
import VideoPlayer from "../common/VideoPlayer";
import axios from "axios";
import { APP_COLORS } from "@/theme/colors/colors";
import { layoutModeEnum } from "@/ts/enum";
import { getAssessmentMediaUploadPayload } from "@/redux/helpers/assessment";
import { useGetSignedUploadUrlMutation } from "@/redux/api/assessmentsApi";
import { calculatePercentage, getFileNameWithTimeStamp } from "@/utils/func";
import AudioRecordButtonCompoent from "@/components/common/buttons/audio-button/AudioButton";

interface ConditionalAssessmentLayoutProps {
  children: React.ReactNode;
  dataLoadingIndicator?: boolean;
  onClickNextButton: () => void;
  onSavedSignature?: () => void;
  onSavedVideo?: (data: any) => void;
  disabledNextButton?: boolean;
  onClickBackButton: () => void;
  currentStep: number;
  onClickCloseIcon: () => void;
  onClickAudioButton?: () => void;
  onClickBackToText: () => void;
  showAudioButton?: boolean;
  totalSteps: number;
  layoutMode: layoutModeEnum;
  currentQuestion: any;
  isFinalStep?: boolean;
  showLoadingOnNextButton?: boolean;
}

const StyledConditionalLayout = styled(Container)(({ theme }) => ({
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
  "& .__audio_visulazation": {
    marginTop: 20,
    // minHeight: 50,
    //maxHeight: 50,
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

const ConditionalAssessmentLayout = ({
  children,
  onClickBackButton,
  onClickNextButton,
  disabledNextButton,
  currentStep,
  onClickCloseIcon,
  onClickAudioButton,
  showAudioButton,
  totalSteps,
  currentQuestion,
  layoutMode = layoutModeEnum.TEXT_ANSWER,
  onSavedSignature,
  isFinalStep,
  showLoadingOnNextButton,
  dataLoadingIndicator,
  onSavedVideo,
}: ConditionalAssessmentLayoutProps) => {
  // session
  const { data: session } = useSession();
  const ref = useRef<any>();
  // Uppy
  const uppy = new Uppy();
  // Ref
  const signatureRef = useRef<any>();
  // Use State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [catturedVideoFile, setCapturedVideoFile] = useState<any>();

  // Redux
  const [getSignedUploadUrl] = useGetSignedUploadUrlMutation();
  const [savePatientResponse] = useSavePatientResponseMutation();

  // Convert Base 64 to File
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

  // hande UploadSignature
  const handleUploadSignature = async () => {
    if (signatureRef?.current?.isEmpty()) {
      toast.warn("Signature is required");
    } else {
      setIsUploading(true);
      const fileName = getFileNameWithTimeStamp("IMAGE");
      const fileInfo = convertBase64ToFile(
        signatureRef?.current?.toDataURL(),
        fileName + ".png"
      );

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
          data: fileInfo,
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
        setIsUploading(false);
        toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
      }
    }
  };

  // Handle Submit Assessment
  const handleSubmitAssessment = async (
    fileName: string,
    responseType: string
  ) => {
    try {
      const payload = getAssessmentMediaUploadPayload(
        responseType,
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
        if (responseType === QUESTION_ANSWER_TYPE.SIGNATURE) {
          onSavedSignature?.();
        } else {
          onSavedVideo?.(null);
        }
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
    handleSubmitAssessment(
      data?.name as string,
      QUESTION_ANSWER_TYPE.SIGNATURE
    );
  });

  // Capture Video
  const handleCapture = async (target: any) => {
    if (target.files) {
      onSavedVideo?.(target.files);
      // if (target.files.length !== 0) {
      //   setIsUploading(true);
      //   let file = target.files[0];
      //   let blob = file.slice(0, file.size, file?.type);
      //   const fileName = getFileNameWithTimeStamp("VIDEO");
      //   const fileExtension = getFileExtension(blob, "video/");
      //   let newFile = new File([blob], fileName + `.${fileExtension}`, {
      //     type: file?.type,
      //   });

      //   // try {
      //   //   const signedUrlResponse = (await getSignedUploadUrl({
      //   //     fileName: newFile?.name,
      //   //     contentType: newFile?.type,
      //   //     userId: session?.user?.id as string,
      //   //   })) as any;
      //   //   const { url } = signedUrlResponse?.data?.data;
      //   //   const uploadResponse = await axios.put(url, file, {
      //   //     headers: {
      //   //       "Content-Type": file?.type,
      //   //     },
      //   //     onUploadProgress(progressEvent) {
      //   //       const { loaded, total } = progressEvent;
      //   //       if (total) {
      //   //         let percent = Math.floor((loaded * 100) / total);
      //   //         if (percent <= 100) {
      //   //           console.log(percent);
      //   //         }
      //   //       }
      //   //     },
      //   //   });
      //   //   if (
      //   //     uploadResponse?.status === 200 &&
      //   //     uploadResponse?.statusText === "ok"
      //   //   ) {
      //   //     handleSubmitAssessment(newFile?.name, QUESTION_ANSWER_TYPE.VIDEO);
      //   //   }
      //   // } catch (error) {
      //   //   setIsUploading(false);
      //   // }
      // }
    }
  };

  const renderLayout = () => {
    if (
      currentQuestion?.questionType?.includes(
        QUESTION_ANSWER_TYPE.INTRODUCTION
      ) ||
      currentQuestion?.responseType?.includes(QUESTION_ANSWER_TYPE.INTRODUCTION)
    ) {
      return (
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
      );
    } else if (
      currentQuestion?.questionType?.includes(QUESTION_ANSWER_TYPE.VIDEO) ||
      currentQuestion?.responseType?.includes(QUESTION_ANSWER_TYPE.VIDEO)
    ) {
      return (
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
                    {currentQuestion?.value}
                  </Typography>
                  <Typography variant="body2" textAlign="center">
                    {currentQuestion?.hint}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <VideoPlayer
                  videoSource={currentQuestion?.demoVideoUrl}
                  videoType="video/mp4"
                />
              </Grid>
            </Grid>
          </Box>
        </Fragment>
      );
    } else {
      {
        if (layoutMode === layoutModeEnum.CONDITIONAL) {
          return (
            <Fragment>
              <Box component="div" className="__main_content">
                {children}
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
              </Box>
            </Fragment>
          );
        }
      }
    }
  };

  useEffect(() => {
    if (catturedVideoFile) {
      setIsUploading(true);
    }
  }, [catturedVideoFile]);

  return (
    <StyledConditionalLayout>
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
          {renderLayout()}
          <Box component="div" className="__footer">
            {showAudioButton && (
              <AudioRecordButtonCompoent onClick={onClickAudioButton} />
            )}

            {currentQuestion?.questionType?.includes(
              QUESTION_ANSWER_TYPE.VIDEO
            ) ||
            currentQuestion?.responseType?.includes(
              QUESTION_ANSWER_TYPE.VIDEO
            ) ? (
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12}>
                  <Button
                    disabled={disabledNextButton}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      ref.current?.click();
                    }}
                  >
                    <input
                      hidden
                      ref={ref}
                      accept="video/*"
                      id="icon-button-file"
                      type="file"
                      capture="environment"
                      onChange={(e) => handleCapture(e.target)}
                    />
                    Record your Response
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClickBackButton}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            ) : (
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
                    onClick={() => {
                      if (showLoadingOnNextButton) return;
                      if (
                        currentQuestion?.responseType?.includes(
                          QUESTION_ANSWER_TYPE.SIGNATURE
                        )
                      ) {
                        handleUploadSignature();
                      } else {
                        onClickNextButton();
                      }
                    }}
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
            )}
          </Box>
        </Fragment>
      )}
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
    </StyledConditionalLayout>
  );
};

export default ConditionalAssessmentLayout;
