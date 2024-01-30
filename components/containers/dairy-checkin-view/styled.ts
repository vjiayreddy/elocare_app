import { APP_COLORS } from "@/theme/colors/colors";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

export const StyledDairyCheckinView = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  "& .__header": {
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },

  "& .__ai_avatar_player": {
    "& .__video_container": {
      height: 200,
      borderRadius: 100,
      width: 200,
      overflow: "hidden",
      position: "relative",
      "& video": {
        width: "100%",
        height: "100%",
        position: "absolute",
      },
      "& .__timer": {
        color: theme.palette.common.white,
        zIndex: 2,
        position: "absolute",
        left: "45%",
        bottom: "10px",
      },
      "& .__action__button": {
        zIndex: 1,
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  },

  "& .__audio_visulazation": {
    marginTop: 20,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__main_content": {
    flexGrow: 1,
    overflowY: "auto",
    overflowX: "hidden",
    paddingTop: 0,
    paddingBottom: 24,
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
  },
  "& .__footer": {
    paddingTop: 24,
    "& .MuiButton-root": {
      height: 40,
      borderRadius: 5,
    },
    "& .Mui-disabled": {
      backgroundColor: APP_COLORS.DISABLED_BTN_COLOR,
      color: theme.palette.common.white,
    },
    "& .__info_view": {
      minHeight: 55,
      padding: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 100,
      width: "100%",
      marginBottom: 20,
      textAlign: "left",
      [theme.breakpoints.up("sm")]: {
        minHeight: 70,
        fontSize: 20,
        marginBottom: 0,

      },
    },
    [theme.breakpoints.up("sm")]: {
      width: 500,
      margin: "0 auto",
    },
    "& .icon": {
      height: 50,
      width: 50,
      [theme.breakpoints.up("sm")]: {
        height: 65,
        width: 65,
      },
    },
    "& .MuiTypography-body2": {
      [theme.breakpoints.up("sm")]: {
        fontSize: 20,
      },
    },
    "& .MuiButtonBase-root": {
      [theme.breakpoints.up("sm")]: {
        fontSize: 18,
        height: 55,
      },
    },
  },
  "& .__loading_indication": {
    position: "absolute",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette.common.white,
  },
}));
