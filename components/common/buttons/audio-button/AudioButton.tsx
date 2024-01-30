import React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const StyledAudioRecordButton = styled(Box)(({ theme }) => ({
  height: 50,
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 100,
  marginBottom: 20,
  position: "relative",
  [theme.breakpoints.up("sm")]: {
    height: 60,
  },
  "& img": {
    width: 40,
    height: 40,
    [theme.breakpoints.up("sm")]: {
      width: 50,
      height: 50,
    },
  },
  "& .MuiTypography-body2": {
    [theme.breakpoints.up("sm")]: {
      fontSize: 20,
    },
  },
}));

interface AudioRecordButtonProps {
  onClick?: () => void;
}

const AudioRecordButtonComponent = ({ onClick }: AudioRecordButtonProps) => {
  return (
    <StyledAudioRecordButton onClick={onClick}>
      <Box mt={1} ml={0.6}>
        <img className="img" alt="audio-icon" src="/icons/audio_button.svg" />
      </Box>
      <Box flexGrow={1}>
        <Typography variant="body2" textAlign="center">
          Tap to record audio response
        </Typography>
      </Box>
      <Box mt={1} mr={0.6}>
        <img
          style={{
            opacity: 0,
          }}
          className="img"
          alt="audio-icon"
          src="/icons/audio_button.svg"
        />
      </Box>
    </StyledAudioRecordButton>
  );
};

export default AudioRecordButtonComponent;
