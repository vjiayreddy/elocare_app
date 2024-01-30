"use client";
import React from "react";
import { Box, Container, IconButton, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useSession, signOut } from "next-auth/react";
import { LOGIN_TYPE } from "@/ts/enum";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";

const ClinicianAppBarComponent = () => {
  // Ref
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  // State
  const [open, setOpen] = React.useState(false);
  // Router
  const router = useRouter();

  // Handle toggle
  const handleToggle = () => {
    signOut();
    //setOpen((prevOpen) => !prevOpen);
  };
  const { data: session } = useSession();
  return (
    <AppBar
      sx={(theme) => ({
        borderBottom: `1px solid ${theme?.palette?.divider}`,
      })}
      position="fixed"
    >
      <Container disableGutters maxWidth="lg">
        <Toolbar>
          <Box flexGrow={1} marginTop="9px">
            <img alt="elocare" src="/logos/elocare.svg" />
          </Box>
          <Box>
            <IconButton
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              aria-controls={open ? "products-menu" : undefined}
              ref={anchorRef}
              onClick={handleToggle}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ClinicianAppBarComponent;
