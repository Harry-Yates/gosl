import React, { useState, useEffect } from "react";
import { useTubeStopId, useDepartures } from "../../hooks/useResrobot";
import useTrafficLightSystem from "../../hooks/useTrafficLightSystem";
import { FaCog, FaAngleUp, FaAngleDown } from "react-icons/fa";
import SettingsInput from "./SettingsInput";
import PillSelection from "./PillSelection";

export interface Departure {
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
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const tubeStopKey = `tubeStop_${title}`;
  const localStorageKey = `selectedPills_${title}`;
  const walkingTimeKey = `walkingTime_${title}`;
  const showSettingsKey = `showSettings_${title}`;
  const [showAllDepartures, setShowAllDepartures] = useState<boolean>(false);

  const MAX_VISIBLE_DEPARTURES = 2;

  // Load initial state from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTubeStop = localStorage.getItem(tubeStopKey);
      if (storedTubeStop) {
        setTubeStop(storedTubeStop);
      }

      const storedShowSettings = localStorage.getItem(showSettingsKey);
      if (storedShowSettings) {
        setShowSettings(storedShowSettings === "true");
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
  }, [localStorageKey, walkingTimeKey, tubeStopKey, showSettingsKey]);

  // Save to local storage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(tubeStopKey, tubeStop);
      localStorage.setItem(localStorageKey, JSON.stringify(selectedPills));
      localStorage.setItem(walkingTimeKey, walkingTime.toString());
      localStorage.setItem(showSettingsKey, showSettings.toString());
    }
  }, [
    tubeStop,
    selectedPills,
    walkingTime,
    tubeStopKey,
    localStorageKey,
    walkingTimeKey,
    showSettings,
    showSettingsKey,
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
    if (selectedPills.includes(destination)) {
      setSelectedPills(selectedPills.filter((p: string) => p !== destination));
    } else {
      setSelectedPills([...selectedPills, destination]);
    }
    setSelectAll(selectedPills.length === departures?.length - 1);
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

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <div
      className={`tube-stop-input ${trafficLightColor ? "traffic-light" : ""}`}
      style={{ borderColor: trafficLightColor }}>
      <div className="tube-stop-input__header">
        <div className="tube-stop-input__container">
          <h1 className="tube-stop-input__title">{title}</h1>
          <p className="tube-stop-input__subtitle">{tubeStop}</p>
        </div>
        <FaCog
          className="tube-stop-input__toggle icon"
          onClick={toggleSettings}
        />
      </div>
      {showSettings && (
        <SettingsInput
          tubeStop={tubeStop}
          walkingTime={walkingTime}
          onTubeStopChange={setTubeStop}
          onWalkingTimeChange={setWalkingTime}
        />
      )}
      {showSettings && (
        <PillSelection
          selectAll={selectAll}
          selectedPills={selectedPills}
          departures={departures || []} // Assuming departures is an array of Departure objects
          onPillClick={handlePillClick}
          onAllClick={handleAllClick}
        />
      )}
      {isLoadingDepartures ? (
        <p className="tube-stop-input__info">Loading departures...</p>
      ) : (
        <div>
          <h4>Departures:</h4>
          <ul>
            {(showAllDepartures
              ? filteredDepartures
              : filteredDepartures?.slice(0, MAX_VISIBLE_DEPARTURES)
            )?.map((departure: Departure, index: number) => (
              <li key={index}>
                {departure.formattedName ? `${departure.formattedName} to` : ""}{" "}
                {departure.formattedDestination} at {departure.time}
              </li>
            ))}
          </ul>
          {filteredDepartures &&
            filteredDepartures.length > MAX_VISIBLE_DEPARTURES && (
              <h6
                onClick={() => setShowAllDepartures(!showAllDepartures)}
                className="show-more-less-button">
                {showAllDepartures ? <FaAngleUp /> : <FaAngleDown />}
                {showAllDepartures ? "Show Less" : "Show More"}
              </h6>
            )}
        </div>
      )}
    </div>
  );
};

export default TubeStopInput;
