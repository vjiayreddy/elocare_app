import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography, { TypographyProps } from "@mui/material/Typography";
import React from "react";

interface SectionTitlesOneProps {
  title: string;
  content: string | null;
  node?: React.ReactNode;
  titleProps?: TypographyProps;
  subTileProps?: TypographyProps;
}

const StyledTitleTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.only("xs")]:{
    fontSize:25
  },
  [theme.breakpoints.up("sm")]: {
    textAlign: "center",
  },
}));

const StyledSubTitleTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    textAlign: "center",
    fontSize: 20,
    lineHeight: "30px",
    marginBottom: 50,
  },
}));

const SectionTitlesOneComponent = ({
  title,
  content,
  node,
  titleProps,
  subTileProps,
}: SectionTitlesOneProps) => {
  return (
    <Box>
      <StyledTitleTypography mb={3} variant="h1" {...titleProps}>
        {title}
      </StyledTitleTypography>
      {content && (
        <StyledSubTitleTypography mb={3} variant="body1" {...subTileProps}>
          {content}
        </StyledSubTitleTypography>
      )}
      {node && <>{node}</>}
    </Box>
  );
};

export default SectionTitlesOneComponent;
