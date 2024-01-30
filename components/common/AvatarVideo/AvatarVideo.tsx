import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React, { Fragment, useEffect, useState } from "react";

interface AvatarVideoComponentProps {
  src: string;
  type: string;
  timer: string;
  handlePlayPauseClick: () => void;
  isPlaying: boolean;
  videoRef: React.MutableRefObject<HTMLVideoElement>;
}

const AvatarVideoComponent = ({
  src,
  type,
  timer,
  handlePlayPauseClick,
  isPlaying,
  videoRef,
}: AvatarVideoComponentProps) => {
  return (
    <Box component="div" className="__video_container">
      <Fragment>
        <video
          onEnded={() => {
            console.log("ended");
          }}
          style={{ objectFit: "cover" }}
          ref={videoRef}
        >
          <source src={src} type={type} />
        </video>
        <Box component="div" className="__action__button">
          {!isPlaying && (
            <IconButton
              sx={{ padding: 0 }}
              size="large"
              onClick={handlePlayPauseClick}
            >
              <img alt="play_icon" src="/icons/play_icon.svg" />
            </IconButton>
          )}
        </Box>
        <Box component="div" className="__timer">
          {timer}
        </Box>
      </Fragment>
    </Box>
  );
};

export default AvatarVideoComponent;
