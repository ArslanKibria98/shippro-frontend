import React, { useState, useEffect, useContext } from "react";
import { FaUserCircle, FaTimes } from "react-icons/fa"; // Added FaTimes for the close icon
import { MdLogout, MdPerson } from "react-icons/md"; // For logout and profile icons
import AuthContext from "../context/AuthContext";
// import "./Dashboardhead.css"; // Add CSS for styling

const Dashboardhead = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const { user, logout } = useContext(AuthContext);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Add/remove body class when sidebar is open/closed
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [isSidebarOpen]);

  // Handle logout
  const handleLogout = () => {
    console.log("User logged out");
    logout(); // Call the logout function from AuthContext
  };

  // Handle profile click
  const handleProfile = () => {
    console.log("Profile clicked");
    // Add your profile logic here
  };

  return (
    <div className="dashboard-header">
      {/* Logo on the left */}
      <div className="logo-container">
        <h4>Ship Pro</h4>
      </div>

      {/* User profile icon on the right */}
      <div className="user-icon-container" onClick={toggleSidebar}>
        <FaUserCircle className="user-icon" />
        <span className="username">{user.name}</span> {/* Replace with dynamic user name */}
      </div>

      {/* Slide bar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Close button at the top of the sidebar */}
        <div className="sidebar-close" onClick={closeSidebar}>
          <FaTimes className="close-icon" />
        </div>

        {/* Sidebar items */}
        <div className="sidebar-item" onClick={handleProfile}>
          <MdPerson className="sidebar-icon" />
          <span>Profile</span>
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          <MdLogout className="sidebar-icon" />
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboardhead;