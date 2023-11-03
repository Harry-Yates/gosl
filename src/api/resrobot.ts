export const getTubeStopId = async (tubeStop: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RESROBOT_API_KEY;
    const res = await fetch(
      `https://api.resrobot.se/v2.1/location.name?input=${tubeStop}&format=json&accessId=${apiKey}`
    );
    const data = await res.json();
    return data.stopLocationOrCoordLocation[0]?.StopLocation?.extId;
  } catch (error) {
    console.error("Error fetching Tube Stop ID:", error);
    return null;
  }
};

export const getDepartures = async (tubeStopId: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RESROBOT_API_KEY;
    const res = await fetch(
      `https://api.resrobot.se/v2.1/departureBoard?id=${tubeStopId}&format=json&accessId=${apiKey}`
    );

    const data = await res.json();

    return (
      data.Departure?.filter((departure: any) => {
        return departure.ProductAtStop?.name.includes("Tunnelbana");
      }).map((departure: any) => {
        const formattedName = departure.ProductAtStop?.name
          .replace("Länstrafik -Tunnelbana", "")
          .trim();

        const match = departure.direction.match(/^(.*?)\s?\(/);
        const formattedDestination = match
          ? match[1].replace("T-bana", "").trim()
          : departure.direction;

        return {
          time: departure.time,
          destination: departure.direction,
          name: departure.name,
          formattedName,
          formattedDestination,
        };
      }) || []
    );
  } catch (error) {
    console.error("Error fetching departures:", error);
    return [];
  }
};
