import React, { useState } from "react";
import { useTubeStopId, useDepartures } from "../../hooks/useResrobot";

interface Departure {
  name: string;
  destination: string;
  time: string;
  formattedName?: string;
  formattedDestination?: string;
}

interface TubeStopInputProps {
  title: string;
  defaultStop?: string;
}

const TubeStopInput: React.FC<TubeStopInputProps> = ({
  title,
  defaultStop,
}) => {
  const [tubeStop, setTubeStop] = useState<string>(
    defaultStop || "T-Centralen"
  );

  const { data: tubeStopId, isLoading: isLoadingId } = useTubeStopId(tubeStop);
  const { data: departures, isLoading: isLoadingDepartures } = useDepartures(
    tubeStopId || ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTubeStop(e.target.value);
  };

  const handleSubmit = () => {
    console.log(`Fetching data for tube stop: ${tubeStop}`);
  };

  console.log("Departures:", departures);

  return (
    <div className="tube-stop-input">
      <h2>{title}</h2>
      <input
        type="text"
        value={tubeStop}
        onChange={handleChange}
        placeholder={defaultStop}
        className="tube-stop-input__input"
      />
      <button
        onClick={handleSubmit}
        className="tube-stop-input__button">
        Search
      </button>

      {/* Display Tube Stop ID */}
      {isLoadingId ? (
        <p className="tube-stop-input__info">Loading tube stop ID...</p>
      ) : (
        <p className="tube-stop-input__info">Tube Stop ID: {tubeStopId}</p>
      )}

      {/* Display Departures */}
      {isLoadingDepartures ? (
        <p className="tube-stop-input__info">Loading departures...</p>
      ) : (
        <div>
          <h3>Departures:</h3>
          <ul>
            {departures?.map((departure: Departure, index: number) => (
              <li key={index}>
                {departure.formattedName ? `${departure.formattedName} to` : ""}{" "}
                {departure.formattedDestination || departure.destination} at{" "}
                {departure.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TubeStopInput;
