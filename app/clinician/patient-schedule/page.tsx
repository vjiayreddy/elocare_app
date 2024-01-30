"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Box, Typography, styled } from "@mui/material";
import LoadingIndicatorComponent from "@/components/common/loading/LoadingIndicator";
import { AUTH_STATUS } from "@/utils/constants";
import ScheduleProgress from "@/views/clinician/schedule-progress";
import ScheduleLaunchAssessment from "@/views/clinician/schedule-launch-assessment";
import ScheduleHeader from "@/views/clinician/schedule-header";
import ScheduleStepper from "@/views/clinician/schedule-stepper";
import {
  useStartRecordPatientDialyVisitActivityMutation,
  useUpdatePatientDailyVisitMutation,
} from "@/redux/api/clinicialApi";
import _ from "lodash";
import ScheduleVitalSign from "@/views/clinician/schedule-vital-sign";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { toast } from "react-toastify";
import { useStartRecordSurveyMutation } from "@/redux/api/assessmentsApi";
import RegularAssessmentView from "@/components/containers/regular-assessment-view/RegularAssessmentView";
import InfoContentVersionOneComponent from "@/components/common/InfoContent/InfoContentVersionOne/InfoContentVersionOne";

const StyledPatientSchedulePage = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  "& .__header": {
    minHeight: 30,
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "hidden",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 5,
    display: "flex",
    "& .__time_line_view": {
      flexGrow: 1,
      overflowX: "hidden",
      overflowY: "hidden",
      display: "flex",
      flexDirection: "column",
      marginRight: 10,
      "& .__timeLine__header": {
        paddingBottom: 10,
      },
      "& .__timeline_stepper": {
        flexGrow: 1,
        overflowX: "hidden",
        overflowY: "auto",
      },
    },
    "& .__lanuch_assessement": {
      width: 150,
      [theme.breakpoints.up("sm")]: {
        width: 200,
      },
      backgroundColor: theme.palette.primary.main,
      borderRadius: 5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
  },
  "& .__footer": {
    minHeight: 75,
  },
}));

const PatientSchedulePage = () => {
  const { data: session, status, update } = useSession();
  const [openModel, setOpenModel] = useState<boolean>(false);
  // State
  const [activeStep, setActiveStep] = React.useState(0);
  // Router
  const router = useRouter();
  const [startRecordSurvey, { isLoading: isLoadingRecordServey }] =
    useStartRecordSurveyMutation();

  // Redux
  const [
    startRecordPatientDialyVisitActivity,
    { isLoading, data: patientDialyVisit },
  ] = useStartRecordPatientDialyVisitActivityMutation();

  const [
    updatePatientVitalActivity,
    { isLoading: isLoadingUpdatePatientVitalActivity },
  ] = useUpdatePatientDailyVisitMutation();

  useEffect(() => {
    if (status === AUTH_STATUS.AUTHENTICATED) {
      startRecordPatientDialyVisitActivity({
        patientId: session?.user?.clinician?.user?._id as string,
        doctorId: session?.user?.id as string,
      });
    }
  }, [session]);

  React.useEffect(() => {
    if (!_.isEmpty(patientDialyVisit)) {
      let completedSteps = _.filter(
        patientDialyVisit?.data?.scheduledSteps,
        (step) => step?.status === "COMPLETED"
      );
      if (!_.isEmpty(completedSteps)) {
        setActiveStep(completedSteps.length);
      }
    }
    console.log(patientDialyVisit);
  }, [patientDialyVisit]);

  const handleRecordSurvey = async (
    studyId: string,
    isDoctorLocked: boolean
  ) => {
    try {
      const response = await startRecordSurvey({
        patientId: session?.user?.id as string,
        studyId,
        isDoctorLocked: isDoctorLocked,
      });
      if ((response as any)?.data.status === "success") {
        const { data: surveyRecordData } = response as any;
        update({
          ...session,
          user: {
            ...session?.user,
            studyId: studyId,
            studyRecordId: surveyRecordData?.data?._id,
          },
        });
        setOpenModel(true);
      } else {
        toast.error(
          "Unable to process your request. Please check your input and try again"
        );
      }
    } catch (error) {
      if ((error as any)?.data?.message === "") {
        toast.error(
          "Unable to process your request. Please check your input and try again"
        );
      }
    }
  };

  // handle Stepper Steps
  const handleNextStep = () => {
    updatePatientVitalActivity({
      _id: patientDialyVisit?.data?._id,
      payload: {
        scheduledStepId:
          patientDialyVisit?.data?.scheduledSteps[activeStep]?._id,
        status: "COMPLETED",
        ...(patientDialyVisit?.data?.scheduledSteps[activeStep]?.studyId && {
          studyRecordId:
            patientDialyVisit?.data?.scheduledSteps[activeStep]?.studyId,
        }),
      },
    })
      .then((response) => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      })
      .catch((error: any) => {
        toast.error(error?.message);
      });
  };

  // Handle Update session
  const handleUpdateSession = () => {
    update({
      ...session,
      user: {
        ...session?.user,
        clinician: {
          user: {
            ...session?.user?.clinician?.user,
            scheduledStepsId:
              patientDialyVisit?.data?.scheduledSteps[activeStep]?._id,
            dailyPatientVisitId: patientDialyVisit?.data?._id,
          },
        },
      },
    });
  };

  // Handle Router
  const handleRoute = () => {
    if (
      patientDialyVisit?.data?.scheduledSteps[activeStep]?.title ===
        "Baseline Vitals" ||
      patientDialyVisit?.data?.scheduledSteps[activeStep]?.title ===
        "Infusion Monitoring (Vitals)"
    ) {
      handleUpdateSession();
      const _tabValue =
        patientDialyVisit?.data?.scheduledSteps[activeStep]?.title ===
        "Baseline Vitals"
          ? "vital-signs"
          : "infusion-monitoring";
      router.push(`${APP_ROUTES.CLINICIAN_PATIENT_VITALS}?tab=${_tabValue}`);
    }
  };

  return (
    <StyledPatientSchedulePage>
      {isLoading && !patientDialyVisit && <LoadingIndicatorComponent />}
      {!isLoading && !_.isEmpty(patientDialyVisit?.data) && (
        <Fragment>
          <ScheduleHeader />
          <Box p={2} component="div" className="__main_content">
            <Box component="div" className="__time_line_view">
              <ScheduleProgress
                totalSteps={patientDialyVisit?.data?.scheduledSteps?.length}
                currentValue={activeStep}
              />
              <Box component="div" className="__timeline_stepper">
                <ScheduleStepper
                  isStepSumiting={isLoadingUpdatePatientVitalActivity}
                  activeStep={activeStep}
                  handleNextStep={handleNextStep}
                  steps={patientDialyVisit?.data?.scheduledSteps || []}
                />
              </Box>
            </Box>
            {patientDialyVisit?.data?.scheduledSteps[activeStep]?.studyId && (
              <ScheduleLaunchAssessment
                onClick={() => {
                  handleRecordSurvey(
                    patientDialyVisit?.data?.scheduledSteps[activeStep]
                      ?.studyId,
                    false
                  );
                }}
                element={
                  <Typography
                    variant="subtitle1"
                    textAlign="center"
                    sx={(theme) => ({ color: theme.palette.common.white })}
                  >
                    Start{" "}
                    {patientDialyVisit?.data?.scheduledSteps[activeStep]?.title}
                  </Typography>
                }
              />
            )}
          </Box>
          <Box mt={2} mb={2} component="div" className="__footer">
            <ScheduleVitalSign
              disabled={false}
              onClick={handleRoute}
              showLoading={false}
            />
          </Box>
        </Fragment>
      )}
      {!isLoading && _.isEmpty(patientDialyVisit?.data) && (
        <Box pt={9} sx={{ margin: "0 auto", width: "500px" }}>
          <InfoContentVersionOneComponent
            title="Session is complete"
            subTitle="You’ve completed this patients session"
            onClick={()=>{
              router.push(APP_ROUTES.CLINICIAL_HOME)
            }}
            btnProps={{
              size: "large",
            }}
            btnName="View Captured Vitals"
          />
        </Box>
      )}

      <RegularAssessmentView
        open={openModel}
        onClose={() => {
          setOpenModel(false);
        }}
      />
    </StyledPatientSchedulePage>
  );
};

export default PatientSchedulePage;
