export type MembersType = {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  export type protocolType = {
    _id: string;
    title: string;
    description: string;
    bannerImage: string;
    members: MembersType[];
    startDate: string;
    endDate: string;
  };
  
  export type DoctorType = {
    _id: string;
  };
  
  export type AssessmentType = {
    bannerImage: string;
    description: string;
    label: string;
    title: string;
    surveyRecordData?:any;
    _id: string;
  };
  