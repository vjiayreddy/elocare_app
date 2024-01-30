"use client";
import React, { Fragment, useEffect, useState } from "react";
import LoadingIndicatorComponent from "@/components/common/loading/LoadingIndicator";
import { AUTH_STATUS } from "@/utils/constants";
import VitalBackButton from "@/views/clinician/vital-back-button";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import VitalCard from "@/components/common/cards/vital-card/VitalCard";
import VitalWeightForm from "@/components/common/forms/vital-forms/vital-weight/VitalWeight";
import VitalTemparatureForm from "@/components/common/forms/vital-forms/vital-temparature-form/VitalTemparatureForm";
import VitalHeartRateForm from "@/components/common/forms/vital-forms/vital-heart-rate-form/VitalHeartRateForm";
import VitalRespiratoryRateForm from "@/components/common/forms/vital-forms/vital-respiratory-rate-form/VitalRespiratoryRateForm";
import VitalOxygenForm from "@/components/common/forms/vital-forms/vital-oxygen-form/VitalOxygenForm";
import VitalBloodPreasureForm from "@/components/common/forms/vital-forms/vital-blood-preasure-form/VitalBloodPreasureForm";
import { useLazyStartRecordPatientVitalActivityQuery } from "@/redux/api/clinicialApi";
import _ from "lodash";
import VitalSymptomForm from "@/components/common/forms/vital-forms/vital-symptom-form/VitalSymptomForm";
import { useSearchParams } from "next/navigation";

const StyledPatientVitals = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  "& .MuiTab-root": {
    textTransform: "none",
  },
  "& .__header": {
    minHeight: 30,
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowX: "hidden",
    overflowY: "hidden",
    //border: `1px solid ${theme.palette.divider}`,
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

const PatientVitals = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  // State
  const [tabVal, setTabVal] = useState<string>(tab ? tab : "vital-signs");
  const [opeWeightForm, setOpenWeightForm] = useState<boolean>(false);
  const [opeTemparatureForm, setOpeTemparatureForm] = useState<boolean>(false);
  const [openHeartRateForm, setOpenHeartRateForm] = useState<boolean>(false);
  const [openRespiratoryForm, setOpenRespiratoryForm] =
    useState<boolean>(false);
  const [openOxygenForm, setOpenOxygenForm] = useState<boolean>(false);
  const [openBloodPreasureForm, setOpenBloodPreasureForm] =
    useState<boolean>(false);
  const [openSymptomsForm, setOpenSymptomsForm] = useState<boolean>(false);

  // redux
  const [startRecordPatientVitalActivity, { isLoading, data: vitalsData }] =
    useLazyStartRecordPatientVitalActivityQuery({ refetchOnFocus: true });

  // handle tabs
  const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
    setTabVal(newValue);
  };

  useEffect(() => {
    if (status === AUTH_STATUS.AUTHENTICATED) {
      startRecordPatientVitalActivity({
        patientId: session?.user?.clinician?.user?._id as string,
        scheduledStepsId: session?.user?.clinician?.user
          ?.scheduledStepsId as string,
        dailyPatientVisitId: session?.user?.clinician?.user
          ?.dailyPatientVisitId as string,
      });
    }
  }, [status, session]);

  console.log(vitalsData);

  return (
    <StyledPatientVitals>
      {(status === AUTH_STATUS.LOADING || isLoading) && (
        <LoadingIndicatorComponent />
      )}
      {status === AUTH_STATUS.AUTHENTICATED && !isLoading && (
        <Fragment>
          <Box component="div" className="__header">
            <Box pt={2} component="div" className="__header">
              <Typography textAlign="center" variant="subtitle1">
                {session?.user?.clinician?.user?.firstName}{" "}
                {session?.user?.clinician?.user?.lastName} Vital Sign
              </Typography>
            </Box>
          </Box>
          <Box mb={2}>
            <Tabs
              value={tabVal}
              onChange={handleChangeTabs}
              aria-label="wrapped label tabs example"
            >
              <Tab value="vital-signs" label="Vital Signs" />
              <Tab value="infusion-monitoring" label="Infusion Monitoring" />
            </Tabs>
          </Box>
          <Box component="div" className="__main_content">
            <Grid
              sx={{
                "--Grid-borderWidth": "1px",
                borderTop: "var(--Grid-borderWidth) solid",
                borderLeft: "var(--Grid-borderWidth) solid",
                borderColor: "divider",
                "& > div": {
                  borderRight: "var(--Grid-borderWidth) solid",
                  borderBottom: "var(--Grid-borderWidth) solid",
                  borderColor: "divider",
                },
              }}
              container
              alignItems="stretch"
            >
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.weight)
                      ? vitalsData?.data?.weight[
                          vitalsData?.data?.weight?.length - 1
                        ]
                      : []
                  }
                  title="weight"
                  iconUrl="/vitals/weight.svg"
                  onPressEnter={() => {
                    setOpenWeightForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  title="temparature"
                  iconUrl="/vitals/tempature.svg"
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.temperature)
                      ? vitalsData?.data?.temperature[
                          vitalsData?.data?.temperature?.length - 1
                        ]
                      : []
                  }
                  onPressEnter={() => {
                    setOpeTemparatureForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  title="heartRate"
                  iconUrl="/vitals/heart_rate.svg"
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.heartRate)
                      ? vitalsData?.data?.heartRate[
                          vitalsData?.data?.heartRate?.length - 1
                        ]
                      : []
                  }
                  onPressEnter={() => {
                    setOpenHeartRateForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.respiratoryRate)
                      ? vitalsData?.data?.respiratoryRate[
                          vitalsData?.data?.respiratoryRate?.length - 1
                        ]
                      : []
                  }
                  title="Respiratory"
                  iconUrl="/vitals/respitory_rate.svg"
                  onPressEnter={() => {
                    setOpenRespiratoryForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  title="oxygen"
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.oxygenSaturation)
                      ? vitalsData?.data?.oxygenSaturation[
                          vitalsData?.data?.oxygenSaturation?.length - 1
                        ]
                      : []
                  }
                  iconUrl="/vitals/oxygen.svg"
                  onPressEnter={() => {
                    setOpenOxygenForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  title="blood_preasure"
                  iconUrl="/vitals/blood_presure.svg"
                  vitalData={
                    !_.isEmpty(vitalsData?.data?.bloodPressure)
                      ? vitalsData?.data?.bloodPressure[
                          vitalsData?.data?.bloodPressure?.length - 1
                        ]
                      : []
                  }
                  onPressEnter={() => {
                    setOpenBloodPreasureForm(true);
                  }}
                />
              </Grid>
              <Grid
                item
                alignItems="stretch"
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={3}
              >
                <VitalCard
                  title="Symptoms"
                  iconUrl="/vitals/symptoms.svg"
                  onPressEnter={() => {
                    setOpenSymptomsForm(true);
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={2} mb={2} component="div" className="__f ooter">
            <VitalBackButton />
          </Box>
        </Fragment>
      )}

      {opeWeightForm && (
        <VitalWeightForm
          id={vitalsData?.data?._id}
          vitalData={vitalsData?.data?.weight || []}
          open={opeWeightForm}
          handleOnClose={() => {
            setOpenWeightForm(false);
          }}
        />
      )}
      {opeTemparatureForm && (
        <VitalTemparatureForm
          id={vitalsData?.data?._id}
          vitalData={vitalsData?.data?.temperature || []}
          open={opeTemparatureForm}
          handleOnClose={() => {
            setOpeTemparatureForm(false);
          }}
        />
      )}
      {openHeartRateForm && (
        <VitalHeartRateForm
          id={vitalsData?.data?._id}
          vitalData={vitalsData?.data?.heartRate || []}
          open={openHeartRateForm}
          handleOnClose={() => {
            setOpenHeartRateForm(false);
          }}
        />
      )}
      {openRespiratoryForm && (
        <VitalRespiratoryRateForm
          vitalData={vitalsData?.data?.respiratoryRate || []}
          id={vitalsData?.data?._id}
          open={openRespiratoryForm}
          handleOnClose={() => {
            setOpenRespiratoryForm(false);
          }}
        />
      )}
      {openOxygenForm && (
        <VitalOxygenForm
          vitalData={vitalsData?.data?.oxygenSaturation || []}
          id={vitalsData?.data?._id}
          open={openOxygenForm}
          handleOnClose={() => {
            setOpenOxygenForm(false);
          }}
        />
      )}
      {openBloodPreasureForm && (
        <VitalBloodPreasureForm
          vitalData={vitalsData?.data?.bloodPressure || []}
          id={vitalsData?.data?._id}
          open={openBloodPreasureForm}
          handleOnClose={() => {
            setOpenBloodPreasureForm(false);
          }}
        />
      )}
      {openSymptomsForm && (
        <VitalSymptomForm
          vitalData={vitalsData?.data?.symptoms || []}
          id={vitalsData?.data?._id}
          open={openSymptomsForm}
          handleOnClose={() => {
            setOpenSymptomsForm(false);
          }}
        />
      )}
    </StyledPatientVitals>
  );
};

export default PatientVitals;
