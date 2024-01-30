import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import _ from "lodash";
import { API_ROUTES } from "../routes/apiRoutes";
import {
  StartPatientDialyActivityPayload,
  StartRecordVitalActivityPayload,
  UpdateDialyVisitPayload,
  UpdateVitalActivityPayload,
} from "@/ts/interface";

export const clinicianApi = createApi({
  reducerPath: "clinicianApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ["startRecordPatientVitalActivity"],
  endpoints: (builder) => ({
    startRecordPatientDialyVisitActivity: builder.mutation<
      any,
      StartPatientDialyActivityPayload
    >({
      query: (body) => {
        return {
          url: API_ROUTES.CLINICIAN_PATIENT_DIALY_VISIT,
          method: "POST",
          body: body,
        };
      },
    }),
    startRecordPatientVitalActivity: builder.query<
      any,
      StartRecordVitalActivityPayload
    >({
      providesTags: ["startRecordPatientVitalActivity"],
      keepUnusedDataFor: 0,
      query: (body) => {
        return {
          url: API_ROUTES.CLINICIAN_PATIENT_VITAL_RECORD,
          method: "POST",
          body: body,
        };
      },
    }),
    fetchPatientVitalRecords: builder.mutation<
      any,
      StartRecordVitalActivityPayload
    >({
      query: (body) => {
        return {
          url: API_ROUTES.CLINICIAN_PATIENT_VITAL_RECORD,
          method: "POST",
          body: body,
        };
      },
    }),
    updatePatientVitalActivity: builder.mutation<
      any,
      UpdateVitalActivityPayload
    >({
      invalidatesTags: ["startRecordPatientVitalActivity"],
      query: ({ _id, payload }) => {
        return {
          url: `${API_ROUTES.CLINICIAN_PATIENT_VITAL_UPDATE}/${_id}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    updatePatientDailyVisit: builder.mutation<
      any,
      UpdateDialyVisitPayload
    >({
      query: ({ _id, payload }) => {
        return {
          url: `${API_ROUTES.CLINICIAN_PATIENT_UPDATE_DIALY_VISIT}/${_id}`,
          method: "PATCH",
          body: payload,
        };
      },
    }),

    filterPatients: builder.query({
      query: () => API_ROUTES.FILTER_PATIENTS,
      transformResponse: (response: any) => {
        if (response?.data?.length > 0) {
          const patients = _.filter(
            response?.data,
            (item: any) => item?.isEmailVerified
          );
          return {
            data: patients,
          };
        }
        return {
          data: [],
        };
      },
    }),
  }),
});

export const {
  useFilterPatientsQuery,
  useLazyFilterPatientsQuery,
  useStartRecordPatientDialyVisitActivityMutation,
  useLazyStartRecordPatientVitalActivityQuery,
  useFetchPatientVitalRecordsMutation,
  useUpdatePatientVitalActivityMutation,
  useUpdatePatientDailyVisitMutation
} = clinicianApi;
