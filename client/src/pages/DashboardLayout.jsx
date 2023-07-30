import { useState, createContext, useContext, useEffect } from "react";
import { Outlet, redirect, useNavigate, useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Loading, Navbar, SmallSidebar } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  },
};

export const loader = (queryClient) => async () => {
  try {
    const data = await queryClient.ensureQueryData(userQuery);
    return data;
  } catch (error) {
    return redirect("/");
  }
};

const DashboardContext = createContext();

const DashboardLayout = ({ isDarkThemeEnabled, queryClient }) => {
  const {
    data: { user },
  } = useQuery(userQuery);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);
  const [isAuthError, setIsAuthError] = useState(false);

  const toggleDarkTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.body.classList.toggle("dark-theme", newTheme);
    localStorage.setItem("darkTheme", newTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar((s) => !s);
  };

  const logoutUser = async () => {
    await customFetch.get("/auth/logout");
    queryClient.invalidateQueries();
    toast.success("Logged out");
    navigate("/");
  };

  customFetch.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if(error?.response?.status === 401) {
        setIsAuthError(true)
      }
      return Promise.reject(error)
    }
  );
  useEffect(() => {
    if (!isAuthError) return
    logoutUser()
  }, [isAuthError])
  

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
