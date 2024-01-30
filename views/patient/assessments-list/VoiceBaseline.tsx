import InfoContentVersionOneComponent from "@/components/common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";
import DialogVersionOneComponent from "@/components/common/dialogs/conformation/DialogVersionOne";
import AudioLayout from "@/components/layouts/assessments/audio/Audio";
import { getOnboardingDataByStep } from "@/redux/helpers/assessment";
import { setCurrentAssessmentQuestion } from "@/redux/reducers/assessmentSlice";
import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import { APP_ROUTES } from "@/utils/routes";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface DiaryCheckingAssessmentProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
}

const VoiceBaseline = ({ assessments }: DiaryCheckingAssessmentProps) => {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const activeStep = searchParams.get("step");
  const dispatch = useDispatch();
  const routePath = usePathname();
  const router: AppRouterInstance = useRouter();
  const [isFinalStep, setIsFinalStep] = useState<boolean>(false);
  const { currentQuestion } = useSelector(
    (state: any) => state?.assessmentSlice
  );

  const handleShuffleNavigation = (stage: number) => {
    if (Number(activeStep) === assessments?.onboardingQuestionsData.length) {
      setIsFinalStep(true);
    } else {
      router.push(`${routePath}?step=${Number(activeStep) + 1}`);
    }
  };

  // Trigger when this layout un amount

  useEffect(() => {
    return () => {
    };
  }, []);

  //  Trigger When [activeStep, assessments] this props will change

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

  return (
    <AudioLayout
      isFinalStep={
        Number(activeStep) === assessments?.onboardingQuestionsData.length
      }
      onClickBackToText={() => { }}
      currentQuestion={currentQuestion}
      onClickNextButton={() => {
        router.push(`${routePath}?step=${Number(activeStep) + 1}`);
      }}
      onClickCloseIcon={() => {
        router.push(APP_ROUTES.HOME);
      }}
      onTriggerAfterSavedAudioAssessment={(stage) => {
        handleShuffleNavigation(stage);
      }}
    >
      {assessments?.onboardingQuestionsData?.length > 0 && (
        <Fragment>
          {assessments?.onboardingQuestionsData.map(
            (question: any, index: number) => {
              return (
                <Fragment key={question?._id}>
                  {Number(activeStep) - 1 === index && (
                    <Fragment>
                      {question?.responseType?.includes(
                        QUESTION_ANSWER_TYPE.AUDIO
                      ) && (
                          <Box pl={1} pr={1} mb={2}>
                            <Typography gutterBottom variant="subtitle1">
                              {question?.title}
                            </Typography>
                            <Typography variant="body2">
                              {question?.value}
                            </Typography>
                          </Box>
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
    </AudioLayout>
  );
};

export default VoiceBaseline;
