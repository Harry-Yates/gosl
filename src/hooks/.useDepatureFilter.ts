import { useState, useEffect } from "react";
import { Departure } from "../components/TubeStopInput/types";

function useDepartureFilter(
  departures: Departure[],
  selectedPills: string[],
  walkingTime: number
): Departure[] {
  const [filteredDepartures, setFilteredDepartures] = useState<Departure[]>([]);

  useEffect(() => {
    const filterDepartures = (): void => {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + walkingTime);

      const newFilteredDepartures = departures.filter((departure) => {
        const [departureHours, departureMinutes] = departure.time
          .split(":")
          .map(Number);
        return (
          selectedPills.includes(departure.formattedDestination) &&
          (departureHours > currentTime.getHours() ||
            (departureHours === currentTime.getHours() &&
              departureMinutes >= currentTime.getMinutes()))
        );
      });

      setFilteredDepartures(newFilteredDepartures);
    };

    filterDepartures();
  }, [departures, selectedPills, walkingTime]);

  return filteredDepartures;
}
