import React from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { Departure } from "./types";

interface DepartureListProps {
  departures: Departure[];
  showAllDepartures: boolean;
  toggleShowAllDepartures: () => void;
  maxVisibleDepartures: number;
}

const DepartureList: React.FC<DepartureListProps> = ({
  departures,
  showAllDepartures,
  toggleShowAllDepartures,
  maxVisibleDepartures,
}) => {
  return (
    <div>
      <h4>Departures:</h4>
      <ul>
        {(showAllDepartures
          ? departures
          : departures.slice(0, maxVisibleDepartures)
        ).map((departure, index) => (
          <li key={index}>
            {departure.formattedName ? `${departure.formattedName} to` : ""}{" "}
            {departure.formattedDestination} at {departure.time}
          </li>
        ))}
      </ul>
      {departures.length > maxVisibleDepartures && (
        <h6
          onClick={toggleShowAllDepartures}
          className="show-more-less-button">
          {showAllDepartures ? <FaAngleUp /> : <FaAngleDown />}
          {showAllDepartures ? "Show Less" : "Show More"}
        </h6>
      )}
    </div>
  );
};

export default DepartureList;
