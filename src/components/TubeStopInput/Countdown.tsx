import React, { useState, useEffect } from "react";
import { Departure } from "./types";

interface CountdownProps {
  targetTime: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime();
      const timeLeft = difference > 0 ? formatTime(difference) : "00:00";
      setTimeLeft(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    let seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
  };

  return <p className="countdown-title fade">Departure: {timeLeft}</p>;
};

export default Countdown;
