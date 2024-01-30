import React from "react";
import { useSession } from "next-auth/react";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { getGreetingTime } from "@/utils/func";

const UserGreeting = () => {
  const { data: session } = useSession();

  return (
    <Typography variant="h1">
      {getGreetingTime(moment())}, {session?.user?.firstName}
    </Typography>
  );
};

export default UserGreeting;
