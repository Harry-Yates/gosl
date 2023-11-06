import React from "react";
import { Departure } from "./types";

interface PillSelectionProps {
  selectAll: boolean;
  selectedPills: string[];
  departures: Departure[];
  onPillClick: (destination: string) => void;
  onAllClick: () => void;
}

const PillSelection: React.FC<PillSelectionProps> = ({
  selectAll,
  selectedPills,
  departures,
  onPillClick,
  onAllClick,
}) => {
  // Check if there are any departures to display
  const hasDepartures = departures && departures.length > 0;

  return (
    <div className="tube-stop-input__pills">
      {hasDepartures && (
        <button
          className={`pill ${selectAll ? "all-selected" : "all-none-pill"}`}
          onClick={onAllClick}>
          {selectAll ? "None" : "All"}
        </button>
      )}
      {hasDepartures &&
        Array.from(new Set(departures.map((d) => d.formattedDestination || "")))
          .sort() // Optional: sort the destinations alphabetically
          .map((destination, index) => (
            <button
              key={index}
              className={`pill ${
                selectedPills.includes(destination) ? "selected" : ""
              }`}
              onClick={() => onPillClick(destination)}>
              {destination}
            </button>
          ))}
    </div>
  );
};

export default PillSelection;
