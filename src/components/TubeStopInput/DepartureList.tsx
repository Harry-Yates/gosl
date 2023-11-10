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
    <>
      {departures.length > maxVisibleDepartures && (
        <h4 className="fade">Departures:</h4>
      )}
      {departures.length > maxVisibleDepartures && (
        <ul className="tube-stop-input__departure-list fade">
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
      )}
      {departures.length > maxVisibleDepartures && (
        <h6
          onClick={toggleShowAllDepartures}
          className="tube-stop-input__show-more-less-button fade">
          {showAllDepartures ? <FaAngleUp /> : <FaAngleDown />}
          {showAllDepartures ? "Show Less" : "Show More"}
        </h6>
      )}
    </>
  );
};

export default DepartureList;
