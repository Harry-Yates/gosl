import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetTime: Date; // Define the type for targetTime as Date
}

const Countdown: React.FC<CountdownProps> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetTime.getTime() - now.getTime(); // Convert Date to timestamp
      const timeLeft = difference > 0 ? formatTime(difference) : "00:00";
      setTimeLeft(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    let seconds = Math.floor((milliseconds % 60000) / 1000); // Convert to integer
    return `${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
  };

  return <p className="countdown-title fade">Train leaves in: {timeLeft}</p>;
};

export default Countdown;
