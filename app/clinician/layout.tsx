import AppBarComponent from "@/components/common/app-bar/ClinicianAppBar";
import RootContainerView from "@/views/clinician/root-view-container";
import { getServerSession } from "next-auth/next";
import React, { Fragment } from "react";
import authOptions from "../api/auth/[...nextauth]/utils/authOptions";
import { LOGIN_TYPE } from "@/ts/enum";
import { APP_ROUTES } from "@/utils/routes";
import { redirect } from "next/navigation";

interface ClinicianLayoutProps {
  children: React.ReactNode;
}

const Clinicianlayout = async ({ children }: ClinicianLayoutProps) => {
  const authSession = await getServerSession(authOptions);
  if (authSession?.user?.role === LOGIN_TYPE.PATIENT) {
    return redirect(APP_ROUTES.PATIENT_HOME);
  }
  if(!authSession){
    return redirect(APP_ROUTES.HOME);
  }
  return (
    <Fragment>
      <AppBarComponent />
      <RootContainerView>{children}</RootContainerView>
    </Fragment>
  );
};

export default Clinicianlayout;
