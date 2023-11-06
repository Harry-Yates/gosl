import React, { useState, useEffect } from "react";
import { useTubeStopId, useDepartures } from "../../hooks/useResrobot";
import useTrafficLightSystem from "../../hooks/useTrafficLightSystem";
import { FaCog } from "react-icons/fa";
import SettingsInput from "./SettingsInput";
import PillSelection from "./PillSelection";
import DepartureList from "./DepartureList";
import StationAutocomplete, { Station } from "./stationAutocomplete";
import { Departure } from "./types";

interface TubeStopInputProps {
  title: string;
  stations: Station[];
}

const TubeStopInput: React.FC<TubeStopInputProps> = ({ title, stations }) => {
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

  const handleTubeStopChange = (newTubeStop: string) => {
    setTubeStop(newTubeStop);
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
        <>
          <StationAutocomplete
            value={tubeStop}
            onChange={handleTubeStopChange}
            stations={stations} // Pass the stations data
          />
          <SettingsInput
            tubeStop={tubeStop}
            walkingTime={walkingTime}
            onTubeStopChange={setTubeStop}
            onWalkingTimeChange={setWalkingTime}
          />
        </>
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
        <DepartureList
          departures={filteredDepartures || []}
          showAllDepartures={showAllDepartures}
          toggleShowAllDepartures={() =>
            setShowAllDepartures(!showAllDepartures)
          }
          maxVisibleDepartures={MAX_VISIBLE_DEPARTURES}
        />
      )}
    </div>
  );
};

export default TubeStopInput;
