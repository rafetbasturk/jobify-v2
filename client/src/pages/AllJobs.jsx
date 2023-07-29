import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import { useLoaderData } from "react-router-dom";
import { useContext, createContext } from "react";

export const loader = async ({ request }) => {
  try {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    const { data } = await customFetch.get("/jobs", {
      params,
    });
    return { ...data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const AllJobsContext = createContext();

const AllJobs = () => {
  const { jobs, totalJobs, numOfPages, currentPage, searchValues } =
    useLoaderData();
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
