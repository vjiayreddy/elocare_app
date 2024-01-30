import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IGenericResponse,
  UserLoginPayload,
  UserProfilePayload,
  UserRegistrationPayload,
  UserVerifyOtpPayload,
} from "../../ts/interface";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { API_ROUTES } from "../routes/apiRoutes";

export const updateSession = (session: Session, token: JWT) => {
  if (token) {
    session.user.id = token?.id as string;
    session.user.name = token?.firstName + " " + token?.lastName;
    session.user.firstName = token?.firstName as string;
    session.user.lastName = token?.lastName as string;
    session.user.mobileNumber = token?.mobileNumber as string;
    session.user.email = token?.email as string;
    session.user.gender = token?.gender as string;
    session.user.isEmailVerified = token?.isEmailVerified as boolean;
    session.user.isProfileCompleted = token?.isProfileCompleted as boolean;
    session.user.height = token?.height as number | null;
    session.user.weight = token?.weight as number | null;
    session.user.studyRecordId = token?.studyRecordId as string;
    session.user.studyId = token?.studyId as string;
    session.user.role = token?.role as string;
    session.user.clinician = token?.clinician as any;
  }
  return session;
};

export const updateToken = (token: JWT, user: User) => {
  if (token) {
    token.id = user.id;
    token.name = user?.firstName + " " + user?.lastName;
    token.email = user?.email;
    token.mobileNumber = user?.mobileNumber;
    token.firstName = user?.firstName;
    token.lastName = user?.lastName;
    token.isEmailVerified = user?.isEmailVerified;
    token.isProfileCompleted = user?.isProfileCompleted;
    token.dateOfBirth = user?.dateOfBirth;
    token.gender = user?.gender;
    token.height = user?.height;
    token.weight = user?.weight;
    token.studyRecordId = user?.studyRecordId;
    token.studyId = user?.studyId;
    token.role = user?.role;
    token.clinician = user?.clinician;
  }
  return token;
};

export const updateSingUpUserSession = (
  session: any,
  _updateSession: any,
  signUpData: any
) => {
  _updateSession({
    ...session,
    user: {
      ...session?.user,
      id: signUpData?.data?.patient?._id,
      email: signUpData?.data?.email,
      isEmailVerified: signUpData?.data?.patient?.isEmailVerified,
      isProfileCompleted: signUpData?.data?.isProfileCompleted,
    },
  });
};

export const updateSessionWhenClinicianSelectedUser = (
  session: any,
  _updateSession: any,
  clinician: any
) => {
  _updateSession({
    ...session,
    user: {
      ...session?.user,
      clinician: clinician,
    },
  });
};

export const userLogin = async (payload: UserLoginPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.LOGIN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    }
  );
  const data = await response.json();
  return data;
};

// clinicianLogin
export const clinicianLogin = async (payload: UserLoginPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.CLINICIAN_LOGIN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    }
  );
  const data = await response.json();
  return data;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation<IGenericResponse, UserRegistrationPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.REGISTER,
          method: "POST",
          body,
        };
      },
    }),
    verifyOtp: builder.mutation<IGenericResponse, UserVerifyOtpPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.VERIFY_OTP,
          method: "POST",
          body,
        };
      },
    }),
    sendOtp: builder.mutation<IGenericResponse, UserVerifyOtpPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.SEND_OTP,
          method: "POST",
          body,
        };
      },
    }),
    updateProfile: builder.mutation<
      IGenericResponse,
      { userId: string; body: UserProfilePayload }
    >({
      query: ({ userId, body }) => {
        return {
          url: `${API_ROUTES.UPDATE_PATIENT_PROFILE}/${userId}`,
          method: "PATCH",
          body,
        };
      },
    }),
  }),
});

export const {
  useSignUpUserMutation,
  useVerifyOtpMutation,
  useSendOtpMutation,
  useUpdateProfileMutation,
} = authApi;
