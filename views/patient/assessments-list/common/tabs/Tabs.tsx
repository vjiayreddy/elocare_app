import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Box, styled } from "@mui/material";
import Grid from "@mui/material/Grid";

const StyledTabsComponent = styled(Grid)(({ theme }) => ({
  "& .__tab_wrapper": {
    height: 55,
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: 320,
  },
  "& .MuiTabs-root": {
    backgroundColor: theme.palette.grey[100],
    width: 310,
    borderRadius: 100,
  },
  "& .Mui-selected": {
    borderRadius: 100,
    backgroundColor: theme.palette.common.white,
    fontWeight: 600,
  },
  "& .MuiTab-root": {
    textTransform: "none",
  },
}));

interface TabsComponentProps {
  tabValue: string;
  onChangeTab: (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => void;
}

const TabsComponent = ({ onChangeTab, tabValue }: TabsComponentProps) => {
  return (
    <StyledTabsComponent container alignItems="center" justifyContent="center">
      <Grid item>
        <Box component="div" className="__tab_wrapper">
          <Tabs
            variant="fullWidth"
            value={tabValue}
            onChange={onChangeTab}
            TabIndicatorProps={{
              style: { display: "none" },
            }}
            centered
          >
            <Tab iconPosition="start" label="Avatar Mode" value="avatar-mode" />
            <Tab label="Text Mode" value="text-mode" />
          </Tabs>
        </Box>
      </Grid>
    </StyledTabsComponent>
  );
};

export default TabsComponent;
