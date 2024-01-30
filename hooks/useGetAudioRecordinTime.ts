import React, { useEffect, useState } from "react";

const useGetAudioRecordinTime = (
  milliseconds: number,
  _timerStop?: number | null
) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [hourTimer, setHourTimer] = useState<string>("00:00:00");
  const [minuteSecTimer, setMinuteSecTimer] = useState<string>("00:00");
  const [timerStop, setTimerStop] = useState<boolean>(false);

  useEffect(() => {
    if (milliseconds) {
      const _seconds = Math.floor((milliseconds / 1000) % 60);
      const _minutes = Math.floor((milliseconds / 1000 / 60) % 60);
      const _hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

      if (_timerStop === _seconds) {
        setTimerStop(true);
      }

      setSeconds(_seconds);
      setMinutes(_minutes);
      setHours(_hours);
      setHourTimer(
        [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":")
      );
      setMinuteSecTimer(
        [
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0"),
        ].join(":")
      );
    }
  }, [milliseconds]);

  const resetAudioTimer = () => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setMinuteSecTimer("00:00:00");
    setMinuteSecTimer("00:00");
    setTimerStop(false);
  };

  return {
    seconds,
    minutes,
    hours,
    hourTimer,
    minuteSecTimer,
    timerStop,
    setTimerStop,
    setMinuteSecTimer,
    resetAudioTimer,
  };
};

export default useGetAudioRecordinTime;
