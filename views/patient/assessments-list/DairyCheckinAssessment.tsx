"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { AUTH_API_STATUS, QUESTION_ANSWER_TYPE } from "@/utils/constants";
import _ from "lodash";
import { useSession } from "next-auth/react";
import {
  useLazyFetchPatientResponseQuery,
  useSavePatientResponseMutation,
} from "@/redux/api/assessmentsApi";
import { Session } from "next-auth";
import { useDispatch, useSelector } from "react-redux";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { toast } from "react-toastify";
import DiaryCheckinLayout from "@/components/layouts/assessments/diary-checkin/DiaryCheckin";
import EmojiInputFieldComponent from "@/components/common/form-fields/EmojiInputField";
import SentimentsSelectionField from "@/components/common/form-fields/SentimentsSelectionField";
import DialogVersionOneComponent from "@/components/common/dialogs/conformation/DialogVersionOne";
import InfoContentVersionOneComponent from "@/components/common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import TextInputFieldComponent from "@/components/common/form-fields/textInputField";
import RadioGroupSelectionComponent from "@/components/common/form-fields/RadioGropSelection";
import {
  getDiaryCheckinAssemmentPayload,
  getOnboardingDataByStep,
} from "@/redux/helpers/assessment";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import { layoutModeEnum } from "@/ts/enum";
import { getEmojiSentiments } from "@/utils/func";
import TitleAndSubtitle from "@/components/common/Headings/TitleAndSubtitle/TitleAndSubtitle";

interface DiaryCheckingAssessmentProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
  isLoadingOnboardingQuestions: boolean;
}

const DiaryCheckingAssessment = ({
  assessments,
  isSuccessOnboardingQuestions,
  isLoadingOnboardingQuestions,
}: DiaryCheckingAssessmentProps) => {
  const router: AppRouterInstance = useRouter();
  const searchParams = useSearchParams();
  const tabValue = searchParams.get("mode");
  const activeStep = searchParams.get("step");

  const [_currentTab, setCurrentTab] = useState<any>(
    layoutModeEnum.AVATAR_MODE
  );

  useEffect(() => {
    if (tabValue) {
      setCurrentTab(tabValue);
    }
  }, [tabValue, activeStep]);

  const dispatch = useDispatch();
  const routePath = usePathname();
  const [sentimentDescription, setSentimentDescription] = useState<
    string | any
  >(null);
  const [sentiment, setSentiment] = useState<string>("");
  const [audioFileInfo, setAudioFileInfo] = useState<any>(null);
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<layoutModeEnum>(
    layoutModeEnum.TEXT_ANSWER
  );
  const { data: session, update } = useSession();

  const { control, handleSubmit, formState, reset, getValues } = useForm({
    mode: "all",
  });

  const [
    fetchPatientResponse,
    {
      isSuccess: isSuccessPatientResponse,
      isLoading: isLoadingPatientResponse,
      data: dataPatientResponse,
    },
  ] = useLazyFetchPatientResponseQuery();
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );
  const [savePatientResponse, { isLoading: isLoadingSavedPatientResponse }] =
    useSavePatientResponseMutation();

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
              router.push(
                `${routePath}?step=${Number(activeStep) + 1}&&mode=${tabValue}`
              );
            }
          } else {
            router.push(
              `${routePath}?step=${Number(activeStep) + 1}&&mode=${tabValue}`
            );
          }
        }
      }
    } catch (error) {
      toast.error(AUTH_API_STATUS.SERVICE_UNAVAILABLE);
    }
  };

  const handleShuffleNavigation = (stage: number) => {
    if (layoutMode === layoutModeEnum.AUDIO) {
      setLayoutMode(layoutModeEnum.TEXT_ANSWER);
    }
    if (stage === 1 && tabValue === layoutModeEnum.TEXT_MODE) {
      router.push(
        `${routePath}?step=${Number(activeStep) + 3}&mode=${tabValue}`
      );
    } else {
      if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
        setIsFinalStep(true);
      } else {
        router.push(
          `${routePath}?step=${Number(activeStep) + 1}&mode=${tabValue}`
        );
      }
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

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

  return (
    <DiaryCheckinLayout
      onTabChange={(val) => {
        router.push(`${routePath}?step=${Number(activeStep)}&mode=${val}`);
      }}
      tabMode={_currentTab as string}
      dataLoadingIndicator={isLoadingPatientResponse}
      showLoadingOnNextButton={isLoadingSavedPatientResponse}
      onClickBackToText={() => {
        setLayoutMode(layoutModeEnum.TEXT_ANSWER);
      }}
      isFinalStep={
        Number(activeStep) === assessments?.onboardingQuestionsData.length
      }
      currentQuestion={currentQuestion}
      layoutMode={layoutMode}
      onClickBackButton={() => {
        router.back();
      }}
      totalSteps={assessments?.totalSteps}
      currentStep={Number(activeStep)}
      onClickNextButton={handleSubmit(onSubmit)}
      onClickCloseIcon={() => {
        router.push(APP_ROUTES.HOME);
      }}
      onClickAudioButton={() => {
        setLayoutMode(layoutModeEnum.AUDIO);
      }}
      showAudioButton={currentQuestion?.responseType?.includes(
        QUESTION_ANSWER_TYPE.AUDIO
      )}
      showInfoView={!!(currentQuestion?.stage == 2 && sentimentDescription)}
      infoContent={sentimentDescription as string}
      disabledNextButton={
        !formState?.isValid || assessments?.totalSteps < Number(activeStep)
      }
      onTriggerAfterSavedAudioAssessment={handleShuffleNavigation}
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <Fragment>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
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
                        <Box sx={{ margin: `0 auto`, width: 300 }}>
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
                          <Box sx={{ margin: `0 auto`, width: 300 }}>
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
                                { description, sentimentLabel }
                              ) => {
                                setSentiment(sentimentLabel);
                                setSentimentDescription(description);
                              }}
                            />
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
                            name={question?._id + QUESTION_ANSWER_TYPE.BOOLEAN}
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
                          name={question?._id + QUESTION_ANSWER_TYPE.TEXT}
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
              );
            }
          )}
        </Fragment>
      )}

      <DialogVersionOneComponent fullScreen open={isFinalStep}>
        {assessments?.totalSteps < Number(activeStep) ||
        assessments?.length === 0 ? (
          <InfoContentVersionOneComponent
            title="Sorry!"
            subTitle="We Haven't Found Any Assessments"
            imgUrl="/icons/no_items.svg"
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
                router.replace(APP_ROUTES.HOME);
              },
            }}
            btnName="Go to Study Dashboard"
          />
        ) : (
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
                router.replace(APP_ROUTES.HOME);
              },
            }}
            btnName="Go to Study Dashboard"
          />
        )}
      </DialogVersionOneComponent>
    </DiaryCheckinLayout>
  );
};

export default DiaryCheckingAssessment;
