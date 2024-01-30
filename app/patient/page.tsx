"use client";
import PatientHomeLayout from "@/components/layouts/patient/PatientHomeLayout";
import { useLazyFetchDashboardDataQuery } from "@/redux/api/assessmentsApi";
import AssessmentsList from "@/views/patient/assessments-list/AssessmentList";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const PatientHomePage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const router = useRouter();
  const { data: session } = useSession();
  const [fetchDashboardData, { data: assessmentsData, isLoading }] =
    useLazyFetchDashboardDataQuery();

  const fetchPatientsSurveisList = async () => {
    await fetchDashboardData({
      userId: session?.user?.id as string,
    });
  };

  useEffect(() => {
    if (session?.user) {
      fetchPatientsSurveisList();
    }
  }, [session]);

  return (
    <PatientHomeLayout
      loading={isLoading}
      bottomNavigationProps={{
        value: tabIndex,
        onChange(_, value) {
          setTabIndex(value);
        },
      }}
    >
      {tabIndex == 0 && (
        <AssessmentsList
          isLoadingAssessments={isLoading}
          data={assessmentsData}
          onRefresh={()=>{
            console.log('calling');
            router.push(APP_ROUTES.PATIENT_HOME);
          }}
        />
      )}
      {tabIndex == 1 && <>PatientHomeLayout</>}
    </PatientHomeLayout>
  );
};

export default PatientHomePage;
