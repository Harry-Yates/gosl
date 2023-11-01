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
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [filteredDepartures, setFilteredDepartures] = useState<
    Departure[] | null
  >(null);
  const [walkingTime, setWalkingTime] = useState<number>(0); // New state for walking time

  const localStorageKey = `selectedPills_${title}`;

  useEffect(() => {
    const initialPills = localStorage.getItem(localStorageKey)
      ? JSON.parse(localStorage.getItem(localStorageKey) as string)
      : [];
    setSelectedPills(initialPills);
  }, [localStorageKey]);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(selectedPills));
  }, [selectedPills, localStorageKey, title]);

  const { data: tubeStopId, isLoading: isLoadingId } = useTubeStopId(tubeStop);
  const { data: departures, isLoading: isLoadingDepartures } = useDepartures(
    tubeStopId || ""
  );

  useEffect(() => {
    const filterDepartures = () => {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + walkingTime); // Add walking time

      const newFilteredDepartures = departures?.filter((d: Departure) => {
        const [departureHours, departureMinutes] = d.time
          .split(":")
          .map(Number);
        return (
          selectedPills.includes(d.formattedDestination || "") &&
          (departureHours > currentTime.getHours() ||
            (departureHours === currentTime.getHours() &&
              departureMinutes >= currentTime.getMinutes()))
        );
      });

      setFilteredDepartures(newFilteredDepartures || null);
    };

    filterDepartures();
    const intervalId = setInterval(filterDepartures, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [departures, selectedPills, walkingTime]); // Added walkingTime dependency

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTubeStop(e.target.value);
  };

  const handlePillClick = (destination: string) => {
    const newPills = selectedPills.includes(destination)
      ? selectedPills.filter((p) => p !== destination)
      : [...selectedPills, destination];
    setSelectedPills(newPills);
  };

  const handleAllClick = () => {
    if (selectAll) {
      setSelectedPills([]);
    } else {
      setSelectedPills(
        Array.from(
          new Set<string>(
            departures?.map((d: Departure) => d.formattedDestination || "") ||
              []
          )
        )
      );
    }
    setSelectAll(!selectAll);
  };

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
      <input
        type="number"
        value={walkingTime}
        onChange={(e) => setWalkingTime(parseInt(e.target.value, 10))}
        placeholder="Walking time in minutes"
      />
      <div className="tube-stop-input__pills">
        <button
          className={`pill ${selectAll ? "all-selected" : "all-none-pill"}`}
          onClick={handleAllClick}>
          {selectAll ? "None" : "All"}
        </button>
        {Array.from(
          new Set<string>(
            departures?.map((d: Departure) => d.formattedDestination || "") ||
              []
          )
        )?.map((destination, index) => (
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
