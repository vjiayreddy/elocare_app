import React, { useRef, useState } from "react";
import { Box, IconButton, styled } from "@mui/material";
;

const StyledVideoPlayer = styled(Box)(({ theme }) => ({
  height: 180,
  width: 320,
  borderRadius: 10,
  overflow: "hidden",
  position: "relative",
  "& video": {
    width: "100%",
    position: "absolute",
  },
  "& .__action__button": {
    zIndex: 1,
    position: "absolute",
    right: 10,
    bottom: 10,
    "& .MuiSvgIcon-root": {
      color: theme.palette.common.white,
      height: 25,
      width: 25,
    },
  },
}));

interface VideoPlayerProps {
  videoSource: string;
  videoType: string;
}

const VideoPlayer = ({ videoSource, videoType }: VideoPlayerProps) => {
  const video = useRef<HTMLVideoElement>(null!);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const pauseVideo = () => {
    if (video?.current) {
      setIsVideoPaused(false);
      video.current.pause();
    }
  };

  const playVideo = () => {
    if (video?.current) {
      setIsVideoPaused(true);
      video.current.play();
    }
  };

  return (
    <StyledVideoPlayer>
      <video
        onEnded={() => {
         setIsVideoPaused(false);
        }}
        ref={video}
        autoPlay={false}
        muted
        loop={false}
      >
        <source src={videoSource} type={videoType} />
      </video>
      <Box component="div" className="__action__button">
        {isVideoPaused && (
          <IconButton size="large" sx={{ padding: 0 }} onClick={pauseVideo}>
            <img
              width={30}
              height={30}
              alt="play_icon"
              src="/assets/images/paused_record.svg"
            />
          </IconButton>
        )}
        {!isVideoPaused && (
          <IconButton sx={{ padding: 0 }} size="large" onClick={playVideo}>
            <img
              width={30}
              height={30}
              alt="play_icon"
              src="/assets/images/icons/play_icon.svg"
            />
          </IconButton>
        )}
      </Box>
    </StyledVideoPlayer>
  );
};

export default VideoPlayer;
