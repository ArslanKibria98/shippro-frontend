import React, { useState, useContext, useEffect } from "react";
import * as XLSX from "xlsx";
import AuthContext from "../context/AuthContext";
import BulkDownloadLabels from "./BulkDownloadLabels";
import Sidebar from "./Sidebar";
import Dashboardhead from "./Dashboardhead";

const BulkUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [labelsGenerated, setLabelsGenerated] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [generatedLabels, setGeneratedLabels] = useState([]);
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [vendorLabelType, setVendorLabelType] = useState([]);
  const [missRow, setMissRows] = useState([]);

  const [formData, setFormData] = useState({
    carrier: "",
    vendor: "",
    labelType: "",
  });

  // Function to download the sample Excel sheet
  const downloadSampleSheet = () => {
    const sampleData = [
      {
        vendor: "ATFM",
        labelType: "ground_priority",
        senderName: "VA Warehouse",
        senderAddress: "108 Page Street",
        senderAddress1: "10001",
        senderPh: "1234",
        senderCompany: "",
        senderCity: "Berryville",
        senderState: "VA",
        senderZip: "22611",
        recipientName: "Jasmine Diaz",
        recipientAddress: "1226 THREE FORKS DR",
        recipientAddress1: "22611",
        recipientPh: "1234",
        recipientCompany: "",
        recipientCity: "22611",
        recipientState: "22611",
        recipientZip: "22611",
        length: "",
        width: "",
        height: "",
        weight: "6",
      },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Sheet");

    const excelBinaryString = XLSX.write(workbook, {
      type: "binary",
      bookType: "xlsx",
    });

    const excelBlob = new Blob([s2ab(excelBinaryString)], {
      type: "application/octet-stream",
    });

    saveAs(excelBlob, "Sample_Sheet.xlsx");
  };

  // Utility function to convert string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchAllowedCarriers = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/allowed-carriers/${user.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
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
    if (!formData.carrier || !formData.vendor || !formData.labelType) {
      alert("Please select Carrier, Vendor, and Label Type before processing.");
      return;
    }

    if (user.availableBalance <= user.rate) {
      alert("Insufficient balance to generate labels.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      if (rows.length > 40) {
        alert("Only 40 labels can be created at a time.");
        return;
      }

      setTotalRows(rows.length);
      setLabelsGenerated(0);

      const labelHistory = [];
      const newLabels = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        if (
          !row.senderName || !row.senderAddress || !row.senderCity ||
          !row.senderState || !row.senderZip ||
          !row.recipientName || !row.recipientAddress || !row.recipientCity ||
          !row.recipientState || !row.recipientZip
        ) {
          errors.push(`Row ${i + 2}: Missing required fields.`);
          setMissRows(errors);
          continue;
        }

        if (user.availableBalance <= user.rate) {
          alert("Insufficient balance to generate labels.");
          return;
        }

        const apiVendor = formData.vendor.toLowerCase();
        let pulledTrackingNumber;
        let newBarcodeImg;

        try {
          const apiResponse = await fetch(
            `https://my.labelscheap.com/api/generate_tracking.php?user_name=sarim&api_key=4ec5cdddf39363d957608a7927b6dc28be4211c9f5cc3e836cb12abb61054aca&vendor=${apiVendor}&class=${formData.labelType}&count=1`
          );

          if (!apiResponse.ok) {
            throw new Error(`Failed to fetch tracking number: ${apiResponse.statusText}`);
          }

          const data = await apiResponse.json();
          pulledTrackingNumber = data.tracking_numbers[0];
          setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));

          const barcodeResponse = await fetch(
            `https://my.labelscheap.com/api/barcodev2.php?user_name=sarim&api_key=4ec5cdddf39363d957608a7927b6dc28be4211c9f5cc3e836cb12abb61054aca&f=png&s=ean-128&zip=${row.recipientZip}&tracking=${pulledTrackingNumber}&sf=3&ms=r&md=0.8`
          );

          if (!barcodeResponse.ok) {
            throw new Error(`Failed to fetch barcode: ${barcodeResponse.statusText}`);
          }

          const barcodeData = await barcodeResponse.json();
          setBarcodeImg(barcodeData.barcode_data_url);
          newBarcodeImg = barcodeData.barcode_data_url;
        } catch (error) {
          console.error("Error:", error);
        }

        const labelData = {
          userId: user.id,
          carrier: formData.carrier,
          vendor: formData.vendor,
          labelType: formData.labelType,
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
          barcodeImg: newBarcodeImg,
          trackingNumber: pulledTrackingNumber,
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
                amount: -(user.rate),
                count: 1,
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

            newLabels.push(labelData);
            labelHistory.push(labelData);
          } else {
            console.error(`Error generating label for row ${i + 1}: ${result.msg}`);
          }
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }

      setGeneratedLabels(newLabels);

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
    const uspsVendors = ["Shippo", "Rollo", "Evs"];
    const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];
    const uspsPreVendors = ["ATFM"];

    if (selectedCarrier === "USPS") {
      setAvailableVendors(uspsVendors);
    } else if (selectedCarrier === "UPS") {
      setAvailableVendors(upsVendors);
    } else if (selectedCarrier === "USPS(Pre Shipment)") {
      setAvailableVendors(uspsPreVendors);
    } else {
      setAvailableVendors([]);
    }

    setFormData((prev) => ({
      ...prev,
      carrier: selectedCarrier,
      vendor: "",
    }));
  };

  const handleVendorChange = (e) => {
    const ATFMLabelTypes = ["preship"];
    const ShippoLabelTypes = ["ground_advantage", "priority"];
    const EvsLabelTypes = ["ground_advantage", "priority"];
    const RolloLabelTypes = ["ground_advantage", "priority"];

    if (e.target.value === "Shippo") {
      setVendorLabelType(ShippoLabelTypes);
    } else if (e.target.value === "ATFM") {
      setVendorLabelType(ATFMLabelTypes);
    } else if (e.target.value === "Evs") {
      setVendorLabelType(EvsLabelTypes);
    } else if (e.target.value === "Rollo") {
      setVendorLabelType(RolloLabelTypes);
    } else {
      setVendorLabelType("");
    }

    setFormData((prev) => ({
      ...prev,
      vendor: e.target.value,
      labelType: "",
    }));
  };

  return (
    <div>
      <div className="container">
        <div className="dashboard_Sec">
          <div className="dashboard_left">
            <Sidebar />
          </div>
          <div className="dashboard_right">
            <h4 className="create_sec_heading" style={{ marginBottom: "24px" }}>
              Generate Bulk Labels
            </h4>

            <h4>Download Sample Sheets</h4>
            <button onClick={downloadSampleSheet} className="download_button">
              Download Sample Sheet
            </button>
            <p className="text-warning" style={{ color: "red", marginBottom: "10px" }}>
              *Follow below sample to generate labels, format except this sample will not be accepted
            </p>

            <div className="form-row">
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleCarrierChange}
                className="form-select bulk_form_select"
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
                className="form-select bulk_form_select"
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
                className="form-select bulk_form_select"
              >
                <option value="" disabled>
                  --- Select Shipping Service ---
                </option>
                {vendorLabelType.length > 0
                  ? vendorLabelType.map((labelType, index) => (
                      <option key={index} value={labelType}>
                        {labelType === "preship" ? "priority" : labelType}
                      </option>
                    ))
                  : (
                      <option value="" disabled>
                        No Service Available
                      </option>
                    )}
              </select>
            </div>

            <h4>Upload CSV</h4>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button
              onClick={handleProcessFile}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Process File
            </button>
            <p>
              Progress: {labelsGenerated} / {totalRows} labels generated
            </p>

            {generatedLabels.length > 0 && (
              <BulkDownloadLabels labelDataList={generatedLabels} uploadedExcelFile={file} />
            )}

            {missRow.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                Label not Generated for :
                <ol>
                  {missRow.map((error, idx) => (
                    <li key={idx} style={{ color: "red" }}>
                      {error}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;