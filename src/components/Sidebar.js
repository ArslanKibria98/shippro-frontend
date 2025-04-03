import React from 'react';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import { FaHome, FaTags, FaBoxOpen, FaDownload } from "react-icons/fa";
// Use NavLink instead of Link

const LayoutBar = () => {
  const location = window.location;
  return (
    <Sidebar className="min-h-screen bg-gray-900 text-white">
      <Menu iconShape="square">
        <MenuItem
          rootStyles={{
            backgroundColor: location.pathname === "/dashboard" ? "#1E40AF" : "",
            color: location.pathname === "/dashboard" ? "#fff" : "",
          }}
          icon={<FaHome size={20} />}
          component={
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-500 bg-gray-700" : "text-black"
              }
            />
          }
        >
          Dashboard
        </MenuItem>
        <MenuItem
          icon={<FaTags size={20} />}
          component={
            <NavLink
              to="/create-label"
              className={({ isActive }) =>
                isActive ? "text-blue-500 bg-gray-700" : "text-white"
              }
            />
          }
        >
          Create Label
        </MenuItem>
        <MenuItem
          icon={<FaBoxOpen size={20} />}
          component={
            <NavLink
              to="/create/bulk"
              className={({ isActive }) =>
                isActive ? "text-blue-500 bg-gray-700" : "text-white"
              }
            />
          }
        >
          Create Bulk Label
        </MenuItem>
        <MenuItem
          icon={<FaDownload size={20} />}
          component={
            <NavLink
              to="/download-history"
              className={({ isActive }) =>
                isActive ? "text-blue-500 bg-gray-700" : "text-white"
              }
            />
          }
        >
          Download History
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default LayoutBar;