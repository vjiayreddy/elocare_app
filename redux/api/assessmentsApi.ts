import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  CreateAssessmentQuestionPayload,
  FetchQuestionsParams,
  IGenericResponse,
  StartRecordStudyActivityPayload,
} from "../../ts/interface";
import _ from "lodash";
import {
  ASSESSMENTS_CATEGORIES,
  QUESTION_ANSWER_TYPE,
} from "@/utils/constants";
import { API_ROUTES } from "../routes/apiRoutes";
import { AssessmentType } from "@/ts/types";
import moment from "moment";

export const assessmentApi = createApi({
  reducerPath: "assessmentApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: [
    "assessmentsByProtocolId",
    "singleAssessmentById",
    "fetchQuestionByQuesCatId",
    "fetchOnboardingQuestions",
    "fetcHomeAssessmentQuestions",
    "fetchPatientResponse",
  ],
  endpoints: (builder) => ({
    fetchDashboardData: builder.query<any, { userId: string }>({
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let assessments: AssessmentType[] = [];
        let todaysAssessments: AssessmentType[] = [];
        let completedCount: any[] = [];
        let dialyNeedAssessments: AssessmentType[] = [];
        let diaryCheckings: any = {};
        const { data: fetchedAssessments } = (await fetchWithBQ(
          `${API_ROUTES.FETCH_PATIENT_SUDIES}/${_arg.userId}`
        )) as any;

        if (fetchedAssessments.error) {
          throw new Error(fetchedAssessments.error);
        } else {
          if (fetchedAssessments?.data) {
            fetchedAssessments?.data?.patientStudy.map((item: any) => {
              if (!_.isEmpty(item?.studyRecordData)) {
                if (item?.studyRecordData[0].status === "COMPLETED") {
                  completedCount.push(item);
                }
              }
            });

            dialyNeedAssessments = _.filter(
              fetchedAssessments?.data?.patientStudy,
              (assessment) => assessment?.isAsNeededAssessment === true
            );

            todaysAssessments = _.filter(
              fetchedAssessments?.data?.patientStudy,
              (assessment) => assessment?.isAsNeededAssessment !== true
            );

            fetchedAssessments?.data?.patientStudy.map((item: any) => {
              assessments.push({
                _id: item?._id,
                title: item.title,
                label: item?.label,
                bannerImage: item?.bannerImage,
                description: item?.description,
                surveyRecordData: item?.surveyRecordData,
              });
            });
          }
        }

        return {
          data: {
            completedCount: completedCount.length || 0,
            assessments,
            diaryCheckings,
            todaysAssessments,
            dialyNeedAssessments,
          },
        };
      },
    }),
    fetchPatientResponse: builder.query<any, any>({
      query: (body: any) => {
        return {
          url: API_ROUTES.FETCH_PATIENT_RESPONSE,
          method: "GET",
          params: {
            ...body,
          },
        };
      },
      transformResponse: (response: any) => {
        let formInputValues: any = {};
        let selectedSentimentDes = null;
        if (response?.data?.length > 0) {
          response?.data?.map((item: any, index: number) => {
            let options: string[] = [];
            let subQuestions: string[] = [];

            if (item?.response?.options?.length > 0) {
              item?.response?.options?.map((opt: any) => {
                options.push(opt?.optionId);
              });
            }
            if (item?.response?.options?.length > 0) {
              if (
                item?.response?.responseType ===
                QUESTION_ANSWER_TYPE.MULTI_SELECTION
              ) {
                formInputValues[
                  `${item?.question?.questionId}${item?.response?.responseType}`
                ] = options;
              } else {
                formInputValues[
                  `${item?.question?.questionId}${item?.response?.responseType}`
                ] = options[0];
              }
            } else if (item?.response?.text) {
              formInputValues[
                `${item?.question?.questionId}${item?.response?.responseType}`
              ] = item?.response?.text;
            }

            if (
              item?.response?.responseType ===
              QUESTION_ANSWER_TYPE.EMOJI_SENTIMENTS
            ) {
              if (item?.response?.options?.length > 0) {
                selectedSentimentDes = item?.response?.options?.[0];
              }
            }

            if (!_.isEmpty(item?.subQuestionResponse)) {
              item?.subQuestionResponse?.map((subQuestion: any) => {
                if (!_.isEmpty(subQuestion?.response?.options)) {
                  subQuestion?.response?.options?.map((opt: any) => {
                    subQuestions.push(opt?.optionId);
                  });
                }
                if (!_.isEmpty(subQuestion?.response?.options)) {
                  formInputValues[
                    `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                  ] = subQuestions[0];
                } else if (!_.isEmpty(subQuestion?.response?.text)) {
                  if (
                    subQuestion?.response?.responseType ===
                    QUESTION_ANSWER_TYPE.TIME
                  ) {
                    formInputValues[
                      `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                    ] = moment(
                      subQuestion?.response?.text,
                      "HH:mm:ss"
                    ).toISOString();
                  } else if (
                    subQuestion?.response?.responseType ===
                    QUESTION_ANSWER_TYPE.DATE
                  ) {
                    moment(
                      subQuestion?.response?.text,
                      "MM-DD-YYYY"
                    ).toISOString();
                  } else {
                    formInputValues[
                      `${subQuestion?.question?.questionId}${subQuestion?.response?.responseType}`
                    ] = subQuestion?.response?.text;
                  }
                }
              });
            }
          });
        }
        return {
          formInputValues,
          selectedSentimentDes,
        };
      },
      keepUnusedDataFor: 0,
      providesTags: ["fetchPatientResponse"],
    }),
    savePatientResponse: builder.mutation<any, any>({
      query: (body: any) => {
        return {
          url: API_ROUTES.SAVE_PATIENT_RESPONSE,
          method: "POST",
          body,
        };
      },
    }),

    updateAssessmentQuestion: builder.mutation<
      IGenericResponse,
      { questionId: string; payload: CreateAssessmentQuestionPayload }
    >({
      query: ({ payload, questionId }) => {
        return {
          url: `${API_ROUTES.UPDATE_SURVEY_QUESTION}/${questionId}`,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags: ["singleAssessmentById"],
    }),
    fetchOnboardingQuestions: builder.query<any, FetchQuestionsParams>({
      providesTags: ["fetchOnboardingQuestions"],
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        let onboardingQuestionsData: any = null;
        let studyData: any = null;
        let emojiData: any[] = [];
        const _fetchOnboardingQuestionsData = await fetchWithBQ({
          url: API_ROUTES.FETCH_SINGLE_SURVEY_QUESTIONS,
          params: {
            ..._arg,
          },
        });
        const getIndex = (value: number, data: any) => {
          const _findStateOneIndex = _.findIndex(data, (item: any) => {
            if (item?.stage === value) {
              return true;
            } else if (item?.stage === value) {
              return true;
            }
          });
          return _findStateOneIndex;
        };

        if (_fetchOnboardingQuestionsData.error) {
          throw _fetchOnboardingQuestionsData.error;
        } else {
          const { data } = _fetchOnboardingQuestionsData?.data as any;
          const { questions } = data;
          onboardingQuestionsData = questions;
          studyData = data?.studyData;
        }

        if (
          studyData?.assessmentTemplateData?._id ===
          ASSESSMENTS_CATEGORIES.DAIRY_CHECKEN
        ) {
          const _fetchEmojiData = await fetchWithBQ(API_ROUTES.FETCH_EMOJIS);
          if (_fetchEmojiData.error) {
            throw _fetchEmojiData?.error;
          } else {
            const { data: emojiesData } = _fetchEmojiData?.data as any;
            emojiData = emojiesData;
            const _findStateOneIndex = getIndex(1, onboardingQuestionsData);
            const _findStateTwoIndex = getIndex(2, onboardingQuestionsData);
            if (_findStateOneIndex !== -1) {
              onboardingQuestionsData[_findStateOneIndex]["emojies"] =
                emojiesData;
            }
            if (_findStateTwoIndex) {
              onboardingQuestionsData[_findStateTwoIndex]["stage_1_qus_id"] =
                onboardingQuestionsData[_findStateOneIndex]._id;
              onboardingQuestionsData[_findStateTwoIndex]["emojies"] =
                emojiesData;
            }
          }
        }

        return {
          data: {
            onboardingQuestionsData,
            totalSteps: onboardingQuestionsData?.length || 0,
            studyData: studyData?.assessmentTemplateData || null,
            emojiData,
          },
        };
      },
      keepUnusedDataFor: 0,
    }),

    startRecordSurvey: builder.mutation<any, StartRecordStudyActivityPayload>({
      query: (body) => {
        return {
          url: API_ROUTES.START_RECORD_STUDY_ACTIVITY,
          method: "POST",
          body: body,
        };
      },
    }),
    getSignedUploadUrl: builder.mutation<
      any,
      { fileName: string; contentType: string; userId: string }
    >({
      query: (body) => {
        return {
          url: API_ROUTES.GET_S3_SIGNED_UPLOAD_URL,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const {
  useLazyFetchPatientResponseQuery,
  useUpdateAssessmentQuestionMutation,
  useLazyFetchOnboardingQuestionsQuery,
  useStartRecordSurveyMutation,
  useGetSignedUploadUrlMutation,
  useLazyFetchDashboardDataQuery,
  useSavePatientResponseMutation,
} = assessmentApi;
