"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import _ from "lodash";
import moment from "moment";
import { APP_ROUTES } from "@/utils/routes";
import {
  ASSESSMENTS_CATEGORIES,
  NO_ASSESSMENTS_FOUND,
} from "@/utils/constants";
import AssessmentCounterCard from "@/components/common/cards/assessment-counter/AssessmentCounter";
import UserGreeting from "@/components/common/app-bar/Greetings";
import AssessmentNotification from "@/components/common/cards/assessment-notification/AssessmentNotification";
import { useStartRecordSurveyMutation } from "@/redux/api/assessmentsApi";
import AssessmentCard from "@/components/common/cards/assessment-card/AssessmentCard";
import InfoCardComponent from "@/components/common/cards/infocard/InfoCardComponent";
import LoadingDialogComponent from "@/components/common/loading/LoadingDialog";
import DairyCheckinView from "@/components/containers/dairy-checkin-view/DairyCheckinView";
import RegularAssessmentView from "@/components/containers/regular-assessment-view/RegularAssessmentView";

interface AssessmentsListProps {
  data: any;
  isLoadingAssessments: boolean;
  onRefresh?: () => void;
}

const StyledAssessmentsList = styled(Box)(({ theme }) => ({
  "& .__greeting_box": {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const AssessmentsList = ({
  data,
  isLoadingAssessments,
  onRefresh,
}: AssessmentsListProps) => {
  const { data: session, update } = useSession();
  const [startRecordSurvey, { isLoading }] = useStartRecordSurveyMutation();
  const [openDairyCheckingView, setOpenDairyCheckingView] = useState(false);
  const [openRegularAssessmentView, setOpenRegularAssessmentView] =
    useState(false);

  // handle create new survey record before start assessements
  const handleRecordSurvey = async (
    studyId: string,
    templateId: string,
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
        if (templateId === ASSESSMENTS_CATEGORIES.DAIRY_CHECKEN) {
          setOpenDairyCheckingView(true);
        } else {
          setOpenRegularAssessmentView(true);
        }
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
  return (
    <StyledAssessmentsList>
      <Box component="div" className="__greeting_box">
        <UserGreeting />
      </Box>
      <Typography mt={2} mb={1} variant="h6">
        Weekly goal
      </Typography>
      <Box mb={3}>
        <AssessmentCounterCard
          isLoadingAssessments={isLoadingAssessments}
          total={data?.assessments?.length || 0}
          active={data?.completedCount || 0}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Today’s Assessments</Typography>
      </Box>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12}>
          <AssessmentNotification />
        </Grid>

        {data?.todaysAssessments?.length > 0 && (
          <>
            {data?.todaysAssessments?.map((assessment: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={assessment?._id}>
                <AssessmentCard
                  title={assessment?.title}
                  content={assessment?.description}
                  disabled={
                    assessment?.studyRecordData?.[0]?.status === "COMPLETED"
                      ? false
                      : false
                  }
                  timeStamp={
                    assessment?.studyRecordData?.length > 0
                      ? moment(
                          new Date(
                            assessment?.studyRecordData?.[0].startDate?.mongoTimestamp
                          )
                        ).fromNow()
                      : null
                  }
                  status={
                    assessment?.studyRecordData?.length > 0
                      ? `${assessment?.studyRecordData?.[0]?.status}`
                      : null
                  }
                  onClick={() => {
                    handleRecordSurvey(
                      assessment?._id,
                      assessment?.assessmentTemplateId,
                      false
                    );
                  }}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
      <Box mb={2} mt={2}>
        <Typography variant="subtitle1">As-Needed Assessments</Typography>
      </Box>

      {data?.dialyNeedAssessments?.length > 0 && (
        <Grid container spacing={2} alignItems="stretch">
          {data?.dialyNeedAssessments?.map((assessment: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={assessment?._id}>
              <AssessmentCard
                disabled={false}
                timeStamp={
                  assessment?.studyRecordData?.length > 0
                    ? moment(
                        new Date(
                          assessment?.studyRecordData?.[0].startDate?.mongoTimestamp
                        )
                      ).fromNow()
                    : null
                }
                btnName={
                  assessment?.studyRecordData?.length > 0 ? "Continue" : "Start"
                }
                status={
                  assessment?.studyRecordData?.length > 0
                    ? `${assessment?.studyRecordData?.[0]?.status}`
                    : null
                }
                showbtnloading={false}
                title={assessment?.title}
                content={assessment?.description}
                onClick={() => {
                  handleRecordSurvey(
                    assessment?._id,
                    assessment?.assessmentTemplateId,
                    false
                  );
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {data?.dialyNeedAssessments?.length < 0 && (
        <Grid container>
          <Grid item xs={12}>
            <InfoCardComponent title={NO_ASSESSMENTS_FOUND} />
          </Grid>
        </Grid>
      )}
      {isLoading && <LoadingDialogComponent open={isLoading} />}
      {openDairyCheckingView && (
        <DairyCheckinView
          open={openDairyCheckingView}
          onClose={() => {
            setOpenDairyCheckingView(false);
            onRefresh?.();
          }}
        />
      )}
      {openRegularAssessmentView && (
        <RegularAssessmentView
          open={openRegularAssessmentView}
          onClose={() => {
            setOpenRegularAssessmentView(false);
            onRefresh?.();
          }}
        />
      )}
    </StyledAssessmentsList>
  );
};

export default AssessmentsList;
