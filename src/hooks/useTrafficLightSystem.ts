import { useState, useEffect, useMemo } from "react";

interface Departure {
  time: string;
}

const useTrafficLightSystem = (
  departures: Departure[] | null,
  walkingTime: number,
  bufferTime = 1 // Set to 0 for now, can be increased in the future
) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const updateInterval = 10000; // Update time every 10 seconds

  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentTime(new Date()),
      updateInterval
    );
    return () => clearInterval(intervalId);
  }, []);

  return useMemo(() => {
    if (!departures || departures.length === 0) {
      return "transparent"; // No departures, no color
    }

    const closestDepartureTime = departures
      .map((departure) => {
        const departureTime = new Date(currentTime);
        const [hours, minutes] = departure.time.split(":").map(Number);
        departureTime.setHours(hours, minutes, 0, 0);
        return departureTime;
      })
      .reduce(
        (prev, curr) => (curr >= currentTime && curr < prev ? curr : prev),
        new Date(8640000000000000) // Far future date
      );

    const timeDifference =
      (closestDepartureTime.getTime() - currentTime.getTime()) / 60000;

    // Calculate the percentage to the next departure relative to the walking time plus buffer
    const totalReadyTime = walkingTime + bufferTime;
    const percentageToDeparture =
      (timeDifference - totalReadyTime) / totalReadyTime;

    // Define the color based on the percentage to the next departure
    let color;
    if (percentageToDeparture > 1) {
      color = "rgb(255,0,0)"; // Red - too early
    } else if (percentageToDeparture > 0) {
      // Transition from red to yellow as it gets closer to the get ready time
      const yellowIntensity = Math.floor(255 * (1 - percentageToDeparture));
      color = `rgb(255,${yellowIntensity},0)`;
    } else if (percentageToDeparture > -1) {
      // Transition from yellow to green as it gets closer to the go time
      const greenIntensity = Math.floor(255 * (1 + percentageToDeparture));
      color = `rgb(${255 - greenIntensity},255,0)`;
    } else {
      color = "rgb(255,0,0)"; // Red - missed the train
    }

    return color;
  }, [departures, walkingTime, bufferTime, currentTime]);
};

export default useTrafficLightSystem;
