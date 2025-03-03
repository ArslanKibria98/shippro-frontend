import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white min-h-screen w-64 p-4">
      <nav>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                ` ${
                  isActive ? 'active' : ''
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/create-label"
              className={({ isActive }) =>
                `${
                  isActive ? 'active' : ''
                }`
              }
            >
              Create Label
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/create/bulk"
              className={({ isActive }) =>
                `${
                  isActive ? 'active' : ''
                }`
              }
            >
              Create Bulk Label
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/download-history"
              className={({ isActive }) =>
                ` ${
                  isActive ? 'active' : ''
                }`
              }
            >
              Download History
            </NavLink>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;