"use client";
import React from "react";
import { Box, Container, Hidden, IconButton, Toolbar } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { useSession, signOut } from "next-auth/react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useRouter } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import UserGreeting from "./Greetings";

const UserAppBarComponent = () => {
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
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box flexGrow={1} marginTop="9px">
            <Hidden only={["xs"]}>
              <UserGreeting />
            </Hidden>
          </Box>
          <Box>
            <IconButton
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              aria-controls={open ? "products-menu" : undefined}
              ref={anchorRef}
              onClick={handleToggle}
            >
              <FiSettings />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UserAppBarComponent;
