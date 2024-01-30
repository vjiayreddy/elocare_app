import { QUESTION_ANSWER_TYPE } from "@/utils/constants";
import _ from "lodash";
import moment from "moment";
import { Session } from "next-auth";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { LOGIN_TYPE } from "@/ts/enum";

export const getTodayAssessmentsPayload = (
  question: any,
  formData: any,
  session: Session
) => {
  let rootOptions: any[] = [];
  let rootTextAns = "";
  let rootQuesAnswerType: any = null;
  let rootQuestionId: any = null;
  let subQuestionAnswerTypes: any = [];
  let subQuesOptions: any[] = [];
  let subQuestionIds: any = [];

  Object.keys(formData).forEach((key) => {
    if (key.includes(question?._id)) {
      rootQuesAnswerType = key.replace(question?._id, "");
      rootQuestionId = key.replace(rootQuesAnswerType, "");
    }
    if (!_.isEmpty(question?.subQuestion)) {
      question?.subQuestion?.map((item: any) => {
        if (key.includes(item?._id)) {
          const subQuestionAnswerType = key.replace(item?._id, "");
          const subQuestionId = key.replace(subQuestionAnswerType, "");
          subQuestionIds.push(subQuestionId);
          subQuestionAnswerTypes.push(subQuestionAnswerType);
        }
      });
    }
  });

  if (
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.SINGLE_SELECTION ||
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.BOOLEAN ||
    rootQuesAnswerType === QUESTION_ANSWER_TYPE.MULTI_SELECTION
  ) {
    if (!_.isEmpty(question?.options)) {
      let _findSelectedOption = null;
      if (rootQuesAnswerType === QUESTION_ANSWER_TYPE.MULTI_SELECTION) {
        const _values = formData[`${rootQuestionId}${rootQuesAnswerType}`];
        _values?.map((v: string) => {
          _findSelectedOption = _.find(
            question?.options,
            (item) => item?._id === v
          );
          if (_findSelectedOption) {
            const { _id, optionValue, description } = _findSelectedOption;
            rootOptions.push({
              optionId: _id,
              optionValue: optionValue,
              description: description,
            });
          }
        });
      } else {
        _findSelectedOption = _.find(
          question?.options,
          (item) =>
            item?._id === formData[`${rootQuestionId}${rootQuesAnswerType}`]
        );
        if (_findSelectedOption) {
          const { _id, optionValue, description } = _findSelectedOption;
          rootOptions.push({
            optionId: _id,
            optionValue: optionValue,
            description: description,
          });
        }
      }
    }
  }
  if (rootQuesAnswerType === QUESTION_ANSWER_TYPE.TEXT) {
    rootTextAns = formData[`${rootQuestionId}${rootQuesAnswerType}`].toString();
  }

  if (!_.isEmpty(subQuestionIds)) {
    if (!_.isEmpty(question?.subQuestion)) {
      question?.subQuestion.map((subQus: any, index: number) => {
        if (subQuestionIds.includes(subQus._id)) {
          let subQuesAnswerText = null;
          const { _id, title, value, stage, unit } = subQus;

          if (subQuestionAnswerTypes[index] === QUESTION_ANSWER_TYPE?.TEXT) {
            subQuesAnswerText =
              formData[
                `${subQus._id}${subQuestionAnswerTypes[index]}`
              ].toString();
          } else if (
            subQuestionAnswerTypes[index] === QUESTION_ANSWER_TYPE?.TIME
          ) {
            subQuesAnswerText = moment(
              new Date(
                formData[`${subQus._id}${subQuestionAnswerTypes[index]}`]
              ),
              "HH:mm:ss"
            ).format("hh:mm A");
          } else if (
            subQuestionAnswerTypes[index] === QUESTION_ANSWER_TYPE?.DATE
          ) {
            console.log(subQus._id);
            console.log(formData);
            console.log(
              formData[`${subQus._id}${subQuestionAnswerTypes[index]}`]
            );
            console.log(
              moment(
                new Date(
                  formData[`${subQus._id}${subQuestionAnswerTypes[index]}`]
                )
              ).format("MM/DD/YYYY")
            );
            subQuesAnswerText = moment(
              new Date(
                formData[`${subQus._id}${subQuestionAnswerTypes[index]}`]
              )
            ).format("MM/DD/YYYY");
          }
          subQuesOptions.push({
            questionId: _id,
            questionTitle: title,
            questionValue: value,
            questionStage: stage,
            unit: unit,
            responseType: subQuestionAnswerTypes[index],
            text: subQuesAnswerText,
          });
        }
      });
    }
  }
  const uid =
    session?.user?.role === LOGIN_TYPE.CLINICIAN
      ? session?.user?.clinician?.user?._id
      : session?.user?.id;
  const finalPayload = {
    patientId: uid as string,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    unit: question?.unit,
    responseType: rootQuesAnswerType,
    text: rootTextAns,
    filePath: "",
    options: rootOptions,
    isLastQuestion: false,
    hasSubQuestionResponse: question?.hasSubQuestion,
    subQuestionResponse: subQuesOptions,
  };

  return finalPayload;
};

export const getOnboardingDataByStep = (
  onboardingQuestionsData: any[],
  activeStep: any
) => {
  const _activeStep = Number(activeStep);
  if (Number.isInteger(_activeStep) && onboardingQuestionsData?.length > 0) {
    const step = _activeStep - 1;
    const _question = onboardingQuestionsData[step];
    if (!_.isEmpty(_question)) {
      return _question;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getDiaryCheckinAssemmentPayload = (
  question: any,
  formData: any,
  session: Session,
  emojies: any[]
) => {
  let options: any[] = [];
  let answerType: any = null;
  let _quesId: any = null;
  let textAnswer = null;
  let isLastQuestion = false;
  Object.keys(formData).forEach((key) => {
    if (key.includes(question?._id)) {
      answerType = key.replace(question?._id, "");
      _quesId = key.replace(answerType, "");
    }
  });

  if (answerType === QUESTION_ANSWER_TYPE.EMOJI_RATING) {
    if (question?.options?.length > 0) {
      let selectedEmoji = _.find(
        question?.options,
        (item) => item?._id === formData[`${_quesId}${answerType}`]
      );
      if (selectedEmoji) {
        const { _id, optionValue } = selectedEmoji;
        options.push({
          optionId: _id,
          optionValue: optionValue,
          description: "NA",
        });
      }
    }
  } else if (
    answerType === QUESTION_ANSWER_TYPE.SINGLE_SELECTION ||
    answerType === QUESTION_ANSWER_TYPE?.BOOLEAN
  ) {
    let selectedEmoji = _.find(
      question?.options,
      (item) =>
        item?._id ===
        formData[
          `${question?.stage_1_qus_id}${QUESTION_ANSWER_TYPE.EMOJI_RATING}`
        ]
    );
    if (selectedEmoji) {
      const _findEmojiSentiments = _.find(
        emojies,
        (emoji) => emoji?.emojiValue === selectedEmoji?.optionValue
      );

      if (_findEmojiSentiments) {
        const getSelectedSentiment = _.find(
          _findEmojiSentiments?.sentimentData,
          (item) => item?._id === formData[`${_quesId}${answerType}`]
        );
        if (getSelectedSentiment) {
          const { sentimentValue, _id, description } = getSelectedSentiment;
          options.push({
            optionId: _id,
            optionValue: sentimentValue,
            description: description,
          });
        }
      }
    } else {
      if (question?.options?.length > 0) {
        const _findSelectedOption = _.find(
          question?.options,
          (item) => item?._id === formData[`${_quesId}${answerType}`]
        );
        if (_findSelectedOption) {
          const { _id, optionValue } = _findSelectedOption;
          options.push({
            optionId: _id,
            optionValue: optionValue,
            description: "NA",
          });
        }
      }
    }
  } else if (answerType === QUESTION_ANSWER_TYPE.TEXT) {
    textAnswer = formData[`${_quesId}${answerType}`];
  }

  if (question?.stage === 4) {
    if (options?.length > 0) {
      if (options?.[0]?.optionValue === "No") {
        isLastQuestion = true;
      }
    }
  }

  const uid =
    session?.user?.role === LOGIN_TYPE.CLINICIAN
      ? session?.user?.clinician?.user?._id
      : session?.user?.id;

  const payload = {
    patientId: uid,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    responseType: answerType,
    isLastQuestion: isLastQuestion,
    text: textAnswer,
    filePath: null,
    options: options,
  };
  return {
    payload,
  };
};

export const getAssessmentMediaUploadPayload = (
  answerType: string,
  question: any,
  session: Session
) => {
  let questionOption: any = null;
  questionOption = _.find(
    question?.questionOptionType,
    (item) => item?.label === answerType
  );

  const uid =
    session?.user?.role === LOGIN_TYPE.CLINICIAN
      ? session?.user?.clinician?.user?._id
      : session?.user?.id;

  const payload = {
    patientId: uid,
    studyId: session?.user?.studyId,
    studyRecordId: session?.user?.studyRecordId,
    questionId: question?._id,
    questionTitle: question?.title,
    questionValue: question?.value,
    questionStage: question?.stage,
    responseType: answerType,
    isLastQuestion: false,
    text: null,
    filePath: null,
    options: [],
  };
  return payload;
};

export const audioMp3Converter = async (
  blob: Blob,
  fileName: string,
  inputFileExtension: string,
  outputFileExtension: string
) => {
  let file = new File([blob], fileName, { type: blob.type });
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    await ffmpeg.writeFile(
      `input.${inputFileExtension}`,
      await fetchFile(file)
    );
    await ffmpeg.exec([
      "-i",
      `input.${inputFileExtension}`,
      `output.${outputFileExtension}`,
    ]);
    const _outputFileData = await ffmpeg.readFile(
      `output.${outputFileExtension}`
    );
    const _fileBufferData = new Uint8Array(_outputFileData as ArrayBuffer);
    const _outputBlob = new Blob([_fileBufferData.buffer], {
      type: "audio/mp3",
    });
    const _convertedFile = new File([_outputBlob], fileName + ".mp3", {
      type: _outputBlob.type,
    });
    await ffmpeg.off("log", (e) => {});
    return {
      name: fileName + ".mp3",
      type: _outputBlob?.type,
      data: _convertedFile,
    };
  } catch (error) {
    return {
      name: fileName + ".webm",
      type: file?.type,
      data: file,
    };
  }
};

export const getFileExtension = (blob: any, replaceString: string) => {
  const _fileType = blob?.type;
  const slug = _fileType.split(";");
  const slugValue = slug[0];
  const fileExtension = slugValue.replace(replaceString, "");
  return fileExtension;
};
