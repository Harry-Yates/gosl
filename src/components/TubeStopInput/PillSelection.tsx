import React from "react";
import { Departure } from "./types";

interface PillSelectionProps {
  selectAll: boolean;
  selectedPills: string[];
  departures: Departure[]; // You'll need to import the Departure type
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
  return (
    <div className="tube-stop-input__pills">
      <button
        className={`pill ${selectAll ? "all-selected" : "all-none-pill"}`}
        onClick={onAllClick}>
        {selectAll ? "None" : "All"}
      </button>
      {departures &&
        Array.from(
          new Set<string>(departures.map((d) => d.formattedDestination || ""))
        ).map((destination, index) => (
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
