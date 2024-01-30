"use client";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentQuestion: null,
};
export const assessmentSlice: any = createSlice({
  name: "assessmentSlice",
  initialState,
  reducers: {
    setCurrentAssessmentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
  },
});

export const { setCurrentAssessmentQuestion } = assessmentSlice.actions;

export default assessmentSlice.reducer;
