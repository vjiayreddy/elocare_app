import Typography from "@mui/material/Typography";
import React, { Fragment } from "react";
import { useSession } from "next-auth/react";

const IntoContentComponent = () => {
  const { data: session } = useSession();
  return (
    <Fragment>
      <Typography textAlign="center" variant="h2">
        Welcome,{session?.user?.firstName}!
      </Typography>
    </Fragment>
  );
};

export default IntoContentComponent;
