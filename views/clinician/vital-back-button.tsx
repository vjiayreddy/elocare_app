import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/redux/routes/apiRoutes";

const StyledScheduleVitalSign = styled(Box)(({ theme }) => ({
  width: "100%",
  minHeight: 90,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 5,
  backgroundColor: theme.palette.primary.main,
  "& .MuiTypography-h6": {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  "& .MuiSvgIcon-root": {
    color: theme.palette.common.white,
    marginTop: 8,
    marginRight: 8,
  },
}));

const VitalBackButton = () => {
  const router = useRouter();

  const handleNavigation = () => {
    router.back();
  };
  return (
    <StyledScheduleVitalSign onClick={handleNavigation}>
      <Box>
        <ArrowBackIosNewIcon />
      </Box>
      <Box>
        <Typography variant="h6">Back to main screen</Typography>
      </Box>
    </StyledScheduleVitalSign>
  );
};

export default VitalBackButton;
