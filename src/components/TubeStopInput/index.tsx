import React, { useState, useEffect } from "react";
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
  const [selectedPills, setSelectedPills] = useState<string[]>([]);

  // Store selectedPills to localStorage
  useEffect(() => {
    const initialPills = localStorage.getItem("selectedPills")
      ? JSON.parse(localStorage.getItem("selectedPills") as string)
      : [];
    setSelectedPills(initialPills);
  }, []);

  // Store selectedPills to localStorage
  useEffect(() => {
    if (selectedPills.length > 0) {
      console.log("Storing to localStorage:", JSON.stringify(selectedPills));
      localStorage.setItem("selectedPills", JSON.stringify(selectedPills));
    }
  }, [selectedPills]);

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

  // Explicitly define the type for Set
  const uniqueDestinations = Array.from(
    new Set<string>(
      departures?.map((d: Departure) => d.formattedDestination || "") || []
    )
  );

  const handlePillClick = (destination: string) => {
    const newPills = selectedPills.includes(destination)
      ? selectedPills.filter((p) => p !== destination)
      : [...selectedPills, destination];
    setSelectedPills(newPills);
  };

  const filteredDepartures = departures?.filter((d: Departure) =>
    selectedPills.includes(d.formattedDestination || "")
  );

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

      {/* Display Pills */}
      <div className="tube-stop-input__pills">
        {uniqueDestinations?.map((destination, index) => (
          <button
            key={index}
            className={`pill ${
              selectedPills.includes(destination) ? "selected" : ""
            }`}
            onClick={() => handlePillClick(destination)}>
            {destination}
          </button>
        ))}
      </div>

      {/* Display Departures */}
      {isLoadingDepartures ? (
        <p className="tube-stop-input__info">Loading departures...</p>
      ) : (
        <div>
          <h3>Departures:</h3>
          <ul>
            {filteredDepartures?.map((departure: Departure, index: number) => (
              <li key={index}>
                {departure.formattedName ? `${departure.formattedName} to` : ""}{" "}
                {departure.formattedDestination} at {departure.time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TubeStopInput;
