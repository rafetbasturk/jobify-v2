import customFetch from "../utils/customFetch";
import { JobsContainer, SearchContainer } from "../components";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";
import { useQuery } from "@tanstack/react-query";

const allJobsQuery = (params) => {
  const {search, jobType, jobStatus, sort, page } = params
  return {
    queryKey: ["jobs", search ?? "", jobStatus ?? "all", jobType ?? "", sort ?? "newest", page ?? 1],
    queryFn: async () => {
      const { data } = await customFetch.get("/jobs", {
        params,
      });
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allJobsQuery(params));

    return { searchValues: { ...params } };
  };

const AllJobsContext = createContext();

const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const {
    data: { jobs, totalJobs, numOfPages, currentPage },
  } = useQuery(allJobsQuery(searchValues));
  return (
    <AllJobsContext.Provider
      value={{ jobs, searchValues, totalJobs, currentPage, numOfPages }}
    >
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobs;
