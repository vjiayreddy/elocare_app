import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { LOGIN_TYPE } from "@/ts/enum";
import {
  clinicianLogin,
  updateSession,
  updateToken,
  userLogin,
} from "@/redux/api/auth";
import { APP_ROUTES } from "@/utils/routes";
//import { updateSession, updateToken, userLogin } from "@/redux/api/authApi";
//import { APP_ROUTES } from "@/utils/routes";

const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials: any, _req) => {
        console.log(credentials);
        let response: any = {};
        if (credentials?.loginAs === LOGIN_TYPE.PATIENT) {
          response = await userLogin({
            email: credentials?.email,
            password: credentials.password,
          });
        }
        if (credentials?.loginAs === LOGIN_TYPE.CLINICIAN) {
          response = await clinicianLogin({
            email: credentials?.email,
            password: credentials.password,
          });
        }
        if (response?.status === "failure" && !response?.data) {
          throw new Error(response?.message);
        }

        return {
          id:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?._id
              : response?.data?.patient?._id,
          name:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.firstName +
                " " +
                response?.data?.doctor?.lastName
              : response?.data?.patient?.firstName +
                " " +
                response?.data?.patient?.lastName,
          firstName:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.firstName
              : response?.data?.patient?.firstName,
          lastName:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.lastName
              : response?.data?.patient?.lastName,
          email:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.email
              : response?.data?.patient?.email,
          mobileNumber:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.mobileNumber
              : response?.data?.patient?.mobileNumber,
          isEmailVerified:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.isEmailVerified
              : response?.data?.patient?.isEmailVerified,
          isProfileCompleted:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? false
              : response?.data?.patient?.isProfileCompleted,
          gender:
            credentials?.loginAs === LOGIN_TYPE.CLINICIAN
              ? response?.data?.doctor?.gender
              : response?.data?.patient?.gender,
          role: credentials?.loginAs,
        };
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token = updateToken(token, user);
      }
      if (trigger === "update") {
        if (session) {
          console.log(session)
          token = updateToken(token, session?.user);
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session = updateSession(session, token);
      }
      return session;
    },
  },
  pages: {
    signIn: APP_ROUTES.LOGIN,
  },
};

export default authOptions;
