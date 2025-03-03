import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import AuthContext from "../context/AuthContext";
import BulkDownloadLabels from "./BulkDownloadLabels"; // Import new component
import Sidebar from "./Sidebar";
import Dashboardhead from "./Dashboardhead";

const BulkUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [labelsGenerated, setLabelsGenerated] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [generatedLabels, setGeneratedLabels] = useState([]); // Store processed label data
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [availableLabels, setAvailableLabels] = useState([]);
   const [vendorLabelType,setVendorLabelType] = useState([]);

  const [formData, setFormData] = useState({
    carrier: "",
    vendor: "",
    labelType: "",
  });

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchAllowedCarriers = async () => {
      try {
        if (!user?.id) return; // Ensure user is loaded

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/allowed-carriers/${user.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Allowed Carriers:", data); // Debugging
          setAllowedCarriers(data);
        } else {
          console.error("Error fetching allowed carriers");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchAllowedCarriers();
  }, [user]);

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

      const labelHistory = [];
      const newLabels = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const labelData = {
          userId: user.id,
          carrier: formData.carrier, // Use selected carrier from form
          vendor: formData.vendor, // Use selected vendor from form
          labelType: formData.labelType, // Use selected labelType from form
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
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/auth/bulk-generate-label/${user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              body: JSON.stringify({
                ...labelData,
                amount: -1, // Deduct balance
                count: 1, // Increment label count
              }),
            }
          );

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

      console.log(labelHistory);

      setGeneratedLabels(newLabels); // Update state with generated labels
      const bulkId = Date.now().toString();

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/add-bulk-label-history/${user.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ labels: labelHistory }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          console.log("Bulk label history updated successfully", result);
        } else {
          console.error("Error updating bulk label history:", result.msg);
        }
      } catch (error) {
        console.error("Error sending bulk label history request:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCarrierChange = (e) => {
    const selectedCarrier = e.target.value;

    // Default vendors for USPS
    const uspsVendors = ["ATFM", "Shippo", "Rollo","Evs"];
    const upsLableType = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];
    const uspsLabelType = ["priority","ground_advantage"];
    // Find the selected carrier from allowedCarriers
    const carrierData = allowedCarriers.find((carrier) => carrier.carrier === selectedCarrier);

    // Set vendors based on selected carrier
    if (selectedCarrier === "USPS") {
      setAvailableVendors(uspsVendors);
      setAvailableLabels(uspsLabelType)
    } else if (selectedCarrier === "UPS") {
      setAvailableVendors("");
      setAvailableLabels(upsLableType)

    }else if (selectedCarrier === "USPS(Pre Shipment)") {
      setAvailableVendors(["Piority"]);
      setAvailableLabels(['ATFM'])

    } 
     else {
      setAvailableVendors([]);
      setAvailableLabels([]);
    }

    // Update form data
    setFormData((prev) => ({
      ...prev,
      carrier: selectedCarrier,
      vendor: "", // Reset vendor when carrier changes
    }));
  };

  // Handle Vendor Selection
  const handleVendorChange = (e) => {
    const ATFMLabelTypes = ['ground_advantage','preship']
    const ShippoLabelTypes = ['ground_advantage','priority_mail']
    const EvsLabelTypes = ['ground_advantage','priority_mail']
    const RolloLabelTypes = ['ground_advantage','priority_mail']

    if(e.target.value == 'Shippo'){
      setVendorLabelType(ShippoLabelTypes)
    }
    else if(e.target.value == 'ATFM'){
      setVendorLabelType(ATFMLabelTypes)
    }
    else if(e.target.value == 'Evs'){
      setVendorLabelType(EvsLabelTypes)
    }
    else if(e.target.value == 'Rollo'){
      setVendorLabelType(RolloLabelTypes)
    }
    else{
      setVendorLabelType('')
    }
      setFormData(prev => ({
          ...prev,
          vendor: e.target.value,
          labelType: "", // Reset vendor when carrier changes

      }));
    
  };


  return (
    <div>
      {/* <Dashboardhead /> */}
      <div className="container">
        <div className="dashboard_Sec">
          <div className="dashboard_left">
            <Sidebar />
          </div>
          <div className="dashboard_right">
          <h4 className="create_sec_heading" style={{marginBottom:'24px'}}>Generate Bulk Labels</h4>
            <p className="text-warning" style={{color:'red', marginBottom:'10px'}}>
              *Follow below sample to generate labels, format except this sample will not be accepted
            </p>
            {/* <h2 className="text-lg font-semibold mb-4">Bulk Label Upload</h2> */}
            <div className="form-row">
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleCarrierChange}
                className="form-select"
              >
                <option value="" disabled>
                  --- Select Carrier ---
                </option>
                {allowedCarriers.length > 0
                  ? allowedCarriers.map((carrier, index) => (
                      <option key={index} value={carrier.carrier}>
                        {carrier.carrier}
                      </option>
                    ))
                  : (
                      <option value="" disabled>
                        No Allowed Carriers
                      </option>
                    )}
              </select>

              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleVendorChange}
                className="form-select"
              >
                <option value="" disabled>
                  --- Select Vendor ---
                </option>
                {availableVendors.length > 0
                  ? availableVendors.map((vendor, index) => (
                      <option key={index} value={vendor}>
                        {vendor}
                      </option>
                    ))
                  : (
                      <option value="" disabled>
                        No Vendors Available
                      </option>
                    )}
              </select>
              <select
                name="labelType"
                value={formData.labelType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="" disabled>
                  --- Select Shipping Service ---
                </option>
                {vendorLabelType.length > 0
                  ? vendorLabelType.map((vendor, index) => (
                      <option key={index} value={vendor}>
                        {vendor}
                      </option>
                    ))
                  : (
                      <option value="" disabled>
                        No Service Available
                      </option>
                    )}
              </select>

            </div>
            <h4>Upload CSV File</h4>

            <input type="file" accept="" onChange={handleFileUpload} />
            <button
              onClick={handleProcessFile}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Process File
            </button>
            <p>
              Progress: {labelsGenerated} / {totalRows} labels generated
            </p>

            {generatedLabels.length > 0 && <BulkDownloadLabels labelDataList={generatedLabels} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;