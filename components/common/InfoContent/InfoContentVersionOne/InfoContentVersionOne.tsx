import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Button, ButtonProps, Typography } from "@mui/material";

const StyledInfoContentComponent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  "& .__image__wrapper": {},
}));

interface InfoContentVersionOneComponentProps extends BoxProps {
  imgUrl?: string;
  title: string;
  subTitle?: string;
  btnName: string;
  btnProps: ButtonProps;
}

const InfoContentVersionOneComponent = ({
  title,
  btnProps,
  btnName,
  subTitle,
  children,
  imgUrl,
  ...props
}: InfoContentVersionOneComponentProps) => {
  return (
    <StyledInfoContentComponent pl={8} pr={8} {...props}>
      <Box mb={1} component="div" className="__image__wrapper">
        <img src={imgUrl ? imgUrl : "/icons/congratulations.svg"} />
      </Box>
      <Box mt={1}>
        <Typography textAlign="center" variant="h1">
          {title}
        </Typography>
        <Typography mb={3} textAlign="center" variant="body1">
          {subTitle}
        </Typography>
      </Box>
      <Button {...btnProps}>{btnName}</Button>
    </StyledInfoContentComponent>
  );
};

export default InfoContentVersionOneComponent;
