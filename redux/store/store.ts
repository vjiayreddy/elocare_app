"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "../api/auth";
import { patientApi } from "../api/patientApi";
import { clinicianApi } from "../api/clinicialApi";
import { assessmentApi } from "../api/assessmentsApi";
import { assessmentSlice } from "../reducers/assessmentSlice";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [clinicianApi.reducerPath]: clinicianApi.reducer,
  [assessmentApi.reducerPath]: assessmentApi.reducer,
  assessmentSlice: assessmentSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      patientApi.middleware,
      clinicianApi.middleware,
      assessmentApi.middleware,
    ]),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
