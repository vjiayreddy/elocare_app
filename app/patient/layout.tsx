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

const PatientLayout = async ({ children }: ClinicianLayoutProps) => {
  const authSession = await getServerSession(authOptions);
  if (authSession?.user?.role === LOGIN_TYPE.CLINICIAN) {
    return redirect(APP_ROUTES.CLINICIAL_HOME);
  }
  if (!authSession) {
    return redirect(APP_ROUTES.WELCOME);
  }
  return <Fragment>{children}</Fragment>;
};

export default PatientLayout;
