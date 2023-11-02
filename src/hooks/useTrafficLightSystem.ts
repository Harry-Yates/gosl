import { useMemo } from "react";

interface Departure {
  time: string;
}

const useTrafficLightSystem = (
  departures: Departure[] | null,
  walkingTime: number
) => {
  return useMemo(() => {
    if (!departures || departures.length === 0) {
      return "transparent";
    }

    const currentTime = new Date();

    const closestDepartureTime = departures
      .map((departure) => {
        const departureTime = new Date();
        const [hours, minutes] = departure.time.split(":").map(Number);
        departureTime.setHours(hours, minutes, 0, 0);
        return departureTime;
      })
      .reduce(
        (prev, curr) => (curr >= currentTime && curr < prev ? curr : prev),
        new Date(8640000000000000)
      );

    const timeDifference =
      (closestDepartureTime.getTime() - currentTime.getTime()) / 60000;

    let color;
    if (timeDifference < walkingTime) {
      color = "red";
    } else if (timeDifference <= walkingTime + 1) {
      color = "#00FF00";
    } else {
      const effectiveTimeDifference = timeDifference - walkingTime - 1;
      const percentage = Math.max(
        0,
        Math.min(100, (effectiveTimeDifference / (walkingTime + 1)) * 100)
      );
      const red = Math.floor(255 * (percentage / 100));
      const green = Math.floor(255 * (1 - percentage / 100));
      color = `rgb(${red},${green},0)`;
    }

    return color;
  }, [departures, walkingTime]);
};

export default useTrafficLightSystem;
