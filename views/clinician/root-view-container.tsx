"use client";
import React from "react";
import { Container, styled } from "@mui/material";

interface RootContainerViewProps {
  children: React.ReactNode;
}

const StyledRootContainerView = styled(Container)(({ theme }) => ({
  display: "flex",
  paddingTop: 56,
  minHeight:"100vh",
  flexDirection: "column",
  [theme.breakpoints.up("sm")]: {
    paddingTop: 64,
  },
}));

const RootContainerView = ({ children }: RootContainerViewProps) => {
  return (
    <StyledRootContainerView maxWidth="lg">{children}</StyledRootContainerView>
  );
};

export default RootContainerView;
