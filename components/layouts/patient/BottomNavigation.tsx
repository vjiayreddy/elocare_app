import React from "react";
import BottomNavigation, {
  BottomNavigationProps,
} from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { styled } from "@mui/material/styles";

export interface BottomNavigationComponentProps extends BottomNavigationProps {}

const StyledBottomNavigationComponent = styled(BottomNavigation)(
  ({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    "& svg": {
      width: 20,
      height: 25,
    },
  })
);

const HomeBottomNavigation = ({ ...props }: BottomNavigationComponentProps) => {
  return (
    <StyledBottomNavigationComponent showLabels {...props}>
      <BottomNavigationAction label="Home" icon={<BiHomeAlt />} />
      <BottomNavigationAction
        label="Program"
        icon={<MdOutlineSpaceDashboard />}
      />
    </StyledBottomNavigationComponent>
  );
};

export default HomeBottomNavigation;
