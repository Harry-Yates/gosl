import { useQuery } from "react-query";
import * as api from "../api/resrobot";

export const useTubeStopId = (tubeStop: string) => {
  const query = useQuery(["tubeStopId", tubeStop], () =>
    api.getTubeStopId(tubeStop)
  );

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

export const useDepartures = (tubeStopId: string) => {
  const query = useQuery(["departures", tubeStopId], () =>
    api.getDepartures(tubeStopId)
  );

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
