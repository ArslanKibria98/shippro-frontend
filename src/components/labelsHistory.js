import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DownloadHistory from "./DownloadHistory";
import DownloadBulkHistory from "./DownloadBulkHistory";
import Loader from "./Loader";
import * as XLSX from "xlsx";
import { FaFileExcel, FaDownload } from 'react-icons/fa'; // For Excel and download icons


const LabelsHistory = () => {
  const { user } = useContext(AuthContext);
  const [singleHistory, setSingleHistory] = useState([]);
  const [bulkHistory, setBulkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to toggle between single and bulk history
  const [showSingleHistory, setShowSingleHistory] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/label-history/${user.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch label history");
        }

        const data = await response.json();

        // setSingleHistory(data.labelHistory || []);
        // setBulkHistory(data.bulkLabelHistory || []);
        setSingleHistory((data.labelHistory || []).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)));
      setBulkHistory((data.bulkLabelHistory || []).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Slice the data for the current page
  const currentSingleHistory = singleHistory.slice(indexOfFirstRow, indexOfLastRow);
  const currentBulkHistory = bulkHistory.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (
      (showSingleHistory && currentPage < Math.ceil(singleHistory.length / rowsPerPage)) ||
      (!showSingleHistory && currentPage < Math.ceil(bulkHistory.length / rowsPerPage))
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to group tracking numbers into chunks of 20
  const groupTrackingNumbers = (trackingNumbers) => {
    const chunkSize = 20;
    const groups = [];
    for (let i = 0; i < trackingNumbers.length; i += chunkSize) {
      const group = trackingNumbers.slice(i, i + chunkSize);
      groups.push(group);
    }
    return groups;
  };

  // Function to handle bulk tracking
  const handleBulkTrack = (trackingNumbers) => {
    const trackingNumbersString = trackingNumbers.join(",");
    window.location.href = `https://t.17track.net/en#nums=${trackingNumbersString}`;
  };

  if (loading) return <p><Loader /></p>;
  if (error) return <p>Error: {error}</p>;


  const generateTrackingExcel = (labels) => {
    // Create worksheet data
    const trackingData = labels.map((label, index) => ({
      "Tracking Number": label.trackingNumber
    }));
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(trackingData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tracking Numbers");
  
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
  
    // Create blob and trigger download
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tracking_numbers_${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <div>
        {/* Toggle Buttons */}
        <div className="filter-buttons mb-4">
          <button
            onClick={() => {
              setShowSingleHistory(true);
              setCurrentPage(1); // Reset to first page when switching
            }}
            className={`filter-button ${showSingleHistory ? "active" : ""}`}
          >
            Show Single History
          </button>
          <button
            onClick={() => {
              setShowSingleHistory(false);
              setCurrentPage(1); // Reset to first page when switching
            }}
            className={`filter-button ${!showSingleHistory ? "active" : ""}`}
          >
            Show Bulk History
          </button>
        </div>

        {/* Single Label History Section */}
        {showSingleHistory && (
          <section className="mb-8">
            <h3 className="" style={{marginBottom:"12px"}}>Single Label History</h3>
            {currentSingleHistory.length === 0 ? (
              <p>No single labels generated yet.</p>
            ) : (
              <>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Tracking</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Vendor</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSingleHistory.map((label, index) => (
                      <tr key={label._id || index}>
                        <td>
                          <a
                            href={`https://t.17track.net/en#nums=${label.trackingNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {label.trackingNumber}
                          </a>
                        </td>
                        <td>{label.senderName}</td>
                        <td>{label.recipientName}</td>
                        <td>{label.vendor}</td>
                        <td>{new Date(label.generatedAt).toLocaleString()}</td>
                        <td>
                          <DownloadHistory formData={label} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>Page {currentPage}</span>
                  <button
                    onClick={nextPage}
                    disabled={
                      currentPage === Math.ceil(singleHistory.length / rowsPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Bulk Label History Section */}
        {!showSingleHistory && (
          <section>
            <h3 className="text-xl font-semibold mb-2" style={{marginBottom:"12px"}}>Bulk Label History</h3>
            {currentBulkHistory.length === 0 ? (
              <p>No bulk label events available.</p>
            ) : (
              <>
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Vendor</th>
                      <th>Created At</th>
                      <th>Track</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>


                  {currentBulkHistory.map((event, bulkIndex) => {
  const trackingGroups = groupTrackingNumbers(event.labels.map(label => label.trackingNumber));

  return (
    <tr key={event._id || bulkIndex}>
      <td>{event.labels[0].carrier}_Labels.zip</td>
      <td>{event.labels.length}</td>
      <td>Ready to Download</td>
      <td>{event.labels[0].vendor}</td>
      <td>{new Date(event.generatedAt).toLocaleString()}</td>
      <td>
        {trackingGroups.map((group, index) => (
          <button
            key={index}
            onClick={() => handleBulkTrack(group)}
            className="track-button download_button"
          >
            {index === 0
              ? "1-20"
              : `${index * 20 + 1}-${Math.min((index + 1) * 20, event.labels.length)}`}
          </button>
        ))}
      </td>
      <td style={{display:'flex'}}>
        {/* Add Excel download button */}
        <button 
          onClick={() => generateTrackingExcel(event.labels)}
          className="download_button"
          style={{ marginLeft: '8px' }}
        >
          <FaFileExcel />
        </button>
        <DownloadBulkHistory labelDataList={event.labels} />
      </td>
    </tr>
  );
})}
                  
                  </tbody>
                </table>
                {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span>Page {currentPage}</span>
                  <button
                    onClick={nextPage}
                    disabled={
                      currentPage === Math.ceil(bulkHistory.length / rowsPerPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default LabelsHistory;