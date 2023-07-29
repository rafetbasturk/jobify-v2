import { NavLink } from "react-router-dom";
import links from "../utils/links";
import { useDashboardContext } from "../pages/DashboardLayout";

const NavLinks = ({ isScreenLarge }) => {
  const { toggleSidebar, user } = useDashboardContext();
  const { role } = user;
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link;
        if (path === "admin" && role !== "admin") return
        return (
          <NavLink
            key={text}
            to={path}
            className="nav-link"
            onClick={!isScreenLarge ? toggleSidebar : null}
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
