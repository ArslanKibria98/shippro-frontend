import React, { useState } from "react";
import * as XLSX from "xlsx";

const UploadShipments = () => {
  const [file, setFile] = useState(null);

  // Store the selected file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Process the file: read Excel, convert to JSON, send to backend
  const handleProcessFile = async () => {
    if (!file) {
      alert("Please select an Excel file first.");
      return;
    }

    try {
      // Create a FileReader to read the file as an ArrayBuffer
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          // Parse the file data into a workbook
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          // Use the first sheet
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // Convert to JSON (rows) with { raw: false } to preserve formatting as text
          const rows = XLSX.utils.sheet_to_json(worksheet, { raw: false });
          console.log("Parsed rows:", rows);

          // Send the rows to your backend
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/upload-shipments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rows }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Shipments saved successfully:", result);
            alert("Shipments uploaded and saved successfully!");
          } else {
            const errorText = await response.text();
            console.error("Error saving shipments:", errorText);
            alert("Error saving shipments.");
          }
        } catch (err) {
          console.error("Error processing file:", err);
          alert("Error processing file. Check console for details.");
        }
      };

      // Read the file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error reading file:", err);
      alert("Could not read the file. Check console for details.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* <h2 className="text-lg font-semibold mb-4">Upload Shipments</h2> */}
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button
        onClick={handleProcessFile}
        className="contact-btn mt-4"
      >
        Process File
      </button>
    </div>
  );
};

export default UploadShipments;
