import customFetch from "../utils/customFetch";
import { ChartsContainer, StatsContainer } from "../components";
import { useQuery } from "@tanstack/react-query";

const statsQuery = {
  queryKey: ["stats"],
  queryFn: async () => {
    const { data } = await customFetch.get("/jobs/stats");
    return data;
  },
};

export const loader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
};

const Stats = () => {
  const {
    data: { defaultStats, monthlyApplications },
  } = useQuery(statsQuery);

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 0 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};

export default Stats;
