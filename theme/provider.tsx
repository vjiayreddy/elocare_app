"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, styled } from "@mui/material/styles";
import { NextAppDirEmotionCacheProvider } from "./emotion/catch";
import { lightTheme } from "./config/config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledMainContainer = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
}));

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{ fontSize: 14 }}
        />
        <StyledMainContainer>{children}</StyledMainContainer>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
};
export default MuiThemeProvider;
