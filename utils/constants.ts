export const APP_BAR_SIZE = 56;
export const BOTTOM_NAVIGATION_SIZE = 56;
export const BRAND_NAME = "True Feel";
export const drawerWidth = 220;
export const mobileStepperHeight = 46.75;
export const S3_URL = "https://truefeel.s3.ap-south-1.amazonaws.com";
export const NO_ASSESSMENTS_FOUND = "No Assessments Found";

export const AUTH_API_STATUS = {
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  PROFILE_UPDATED_SUCCESS_MESSAGE: "Profile updated successfully!",
  PROFILE_NOT_UPDATED: "Profile update failed. Please try again later",
  PASSWORD_NOT_MATCHED: "Password does not match",
  OTP_VERIFICATION_SUCCESS:
    "Congratulations! Your email has been successfully verified. Your account is now fully activated",
  OTP_VERIFICATION_FAILED:
    "Oops! The OTP you entered is incorrect or has expired. Please double-check the code and make sure it's the latest one sent to your registered email address",
  USER_EMAIL_EXIST:
    "This email address is already in use. If you have an account, please log in",
  SERVICE_UNAVAILABLE:
    "We're experiencing a temporary issue, and our service is currently unavailable. Please try again shortly.",
  USER_REGISTRAION_SUCCESSFULL: "User registered successfully",
  PROTOCOL_REGISTRED_SUCCESSFULL: "Protocol created successfully",
  PROTOCOL_UPDATED_SUCCESSFULL: "Protocol Updated successfully",
  ASSESSMENT_CREATED_SUCCESSFULL: "Assessment created successfully",
  ASSESSMENT_UPDATED_SUCCESSFULL: "Assessment created successfully",
  ASSESSMENT_QUESTION_CREATED_SUCCESSFULL:
    "Created Assessment question successfully",
  USER_PASSWORD_NOT_MATCHED:
    "Oops! The passwords entered do not match. Please ensure that both passwords are identical and try again",
  USER_NOT_FOUND_MESSAGE:
    "Oops! We couldn't find an account associated with the provided information. Please double-check your email and try again.",
};

export const AUTH_STATUS = {
  AUTHENTICATED: "authenticated",
  LOADING: "loading",
  UNAUTHENTICATED: "unauthenticated",
  FETCH_ERROR: "FETCH_ERROR",
};

export const ASSESSMENT_QUES_TYPES_LIST = {
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  SINGLE_SELECTION: "SINGLE_SELECTION",
  MULTIPLE_SELECTION: "MULTIPLE_SELECTION",
  RATING: "RATING",
  EMOJI_RATING: "EMOJI_RATING",
  TEXT: "TEXT",
};

export const ASSESSMENT_TYPES = [
  {
    label: "Audio",
    value: "AUDIO",
  },
  {
    label: "Video",
    value: "VIDEO",
  },
  {
    label: "Manual Input",
    value: "MANUAL_INPUT",
  },
];

export const GENDER = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
];

export const DAIRY_CHECK_IN_ID = "6562f34341356a114762ce95";
export const ON_BOARDING_QUSTION_CATEGORY_ID = "64f30aaaf1ccbe284fcf6e9f";
export const ON_BOARDING_SURVEY_ID = "654f2fe6b6111de780bfa310";
export const ON_BOARDING_PROTOCOL_ID = "652d1bd4cff7140f374679e2";
export const QUES_CAT_ID = "652d1bd4cff7140f374679e2";
export const DEFAULT_DATE_FORMATE = "DD-MM-YYYY";

export const AG_GRID_COLUMN_DEF = [
  {
    field: "patientName",
    headerName: "Patient Name",
    initialPinned: "left",
    initialSort: "asc",
    sortable: true,
    width: 170,
  },
  {
    field: "mrn",
    headerName: "MRN",
    initialPinned: "left",
    initialSort: "asc",
    width: 120,
    sortable: true,
  },
  {
    field: "dob",
    headerName: "Age(DOB)",
    width: 175,
  },
  {
    field: "sex",
    headerName: "Sex",
    width: 30,
  },
  {
    field: "irbNumber",
    headerName: "IRB Number",
  },
  {
    field: "sponsorId",
    headerName: "Sponsor ID",
  },
  {
    field: "consentDate",
    headerName: "Consent Date",
  },
  {
    field: "lastStudyVisit",
    headerName: "Last Study Visit",
  },
  {
    field: "nextStudyVisit",
    headerName: "Next Study Visit",
  },
  {
    field: "status",
    headerName: "Status",
  },
  {
    field: "studyArm",
    headerName: "Study Arm",
  },
];

export const AG_GRID_ROW_DATA = [
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
  {
    patientName: "Smith Jhon",
    mrn: 56789,
    dob: "65y (04/17/1958)",
    sex: "M",
    irbNumber: "12-1234",
    sponsorId: "123456",
    consentDate: "01/05/2021",
    lastStudyVisit: "01/05/2021",
    nextStudyVisit: "01/10/2022",
    status: "On-Treatment",
    studyArm:
      "A Randomized, Double-Blind, Single Center, Phase 2, Efficacy and Safety Study of Autologous HB-adMSC vs Placebo for the treatment of Patients with Parkinson’s disease.",
  },
];

export const sampleAssessments = [
  {
    icon: "/assets/images/icons/assessments/1.svg",
    label: "Welcome Screen",
    caption: "Welcome Screen",
  },
  {
    icon: "/assets/images/icons/assessments/2.svg",
    label: "Unified Parkinson's Disease Rating Scale (UPDRS)",
    caption: "Functional Assessment",
  },
  {
    icon: "/assets/images/icons/assessments/3.svg",
    label: "Baseline Voice Data Collection",
    caption: "Voice assessment",
  },
  {
    icon: "/assets/images/icons/assessments/4.svg",
    label: "Adverse event reporting",
    caption: "Safety and efficacy assessment",
  },
  {
    icon: "/assets/images/icons/assessments/5.svg",
    label: "Memory assessment",
    caption: "Memory Assessment",
  },
  {
    icon: "/assets/images/icons/assessments/6.svg",
    label: "Gait balance",
    caption: "Functional Assessment",
  },
];

export const SURVEY_STATUS: any = {
  ON_GOING: "On Going",
};

export const QUESTION_ANSWER_TYPE = {
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  SINGLE_SELECTION: "SINGLE_SELECTION",
  MULTIPLE_SELECTION: "MULTIPLE_SELECTION",
  MULTI_SELECTION: "MULTI_SELECTION",
  RATING: "RATING",
  EMOJI_RATING: "EMOJI_RATING",
  BOOLEAN: "BOOLEAN",
  TEXT: "TEXT",
  INTRODUCTION: "INTRODUCTION",
  EMOJI_SENTIMENTS: "EMOJI_SENTIMENTS",
  AI_AVATAR: "AI_AVATAR",
  DATE_TIME: "DATE_TIME",
  DATE: "DATE",
  TIME: "TIME",
  SIGNATURE: "SIGNATURE",
};

export const ASSESSMENTS_CATEGORIES = {
  DAIRY_CHECKEN: "6560b5041dcbda25522345e0",
  DAIRY_CHECKEN_AI_AVATAR: "65a8c8afba4bb75d64fd3f8d",
  AUDIO: "6560b2df5fe718b843be9d21",
  VIDEO: "6560b359f70c4a880a33489d",
};

export const SYMPTOMS = [
  {
    label: "Diarrea",
  },
  {
    label: "Stomach pain",
  },
  {
    label: "Back ache",
  },
  {
    label: "Nausea",
  },
  {
    label: "Dizziness",
  },
  {
    label: "Other",
  },
];
