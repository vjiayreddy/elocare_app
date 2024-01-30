"use client";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Typography, styled } from "@mui/material";
import { useSession } from "next-auth/react";
import UserCardComponent from "@/components/common/cards/user-card/UserCard";
import { useLazyFilterPatientsQuery } from "@/redux/api/patientApi";
import _ from "lodash";
import { AUTH_STATUS } from "@/utils/constants";
import ClinicianLayoutComponent from "@/components/layouts/clinician/Clinician";
import ConformationDialog from "@/components/common/dialogs/conformation/ConformationDialog";
import {useRouter} from "next/navigation"
import { APP_ROUTES } from "@/utils/routes";

const StyledClinicianContainer = styled(Box)(({ theme }) => ({
  paddingTop: 20,
  flexGrow: 1,
  position: "relative",
  "& .MuiTypography-h4": {
    fontWeight: 600,
  },
  "& .Loading_Indication": {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const ClinicianPage = () => {
  const { data: session, status, update } = useSession();
  // state

  const [open, setOpen] = useState<boolean>(false);
  const [selectedPatient, setSelecedPatient] = useState<any>(null);

  // Router
  const router = useRouter();

  // Redux
  const [filterPatients, { isFetching, isLoading, data: allPatients }] =
    useLazyFilterPatientsQuery();

  useEffect(() => {
    if (session?.user) {
      filterPatients({});
    }
  }, [session]);

  // handle update session

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleUpdateSession = () => {
    update({
      ...session,
      user: {
        ...session?.user,
        clinician: {
          user: {
            _id: selectedPatient?._id,
            firstName: selectedPatient?.firstName,
            lastName: selectedPatient?.lastName,
            email: selectedPatient?.email,
          },
        },
      },
    });
    handleToggle();
    router.push(APP_ROUTES.CLINICIAN_PATIENT_SCHEDULE)
  };

  return (
    <ClinicianLayoutComponent>
      <StyledClinicianContainer>
        <Grid container spacing={2}>
          {status === AUTH_STATUS.AUTHENTICATED && (
            <Grid item xs={12}>
              <Typography textAlign="center" variant="h4">
                Hi {session?.user?.firstName}!
              </Typography>
              <Typography textAlign="center" variant="body1">
                Select a patient below to get started.
              </Typography>
            </Grid>
          )}

          {!_.isEmpty(allPatients) && (
            <Grid item xs={12} container spacing={2}>
              {allPatients.data.map((parient) => (
                <Grid
                  item
                  sm={4}
                  xs={12}
                  md={3}
                  lg={3}
                  xl={3}
                  key={parient?._id}
                >
                  <UserCardComponent
                    {...parient}
                    onSelect={() => {
                      setSelecedPatient(parient);
                      setOpen(true);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        {isFetching && isLoading && (
          <Box component="div" className="Loading_Indication">
            Loading...
          </Box>
        )}
      </StyledClinicianContainer>
      <ConformationDialog
        open={open}
        handleOnCancel={handleToggle}
        handleOnClickNext={handleUpdateSession}
        handleOnClose={handleToggle}
      />
    </ClinicianLayoutComponent>
  );
};

export default ClinicianPage;
