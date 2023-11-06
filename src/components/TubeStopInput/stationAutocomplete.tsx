import React, { useState, useEffect, useRef } from "react";

export type Station = {
  number: string;
  lines: string[];
  station: string;
  opened: string;
  grade: string;
};

interface StationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  stations: Station[]; // Assuming you have a list of stations
}

const StationAutocomplete: React.FC<StationAutocompleteProps> = ({
  value,
  onChange,
  stations,
}) => {
  const [suggestions, setSuggestions] = useState<Station[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const isInitialMount = useRef(true); // useRef to track the initial mount

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // After the initial mount, set this to false
    } else {
      if (value) {
        const matchedStations = stations
          .filter((station) =>
            station.station.toLowerCase().startsWith(value.toLowerCase())
          )
          .slice(0, 10); // Limit the results to 10
        setSuggestions(matchedStations);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  }, [value, stations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (stationName: string) => {
    onChange(stationName); // Update the input with the selected station name
    setShowSuggestions(false); // Hide the suggestions list
  };

  // Hide suggestions when the input is blurred
  const handleBlur = () => {
    // Use a timeout to delay the hiding of suggestions so that the click event on suggestions can be processed
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div className="station-autocomplete">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Enter tube stop"
        className="tube-stop-input__input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.number}
              onMouseDown={() => handleSuggestionClick(suggestion.station)} // Use onMouseDown instead of onClick to handle the event before onBlur
              className="suggestion-item">
              {suggestion.station}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationAutocomplete;
