import VideoAssessmentLayout from "@/components/layouts/assessments/video/Video";
import React from "react";

interface GaitBalanceVideoAssessmentProps {
  assessments: any;
  isSuccessOnboardingQuestions: boolean;
  isErrorOnboardingQuestions: boolean;
  isLoadingOnboardingQuestions: boolean;
}


const GaitBalanceVideoAssessment = ({
  assessments,
  isLoadingOnboardingQuestions,
  isSuccessOnboardingQuestions,
}: GaitBalanceVideoAssessmentProps) => {

  debugger;
  console.log(assessments);

  return (
    <VideoAssessmentLayout
      totalSteps={0}
      currentQuestion={null}
      currentStep={0}
      onClickNextButton={() => {}}
      onClickBackButton={() => {}}
      onClickCloseIcon={() => {}}
      onClickBackToText={() => {}}
      onClickAudioButton={() => {}}
      onSavedSignature={() => {}}
    >
      GaitBalanceVideoAssessment
    </VideoAssessmentLayout>
  );
};

export default GaitBalanceVideoAssessment;
