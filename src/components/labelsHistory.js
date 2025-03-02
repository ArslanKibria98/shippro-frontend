import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DownloadHistory from "./DownloadHistory";
import DownloadBulkHistory from "./DownloadBulkHistory";
import Sidebar from "./Sidebar";

const LabelsHistory = () => {
  const { user} = useContext(AuthContext);
  const [singleHistory, setSingleHistory] = useState([]);
  const [bulkHistory, setBulkHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.log(data)
        setSingleHistory(data.labelHistory || []);
        setBulkHistory(data.bulkLabelHistory || []);
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

  if (loading) return <p>Loading history...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
    <div className="dashboard_Sec">
      <div className="dashboard_left"><Sidebar/></div>
      <div className="dashboard_right">
      <h2 className="text-2xl font-bold mb-4">Label History</h2>
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Single Label History</h3>
        {singleHistory.length === 0 ? (
          <p>No single labels generated yet.</p>
        ) : (
          <table>
            <tr>
              <th>Tracking</th>
              <th>From</th>
              <th>To</th>
              <th>Shipping Service</th>
              <th>Vendor</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
            {singleHistory.map((label, index) => (
              
              <tr key={label._id || index} className="mb-4 border-b pb-2">
                <td>
                  {label.trackingNumber}
                </td>
                <td>
                    {label.senderName}
                </td>
                <td>
                    {label.recipientName}
                </td>
                <td>
                    {label?.labelType}
                </td>
                <td>
                  {label.vendor}
                </td>
                <td>
                  {new Date(label.generatedAt).toLocaleString()}
                </td>
                <td>
                <DownloadHistory formData={label} />
                </td>
              </tr>
            ))}
          </table>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Bulk Label History</h3>
        {bulkHistory.length === 0 ? (
          <p>No bulk label events available.</p>
        ) : (
          <table>
            <tr>
               <th>File Name</th>
               <th>Total</th>
               <th>Status</th>
               <th>vendor</th>
               <th>Created At</th>
               <th>Track</th>
               <th>Download</th>
               </tr>
            {bulkHistory.map((event, bulkIndex) => (
              <>
              <tbody key={event._id || bulkIndex} className="mb-6 border-b pb-2">
                <tr>
                  <td></td>
                  <td>{event.labels.length}</td>
                  <td>Ready to Download</td>
                  <td>{event?.vendor}</td>
                  <td>
                  {new Date(event.generatedAt).toLocaleString()}
                  </td>
                <td>
                <button>Track</button>
                </td>
              
                <td>   <DownloadBulkHistory labelDataList={event.labels} />
                </td>
                </tr>
              </tbody>
              </>
              
            ))}
          </table>
        )}
      </section>
    </div>
    </div>
    </div>
  );
};
{/* <ul className="ml-4 mt-2">
                  {event.labels.map((label, index) => (
                    <li key={label._id || index} className="mb-2">
                      <p>
                        <strong>Tracking:</strong> {label.trackingNumber}
                      </p>
                      <p>
                        <strong>Type:</strong> {label.labelType}
                      </p>
                      <p>
                        <strong>Vendor:</strong> {label.vendor}
                      </p>
                      <p>
                        <strong>Generated At:</strong>{" "}
                        {new Date(label.generatedAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul> */}
export default LabelsHistory;
