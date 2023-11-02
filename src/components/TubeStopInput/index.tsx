import React, { useState, useEffect } from "react";
import { useTubeStopId, useDepartures } from "../../hooks/useResrobot";
import useTrafficLightSystem from "../../hooks/useTrafficLightSystem";

interface Departure {
  name: string;
  destination: string;
  time: string;
  formattedName?: string;
  formattedDestination?: string;
}

interface TubeStopInputProps {
  title: string;
}

const TubeStopInput: React.FC<TubeStopInputProps> = ({ title }) => {
  const [tubeStop, setTubeStop] = useState<string>("");
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [filteredDepartures, setFilteredDepartures] = useState<
    Departure[] | null
  >(null);
  const [walkingTime, setWalkingTime] = useState<number>(0);

  const tubeStopKey = `tubeStop_${title}`;
  const localStorageKey = `selectedPills_${title}`;
  const walkingTimeKey = `walkingTime_${title}`;

  // Load initial state from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTubeStop = localStorage.getItem(tubeStopKey);
      if (storedTubeStop) {
        setTubeStop(storedTubeStop);
      }

      const initialPills = localStorage.getItem(localStorageKey)
        ? JSON.parse(localStorage.getItem(localStorageKey) as string)
        : [];
      setSelectedPills(initialPills);

      const storedWalkingTime = localStorage.getItem(walkingTimeKey);
      if (storedWalkingTime) {
        setWalkingTime(parseInt(storedWalkingTime, 10));
      }
    }
  }, [localStorageKey, walkingTimeKey, tubeStopKey]);

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(tubeStopKey, tubeStop);
      localStorage.setItem(localStorageKey, JSON.stringify(selectedPills));
      localStorage.setItem(walkingTimeKey, walkingTime.toString());
    }
  }, [
    tubeStop,
    selectedPills,
    walkingTime,
    tubeStopKey,
    localStorageKey,
    walkingTimeKey,
  ]);

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

    if (departures) {
      filterDepartures();
    }
    const intervalId = setInterval(filterDepartures, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [departures, selectedPills, walkingTime]);

  const handleTubeStopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const trafficLightColor = useTrafficLightSystem(
    filteredDepartures,
    walkingTime
  );

  return (
    <div
      className={`tube-stop-input ${trafficLightColor ? "traffic-light" : ""}`}
      style={{ borderColor: trafficLightColor }}>
      <h1>{title}</h1>
      <input
        type="text"
        value={tubeStop}
        onChange={handleTubeStopChange}
        placeholder="Enter tube stop"
        className="tube-stop-input__input"
      />
      <input
        type="number"
        value={walkingTime}
        onChange={(e) => setWalkingTime(parseInt(e.target.value, 10))}
        placeholder="Enter walk time"
        className="tube-stop-input__input"
      />
      <div className="tube-stop-input__pills">
        <button
          className={`pill ${selectAll ? "all-selected" : "all-none-pill"}`}
          onClick={handleAllClick}>
          {selectAll ? "None" : "All"}
        </button>
        {departures &&
          Array.from(
            new Set<string>(
              departures.map((d: Departure) => d.formattedDestination || "")
            )
          ).map((destination, index) => (
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
