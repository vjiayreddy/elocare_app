"use client";

import LoadingButtonComponent from "@/components/common/buttons/loading-button/LoadingButton";
import { LOGIN_TYPE } from "@/ts/enum";
import { APP_ROUTES } from "@/utils/routes";
import { Box, Container, Typography, styled } from "@mui/material";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Styled
const StyledHomeContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",

  [theme.breakpoints.only("xs")]: {
    fontSize: 25,
    marginTop: 20,
    marginBottom: 10,
  },

  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& img": {
    width: 200,
    [theme.breakpoints.only("xs")]: {
      width: 200,
    },
  },
  "& .MuiButtonBase-root": {
    borderRadius: 5,
  },
  "& .MuiTypography-h1": {
    textAlign: "center",
    [theme.breakpoints.only("xs")]: {
      fontSize: 25,
      marginTop: 20,
      marginBottom: 10,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 30,
      marginTop: 20,
      marginBottom: 10,
    },
  },
}));

const HomePage = () => {
  const router = useRouter();
  // Navigation
  const handleNavigation = (role: string) => {
    Cookies.set("LOGIN_AS", role);
    router.push(APP_ROUTES.LOGIN);
  };
  return (
    <StyledHomeContainer>
      <Container maxWidth="xs">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item sx={{ textAlign: "center" }}>
            <img alt="truefeel" src="/logos/truefeel.png" />
          </Grid>
          <Grid item>
            <Typography variant="h1">We're glad you're here!</Typography>
          </Grid>
          <Grid item>
            <LoadingButtonComponent
              onClick={() => {
                handleNavigation(LOGIN_TYPE.PATIENT);
              }}
              fullWidth={true}
            >
              Sign in patient
            </LoadingButtonComponent>
          </Grid>
          <Grid item>
            <LoadingButtonComponent
              variant="outlined"
              color="inherit"
              fullWidth={true}
              onClick={() => {
                handleNavigation(LOGIN_TYPE.CLINICIAN);
              }}
            >
              Sign in as Clinician
            </LoadingButtonComponent>
          </Grid>
        </Grid>
      </Container>
    </StyledHomeContainer>
  );
};

export default HomePage;
