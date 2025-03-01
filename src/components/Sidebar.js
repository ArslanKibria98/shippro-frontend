import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white min-h-screen w-64 p-4">
      {/* <div className="text-2xl font-bold mb-8">
        Label Generator
      </div> */}
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/create-label" className="block p-2 hover:bg-gray-700 rounded">
              Create Label
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/create/bulk" className="block p-2 hover:bg-gray-700 rounded">
              Create Bulk Label
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/download-history" className="block p-2 hover:bg-gray-700 rounded">
              Download History
            </Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
