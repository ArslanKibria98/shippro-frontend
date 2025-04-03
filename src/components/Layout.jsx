import { Outlet } from "react-router-dom";
import Dashboardhead from "../components/Dashboardhead"; // Your common navbar
import LayoutBar from "../components/Sidebar"; // Your common sidebar

const Layout = () => {
  return (
    <div className="app-layout">
      <Dashboardhead />
      <div className="content col-12 d-flex">
        <div style={{ backgroundColor: "#0155A5", minHeight: "95vh" }}>
          <LayoutBar />
        </div>
        <div className="col-9 width-sidebar-body">
          <Outlet />
        </div>
        {/* <main>This will render the matched route</main> */}
      </div>
    </div>
  );
};

export default Layout;
