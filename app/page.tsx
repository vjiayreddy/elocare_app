import { getServerSession } from "next-auth";
import authOptions from "./api/auth/[...nextauth]/utils/authOptions";
import { LOGIN_TYPE } from "@/ts/enum";
import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/utils/routes";

const HomePage = async () => {
  const authSession = await getServerSession(authOptions);
  if (authSession && authSession?.user?.role === LOGIN_TYPE.CLINICIAN) {
    return redirect(APP_ROUTES.CLINICIAL_HOME);
  }
  if (authSession && authSession?.user?.role === LOGIN_TYPE.PATIENT) {
    return redirect(APP_ROUTES.PATIENT_HOME);
  }
  if (!authSession) {
    return redirect(APP_ROUTES.WELCOME);
  }
  return <div />;
};

export default HomePage;
