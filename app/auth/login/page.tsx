"use client";
import React, { useEffect, useState } from "react";
import FormTextInputField from "@/components/common/form-fields/form-text-input/FormTextInput";
import {
  Box,
  Container,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import { useForm } from "react-hook-form";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LoadingButtonComponent from "@/components/common/buttons/loading-button/LoadingButton";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";
import { LOGIN_TYPE } from "@/ts/enum";

const StyledLoginPageView = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiTypography-h1": {
    textAlign: "center",
    [theme.breakpoints.only("xs")]: {
      fontSize: 25,
      marginTop: 20,
      marginBottom: 10,
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: 30,
      marginTop: 30,
      marginBottom: 10,
    },
  },
  "& .MuiFormLabel-root": {
    fontWeight: 600,
  },
  "& .MuiButtonBase-root": {
    borderRadius: 5,
  },
  "& a": {
    textDecoration: "none",
  },
}));
const LoginPage = () => {
  // router
  const router = useRouter();
  // State
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [loginAs, setLoginAs] = useState<any>("");
  // Hooks Form
  const { control, handleSubmit } = useForm({ mode: "all" });

  // handle toggle password
  const hadleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // handle sign
  const onSubmit = async (data: any) => {
    const LOGIN_AS = Cookies.get("LOGIN_AS");
    setIsSubmit(true);
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      loginAs: LOGIN_AS,
      redirect: false,
    });
    if (response?.error) {
      setIsSubmit(false);
      toast.error(response?.error);
    } else {
      setIsSubmit(false);
      if (LOGIN_AS === LOGIN_TYPE.CLINICIAN) {
        router.push(APP_ROUTES.CLINICIAL_HOME);
      } else {
        router.push(APP_ROUTES.PATIENT_HOME);
      }
    }
  };

  useEffect(() => {
    if (Cookies.get("LOGIN_AS")) {
      setLoginAs(Cookies.get("LOGIN_AS"));
    }
  }, []);

  return (
    <StyledLoginPageView>
      <Container maxWidth="xs">
        <Grid container alignItems="stretch" justifyContent="center">
          <Grid item sx={{ textAlign: "center" }}>
            <img alt="truefeel" src="/logos/truefeel.png" />
          </Grid>
          <Grid item>
            <Typography textAlign="center" variant="h1">
              Sign-in to your account
            </Typography>
            <Typography variant="body1" textAlign="center">
              Welcome back! You are signing in as a {loginAs}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Grid
            container
            spacing={1}
            alignItems="stretch"
            justifyContent="center"
            direction="column"
          >
            <Grid item>
              <Box mb={1}>
                <FormLabel>Email</FormLabel>
              </Box>
              <FormTextInputField
                id="email"
                control={control}
                name="email"
                label=""
                defaultValue=""
                textFieldProps={{
                  fullWidth: true,
                  size: "small",
                }}
              />
            </Grid>
            <Grid item>
              <Box mb={1}>
                <FormLabel>Password</FormLabel>
              </Box>
              <FormTextInputField
                control={control}
                id="password"
                name="password"
                label=""
                defaultValue=""
                textFieldProps={{
                  fullWidth: true,
                  size: "small",
                  type: showPassword ? "text" : "password",
                  InputProps: {
                    endAdornment: (
                      <IconButton onClick={hadleTogglePassword}>
                        '{showPassword && <VisibilityIcon />}
                        {!showPassword && <VisibilityOffIcon />}
                      </IconButton>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid item>
              <Box mt={1}>
                <LoadingButtonComponent
                  disabled={isSubmit}
                  showLoading={isSubmit}
                  onClick={handleSubmit(onSubmit)}
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </LoadingButtonComponent>
              </Box>
            </Grid>
            <Grid item>
              <Typography mt={1} mb={3} textAlign="center">
                Not a patient? <Link href="#">Sign in as a clinician</Link>
              </Typography>
            </Grid>
            <Grid item>
              <Divider>New to TrueFeel?</Divider>
            </Grid>
            <Grid item>
              <Box mt={1}>
                <LoadingButtonComponent variant="contained" color="primary">
                  Create new account
                </LoadingButtonComponent>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </StyledLoginPageView>
  );
};

export default LoginPage;
