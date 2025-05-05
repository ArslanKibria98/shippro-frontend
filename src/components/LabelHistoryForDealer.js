import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DownloadHistory from "./DownloadHistory";
import DownloadBulkHistory from "./DownloadBulkHistory";
import Loader from "./Loader";
import Adminauth from "../context/Adminauth";
import * as XLSX from "xlsx";
import { FaFileExcel, FaDownload } from 'react-icons/fa'; // For Excel and download icons
import { Tab, Tabs, TabContainer, TabContent, TabPane } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "react-router-dom";
const LabelsHistoryForHeader = () => {
   const { user } = useContext(Adminauth);
   const [singleHistory, setSingleHistory] = useState([]);
   const [activeTab, setActiveTab] = useState("single");
   const [bulkHistory, setBulkHistory] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [selectTab, setSelectedTab] = useState("single");
   // State to toggle between single and bulk history
   const [showSingleHistory, setShowSingleHistory] = useState(true);
   const id = useParams()
   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 5;

   useEffect(() => {
      const fetchHistory = async () => {
         try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/dealer/${id?.dealerId}/label-history/${id?.id}`, {
               headers: {
                  "Content-Type": "application/json",
                  // Authorization: `Bearer ${user.token}`,
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


      fetchHistory();

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

   // if (loading) return <p><Loader /></p>;
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
   const handleTabChange = (value) => {
      setShowSingleHistory(value === "single");
      setCurrentPage(1); // Reset to first page when switching
   };
   console.log(currentBulkHistory, "currentBulkHistory")
   return (
      <div className="container">
         <div>
            {/* Toggle Buttons */}
            <Tabs
               id="controlled-tab-example"
               className="mt-30 position-relative tabs-overflow mt-3"
               activeKey={selectTab}
               onSelect={(tab) => {
                  setSelectedTab(tab);
               }}
            >
               {/* SINGLE HISTORY TAB */}
               <Tab eventKey={"single"} title={"Single History"} className={selectTab === "single" ? "show active" : ""}>
                  {selectTab === "single" && (
                     <section className="mb-8 mt-4">
                        <h3 className="" style={{ marginBottom: "12px" }}>Single Label History</h3>

                        {loading ? (
                           <Skeleton count={5} height={30} />
                        ) : currentSingleHistory.length === 0 ? (
                           <p className="d-flex justify-content-center" style={{ color: "red" }}>No single labels generated yet.</p>
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
                                             <a href={`https://t.17track.net/en#nums=${label.trackingNumber}`} target="_blank" rel="noopener noreferrer">
                                                {label.trackingNumber}
                                             </a>
                                          </td>
                                          <td>{label.senderName}</td>
                                          <td>{label.recipientName}</td>
                                          <td>{label.vendor}</td>
                                          <td>{new Date(label.generatedAt).toLocaleString()}</td>
                                          <td><DownloadHistory formData={label} /></td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </>
                        )}
                     </section>
                  )}
               </Tab>

               {/* BULK HISTORY TAB */}
               <Tab eventKey={"bulk"} title={"Bulk History"} className={selectTab === "bulk" ? "show active" : ""}>
                  {selectTab === "bulk" && (
                     <section className="mt-4">
                        <h3 className="text-xl font-semibold mb-2" style={{ marginBottom: "12px" }}>Bulk Label History</h3>

                        {loading ? (
                           <Skeleton count={5} height={30} />
                        ) : currentBulkHistory.length === 0 ? (
                           <p className="d-flex justify-content-center" style={{ color: "red" }}>No bulk label events available.</p>
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
                                    {bulkHistory?.map((event, bulkIndex) => {
                                       const trackingGroups = groupTrackingNumbers(event.labels.map(label => label.trackingNumber));
                                       return (
                                          <tr key={event._id || bulkIndex}>
                                             <td>{event.labels[0].carrier}_Labels.zip</td>
                                             <td>{event.labels.length}</td>
                                             <td><span style={{ background: "green", borderRadius: "10px", color: "#fff", padding: "10px" }}>Ready</span></td>
                                             <td>{event.labels[0].vendor}</td>
                                             <td>{new Date(event.generatedAt).toLocaleString()}</td>
                                             <td>
                                                {trackingGroups.map((group, index) => (
                                                   <div key={index} onClick={() => handleBulkTrack(group)} className="cursor-pointer">
                                                      {index === 0 ? "1-20" : `${index * 20 + 1}-${Math.min((index + 1) * 20, event.labels.length)}`}
                                                   </div>
                                                ))}
                                             </td>
                                             <td style={{ display: 'flex' }} className="gap-2">
                                                <div className="d-flex gap-2 ">
                                                   <button onClick={() => generateTrackingExcel(event.labels)} className="download_button" style={{ marginLeft: '8px' }}>
                                                      <FaFileExcel />
                                                   </button>
                                                   <DownloadBulkHistory labelDataList={event.labels} />
                                                </div>
                                             </td>
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                              </table>
                           </>
                        )}
                     </section>
                  )}
               </Tab>
            </Tabs>
            {/* <div className="filter-buttons mb-4">
          <TabContainer activeKey={activeTab} onSelect={handleTabChange}>
            <Tabs className="mb-3">
              <Tab eventKey="single" title="Show Single History" />
              <Tab eventKey="bulk" title="Show Bulk History" />
            </Tabs>
            <TabContent>
              <TabPane eventKey="single" className={activeTab === "single" ? "show active" : ""}>
                <p>Single History Content</p>
              </TabPane>
              <TabPane eventKey="bulk" className={activeTab === "bulk" ? "show active" : ""}>
                <p>Bulk History Content</p>
              </TabPane>
            </TabContent>
          </TabContainer>
        </div> */}

            {/* Single Label History Section */}


            {/* Bulk Label History Section */}

         </div>
      </div>
   );
};

export default LabelsHistoryForHeader;