import { useDashboardContext } from "../pages/DashboardLayout";
import Wrapper from "../assets/wrappers/BigSidebar";
import { Logo, NavLinks } from "./";

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div
        className={`sidebar-container ${!showSidebar ? "show-sidebar" : ""}`}
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isScreenLarge />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
