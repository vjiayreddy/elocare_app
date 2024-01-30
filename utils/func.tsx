import { unitEnum } from "@/ts/enum";
import _ from "lodash";
import { Moment } from "moment";

export const shouldForwardProp = <CustomProps extends Record<string, any>>(
  props: Array<keyof CustomProps>,
  prop: PropertyKey
): boolean => !props.includes(prop as string);


export const getGreetingTime = (currentTime: Moment) => {
  if (!currentTime || !currentTime.isValid()) {
    return "Hello";
  }
  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format("HH"));
  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    return "Good afternoon";
  } else if (currentHour >= splitEvening) {
    return "Good evening";
  }
  return "Good morning";
};

export const calculatePercentage = (part: number, whole: number) => {
  if (typeof part !== "number" || typeof whole !== "number") {
    throw new TypeError("Inputs must be numbers");
  }
  const percentage = (part / whole) * 100;
  if (percentage) {
    return Math.ceil(percentage);
  }
  return 0;
};

export const stringReplaceWithWhiteSpace = (
  value: string,
  replaceWith: string
) => {
  if (value) {
    const newValue = value.toLowerCase().replace(/\s/g, replaceWith);
    return newValue;
  }
  return null;
};

export const checkUnitType = (unitType: any) => {
  let inputType = { multiLine: true, type: "string" };
  if (unitType === unitEnum?.MILI_GRAM || unitType === unitEnum?.NUMBER) {
    inputType.multiLine = false;
    inputType.type = "number";
    return inputType;
  }
  return inputType;
};

export const getInputType = (input: string) => {
  if (input === "STRING") {
    return "text";
  }
  if (input === "NUMBER") {
    return "number";
  }
  if (input === "DATE") {
    return "date";
  }
  return "text";
};

export const getEmojiSentiments = (
  emojiId: string,
  options: any[],
  emojiesData: any[]
) => {
  let emojiSentiments = [];
  let findEmoji = _.find(options, (emoji) => emoji?._id === emojiId);
  if (emojiesData?.length > 0) {
    const _findEmojiById = _.find(
      emojiesData,
      (item) => item?.emojiValue === findEmoji?.optionValue
    );
    if (_findEmojiById) {
      emojiSentiments = _findEmojiById?.sentimentData;
    }
  }
  return emojiSentiments;
};


// getFile name with timestamp
export function getFileNameWithTimeStamp(key: string) {
  let timestamp = new Date().getTime().toString();
  if (key) {
    return key + "_" + timestamp;
  }
  return timestamp;
}
