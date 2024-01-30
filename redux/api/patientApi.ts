import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import _ from "lodash";
import { API_ROUTES } from "../routes/apiRoutes";

export const patientApi = createApi({
  reducerPath: "patientsApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: [],
  endpoints: (builder) => ({
    filterPatients: builder.query({
      query: () => API_ROUTES.FILTER_PATIENTS,
      transformResponse: (response: any) => {
        if (response?.data?.length > 0) {
          const patients = _.filter(
            response?.data,
            (item: any) => item?.isEmailVerified
          );
          return {
            data:patients,
          };
        }
        return {
          data: [],
        };
      },
    }),
  }),
});

export const { useFilterPatientsQuery, useLazyFilterPatientsQuery } =
  patientApi;
