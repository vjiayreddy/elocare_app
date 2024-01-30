import NextAuth, { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    firstName?: string;
    role?: string;
    lastName?: string;
    mobileNumber?: string;
    gender?: string;
    address?: string;
    isEmailVerified?: boolean;
    studyRecordId?: string;
    studyId?: string;
    token?: string;
    isProfileCompleted?: boolean;
    dateOfBirth?: string;
    height?: number | null;
    weight?: number | null;
    clinician?: {
      user: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        vitalRecordedId?: string;
        scheduledStepsId?: string;
        dailyPatientVisitId?: string;
      };
    };
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      mobileNumber?: string;
      email: ?string;
      gender?: string;
      address?: string;
      isEmailVerified?: boolean;
      token?: string;
      isProfileCompleted?: boolean;
      dateOfBirth?: string;
      height?: number | null;
      weight?: number | null;
      studyRecordId?: string;
      studyId?: string;
      role?: string;
      clinician?: {
        user: {
          _id?: string;
          firstName?: string;
          lastName?: string;
          email?: string;
          scheduledStepsId?: string;
          dailyPatientVisitId?: string;
        };
      };
    };
  }
}
