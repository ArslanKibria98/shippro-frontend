import React, { useState, useContext } from "react";
import * as XLSX from "xlsx";
import AuthContext from "../context/AuthContext";
import BulkDownloadLabels from "./BulkDownloadLabels"; // Import new component
import Sidebar from "./Sidebar";

const BulkUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [labelsGenerated, setLabelsGenerated] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [generatedLabels, setGeneratedLabels] = useState([]); // Store processed label data

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProcessFile = async () => {
    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }

    if (user.availableBalance <= 0) {
      alert("Insufficient balance to generate labels.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      setTotalRows(rows.length);
      setLabelsGenerated(0);

      
   const labelHistory =[];
   
    const newLabels = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const labelData = {
          userId: user.id,
          carrier: row.carrier,
          vendor: row.vendor,
          labelType: row.labelType,
          senderName: row.senderName,
          senderAddress: row.senderAddress,
          senderCity: row.senderCity,
          senderState: row.senderState,
          senderZip: row.senderZip,
          recipientName: row.recipientName,
          recipientAddress: row.recipientAddress,
          recipientCity: row.recipientCity,
          recipientState: row.recipientState,
          recipientZip: row.recipientZip,
          weight: row.weight,
          trackingNumber: row.trackingNumber || "",
        };

        try {
          const response = await fetch(`https://ship-label.onrender.com/api/auth/bulk-generate-label/${user.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              ...labelData,
              amount: -1, // Deduct balance
              count: 1,   // Increment label count
             
            }),
          });

          const result = await response.json();

          if (response.ok) {
            setLabelsGenerated((prev) => prev + 1);

            updateUser({
              availableBalance: result.availableBalance,
              totalGeneratedLabels: result.totalGeneratedLabels,
            });

            newLabels.push(labelData); // Store label data for PDF generation
            labelHistory.push(labelData);

            console.log(`Label ${i + 1} generated successfully`);
          } else {
            console.error(`Error generating label for row ${i + 1}: ${result.msg}`);
          }
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }
      console.log(labelHistory)

      setGeneratedLabels(newLabels); // Update state with generated labels
      const bulkId = Date.now().toString();
try {
  const response = await fetch(`https://ship-label.onrender.com/api/auth/add-bulk-label-history/${user.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    },
    body: JSON.stringify({ labels:labelHistory})
  });

  const result = await response.json();
  if (response.ok) {
    console.log("Bulk label history updated successfully", result);
    // Optionally update your UI or context here
  } else {
    console.error("Error updating bulk label history:", result.msg);
  }
} catch (error) {
  console.error("Error sending bulk label history request:", error);
}

    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      
    <div className="container">
    <div className="dashboard_Sec">
    <div className="dashboard_left"><Sidebar/></div>
    <div>
      <h2 className="text-lg font-semibold mb-4">Bulk Label Upload</h2>
      <input type="file" accept="" onChange={handleFileUpload} />
      <button onClick={handleProcessFile} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Process File
      </button>
      <p>Progress: {labelsGenerated} / {totalRows} labels generated</p>

      {generatedLabels.length > 0 && (
        <BulkDownloadLabels labelDataList={generatedLabels} />
      )}
    </div>
    </div>
    </div>
    </div>
  );
};

export default BulkUpload;
