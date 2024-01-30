"use client";
import React, { Fragment } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { APP_BAR_SIZE, BOTTOM_NAVIGATION_SIZE } from "@/utils/constants";
import { ThreeDots } from "react-loader-spinner";
import HomeBottomNavigation, {
  BottomNavigationComponentProps,
} from "./BottomNavigation";
import { shouldForwardProp } from "@/utils/func";
import { APP_COLORS } from "@/theme/colors/colors";
import UserAppBarComponent from "@/components/common/app-bar/UserAppBar";
import Container from "@mui/material/Container";

interface UserHomeLayoutProps {
  children: React.ReactNode;
  bottomNavigationProps?: BottomNavigationComponentProps;
  loading?: boolean;
  showAppBar?: boolean;
  showBottomNavigation?: boolean;
}
const StyledUserHomeLayoutContent = styled(Box, {
  shouldForwardProp: (prop) =>
    shouldForwardProp<{ showAppBar: boolean; showBottomNavigation: boolean }>(
      ["showAppBar", "showBottomNavigation"],
      prop
    ),
})<{ showAppBar: boolean; showBottomNavigation: boolean }>(
  ({ showAppBar, showBottomNavigation }) => ({
    ...(showAppBar &&
      showBottomNavigation && {
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE}px)`,
        paddingTop: APP_BAR_SIZE,
      }),
    ...(showAppBar &&
      !showBottomNavigation && {
        height: `calc(100vh)`,
        paddingTop: APP_BAR_SIZE,
      }),
    ...(!showAppBar &&
      showBottomNavigation && {
        paddingTop: 20,
        height: `calc(100vh - ${BOTTOM_NAVIGATION_SIZE}px)`,
      }),
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    paddingBottom: 20,
    ...(!showAppBar &&
      !showBottomNavigation && {
        height: `calc(100vh)`,
        paddingBottom: 0,
      }),
    "& .__loading_indicator": {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

const UserHomeLayout = ({
  children,
  loading,
  bottomNavigationProps,
  showAppBar = true,
  showBottomNavigation = true,
}: UserHomeLayoutProps) => {
  return (
    <Fragment>
      {showAppBar && <UserAppBarComponent />}
      <Container maxWidth="xl">
        <StyledUserHomeLayoutContent
          showAppBar={showAppBar}
          showBottomNavigation={showBottomNavigation}
        >
          {loading && (
            <Box component="div" className="__loading_indicator">
              <ThreeDots
                height="40"
                width="40"
                radius="9"
                color={APP_COLORS.PRIMARY_COLOR}
                ariaLabel="loading"
                wrapperStyle={{}}
                visible={true}
              />
            </Box>
          )}
          {!loading && <>{children}</>}
        </StyledUserHomeLayoutContent>
      </Container>

      {showBottomNavigation && (
        <HomeBottomNavigation {...bottomNavigationProps} />
      )}
    </Fragment>
  );
};

export default UserHomeLayout;
