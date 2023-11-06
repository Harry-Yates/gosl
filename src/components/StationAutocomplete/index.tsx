import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    if (value) {
      const matchedStations = stations.filter((station) =>
        station.station.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(matchedStations);
    } else {
      setSuggestions([]);
    }
  }, [value, stations]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (stationName: string) => {
    onChange(stationName);
    setSuggestions([]);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter tube stop"
        className="tube-stop-input__input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.station)}>
              {suggestion.station}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StationAutocomplete;
