import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Checkbox, Typography } from "@mui/material";
import { shouldForwardProp } from "@/utils/func";

const StyledCheckBoxComponent = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<StyledCheckBoxComponentProps>(["isSelected"], prop),
})<StyledCheckBoxComponentProps>(({ theme, isSelected }) => ({
  border: `1px solid ${theme.palette.divider}`,
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  width: "100%",
  borderRadius: 8,
  padding: 8,
  ...(isSelected && {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.secondary.light,
  }),

  "& .__radio_dot": {
    width: 20,
    height: 20,
    borderRadius: 5,
    border: `2px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    ...(isSelected && {
      border: `2px solid ${theme.palette.primary.main}`,
    }),

    "& .__selected": {
      minWidth: 10,
      minHeight: 10,
      border: `2px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 5,
    },
  },
}));

interface StyledCheckBoxComponentProps {
  isSelected?: boolean;
}
interface CheckBoxButtonComponentProps extends StyledCheckBoxComponentProps {
  label: string;
}

const CusCheckBoxButtonComponent = ({
  isSelected,
  label,
}: CheckBoxButtonComponentProps) => {
  return (
    <StyledCheckBoxComponent isSelected={isSelected}>
      <Box component="div" className="__radio_dot">
        {isSelected && <Checkbox checked={true}/>}
      </Box>
      <Box ml={2}>
        <Typography
          sx={(theme) => ({
            color: isSelected
              ? theme.palette.primary.main
              : theme?.palette?.text.primary,
          })}
          variant="body1"
        >
          {label}
        </Typography>
      </Box>
    </StyledCheckBoxComponent>
  );
};

export default  CusCheckBoxButtonComponent;
