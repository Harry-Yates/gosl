import React from "react";

interface SettingsInputProps {
  tubeStop: string;
  walkingTime: number;
  onTubeStopChange: (value: string) => void;
  onWalkingTimeChange: (value: number) => void;
}

const SettingsInput: React.FC<SettingsInputProps> = ({
  tubeStop,
  walkingTime,
  onTubeStopChange,
  onWalkingTimeChange,
}) => {
  return (
    <>
      <input
        type="text"
        value={tubeStop}
        onChange={(e) => onTubeStopChange(e.target.value)}
        placeholder="Enter tube stop"
        className="tube-stop-input__input"
      />
      <input
        type="number"
        value={walkingTime}
        onChange={(e) => onWalkingTimeChange(parseInt(e.target.value, 10))}
        placeholder="Enter walk time"
        className="tube-stop-input__input"
      />
    </>
  );
};

export default SettingsInput;
