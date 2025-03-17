import React, { useState, useContext, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import AuthContext from "../context/AuthContext";
import BulkDownloadLabels from "./BulkDownloadLabels"; // Import new component
import Sidebar from "./Sidebar";
import Dashboardhead from "./Dashboardhead";
import ReactModal from 'react-modal';

const BulkUpload = () => {


  
  const { user, updateUser } = useContext(AuthContext);
  const [stateValidationErrors, setStateValidationErrors] = useState([]); // State for validation errors

  const [file, setFile] = useState(null);
  const [labelsGenerated, setLabelsGenerated] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [successMessage, setSuccessMessage] = useState(false);
  const [generatedLabels, setGeneratedLabels] = useState([]); // Store processed label data
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [availableLabels, setAvailableLabels] = useState([]);
   const [vendorLabelType,setVendorLabelType] = useState([]);
      const [barcodeImg, setBarcodeImg] = useState(null);
      let  [missRow,setmissrows] = useState([]);
        const [loading, setLoading] = useState(false); // New state for loading
        const fileInputRef = useRef(null); // Ref for file input

      
  let errors =[];
  const validStates = new Set([
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY","PR"
  ]);


  const validateStates = (rows) => {
    const errors = [];
    const requiredFields = [
      "senderName",
      "senderAddress",
      "senderCity",
      "senderState",
      "senderZip",
      "recipientName",
      "recipientAddress",
      "recipientCity",
      "recipientState",
      "recipientZip",
      "weight",
      "length",
      "width",
      "height",
    ];
  
    rows.forEach((row, index) => {
      // Check for missing required fields
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push(`Row ${index + 2}: Missing required field "${field}".`);
        }
      });
    
      if(row.weight > 70){
        errors.push(`Row ${index + 2} has greater weight: Max Allowed 70 lbs.`);

      }
       
      // Validate state abbreviations
      const senderState = row.senderState?.toUpperCase();
      const recipientState = row.recipientState?.toUpperCase();
  
      if (senderState && !validStates.has(senderState)) {
        errors.push(`Row ${index + 2}: Invalid senderState "${row.senderState}". Use a valid U.S. state abbreviation (e.g., NY for New York).`);
      }
      if (recipientState && !validStates.has(recipientState)) {
        errors.push(`Row ${index + 2}: Invalid recipientState "${row.recipientState}". Use a valid U.S. state abbreviation (e.g., NY for New York).`);
      }
    });
  
    return errors;
  };

  const [formData, setFormData] = useState({
    carrier: "",
    vendor: "",
    labelType: "",
  });

  const downloadSampleSheet = () => {
    // Sample data for the Excel sheet
    const sampleData = [
      {
        "vendor": "ATFM",
        "labelType": "ground_priority",
        "senderName": "VA Warehouse",
        "senderAddress": "108 Page Street",
        "senderAddress1": "10001",
        "senderPh": "1234",
        "senderCompany": "",
        "senderCity": "Berryville",
        "senderState": "VA",
        "senderZip": "22611",
        "recipientName": "Jasmine Diaz",
        "recipientAddress": "1226 THREE FORKS DR",
        "recipientAddress1": "22611",
        "recipientPh": "1234",
        "recipientCompany": "",
        "recipientCity": "Utica",
        "recipientState": "NY",
        "recipientZip": "22611",
         "weight": "6",
        "length":"11",
        "width":"11",
        "height":"11",
       
      },
    
    ];

    // Create a new workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Sheet");

    // Generate the Excel file as a binary string
    const excelBinaryString = XLSX.write(workbook, {
      type: "binary",
      bookType: "xlsx",
    });

    // Convert binary string to a Blob
    const excelBlob = new Blob([s2ab(excelBinaryString)], {
      type: "application/octet-stream",
    });

    // Trigger the download
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
  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value
    }
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
          // console.log("Allowed Carriers:", data); // Debugging
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

  const formatZipCode = (zip) => {
    // Convert input to string if it's not already a string
    const zipString = String(zip || '');
  
    // Split into parts based on the dash and take only the part before the dash
    const [zipPart1] = zipString.split('-');
  
    // Remove non-numeric characters and ensure the first part is at least 5 digits long
    const formattedZip = zipPart1.replace(/\D/g, '').padStart(5, '0');
  
    // Return the formatted ZIP code
    return formattedZip;
  };

  const handleProcessFile = async () => {
    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }
    if (!formData.carrier || !formData.vendor || !formData.labelType) {
      alert("Please select Carrier, Vendor, and Label Type before processing.");
      return;
    }

  
    setLoading(true); // Disable button and show loader

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      // if (rows.length > 40) {
      //   alert("Only 40 labels can be created at a time.");
      //   setLoading(false);// Disable button and show loader
      //   resetFileInput();
      //   return; // Stop further execution
      // }
      const stateErrors = validateStates(rows);
      if (stateErrors.length > 0) {
        setLoading(false);
        setStateValidationErrors(stateErrors);
        resetFileInput();
        // Set validation errors
        return; // Stop processing if validation fails
      }

      if (user.availableBalance < (user.rate)*(rows.length)) {
        setLoading(false);
        resetFileInput();
        alert(`Insufficient balance! Balance: ${user.availableBalance}, Required Balance ${(user.rate)*(rows.length)}`);
        return;
      }
      setStateValidationErrors([])
      setTotalRows(rows.length);
      setLabelsGenerated(0);
      const labelHistory = [];
      const newLabels = [];

    


for (let i = 0; i < rows.length; i++) {
  const row = rows[i];

  // if (
  //   !row.senderName || !row.senderAddress || !row.senderCity || 
  //   !row.senderState || !row.senderZip || 
  //   !row.recipientName || !row.recipientAddress || !row.recipientCity || 
  //   !row.recipientState || !row.recipientZip || !row.weight || !row.length || !row.width || !row.height
  // ) {
  //   errors.push(`Row ${i + 2}: Missing required fields.`);
  //   setmissrows(errors)
  //   continue; // Skip this row
  // }
  // if (errors.length > 0) {
  //   alert("Some rows were skipped due to missing data:\n" + errors.join("\n"));
  // }


  ///// one start here 

  let pulledTrackingNumber;
  const apiVendor = formData.vendor.toLowerCase();
  // console.log("API Vendor:", apiVendor);
  // console.log("Label Type:", formData.labelType);
  let newBarcodeImg;
  try {
    //   // Fetch tracking number from the API
    
      const backendResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/get/vtno`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vendor: apiVendor,
          labelType: formData.labelType,
        }),
      });
    
      if (!backendResponse.ok) {
        alert('Server Error Wait Our team try to fix');
       
      }
    
      const data = await backendResponse.json();
      pulledTrackingNumber = data.trackingNumber;
    
      // Update formData with the new tracking number
      setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));
    
     
      
  
      const formattedZip = formatZipCode(row.recipientZip)
  
      const barcodeResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/set/barcode?zip=${formattedZip}&tracking=${pulledTrackingNumber}`,
        {
          method: 'GET', // Explicitly specify GET
        }
      );
    
      if (!barcodeResponse.ok) {
        alert('Server Error Wait Our team try to fix');
        continue
      }
    
      const barcodeData = await barcodeResponse.json();
      setBarcodeImg(barcodeData.barcode_data_url);
      newBarcodeImg = barcodeData.barcode_data_url;
  
  
      // for local testing data
  
        //  for local 
    //   const pullResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pull/shipts`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${user.token}`,
    //   },
    //   body: JSON.stringify({
    //     labelType: formData.labelType,
    //     carrier: formData.carrier.toLowerCase(),
    //   }),
    // });
  
    // if (!pullResponse.ok) {
    //   const errText = await pullResponse.text();
    //   alert(errText);
    //   return;
    //   // throw new Error(`Pull shipment error: ${errText}`);
    // }
  
    // const shipmentResult = await pullResponse.json();
    // // alert(shipmentResult.shipment.tracking)
  
    // if (shipmentResult.shipment && shipmentResult.shipment.tracking) {
    //   pulledTrackingNumber = shipmentResult.shipment.tracking;
    //   setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));
    //   setTrackingNumber(pulledTrackingNumber);
      
    // } else {
    //   console.error("Invalid shipment data:", shipmentResult);
    //   alert("Failed to retrieve tracking number.");
    // }
  
    // const textData = {
    //   barcode_data_url:
    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvoAAAB8AgMAAABlB/yqAAAADFBMVEX///8AAABmVWZmgGYbl+3aAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA70lEQVR4nO3OQUrEQBAF0IoQEPfZi1svkSNkMXUfjzLH8DgexV/BcfbCgIv3CU2lu6v6VYmIyF+z9H6prY/q7uVIsWWne691X27rclSKPov+udOXNY33rpxmp9ZOXbWlyJdrqWdCZk5vZUKeS+N8c+d8Ylrm9D5h7dvpDEnXrOeQ83cm8PPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/M/2i/yL/Ly9Vt+vF+r3j7rNeX8Pz0/5slvWB4NJ8ydid0AAAAASUVORK5CYII=",
    //   success: true,
    // };
  
    //      setBarcodeImg(textData.barcode_data_url);
    //       newBarcodeImg = textData.barcode_data_url;
  
  
  
      
    } catch (error) {
      console.error('Error:', error);
      // Handle the error (e.g., show a message to the user)
    }
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
          height: row.height,
          width: row.width,
          length: row.length,
          barcodeImg : newBarcodeImg,
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
                amount: -(user.rate), // Deduct balance
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

            // console.log(`Label ${i + 1} generated successfully`);
          } else {
            console.error(`Error generating label for row ${i + 1}: ${result.msg}`);
          }
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }

      // console.log(labelHistory);

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

          setSuccessMessage(true)
          setFormData({
            carrier: "",
            vendor: "",
            labelType: "",
          });
          resetFileInput();

          // console.log("Bulk label history updated successfully", result);
        } else {
          console.error("Error updating bulk label history:", result.msg);
        }
      } catch (error) {
        console.error("Error sending bulk label history request:", error);
      }
      finally {
        setLoading(false); // Re-enable button after processing
        setFormData({
          carrier: "",
          vendor: "",
          labelType: "",
        });
        resetFileInput();
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCarrierChange = (e) => {
    const selectedCarrier = e.target.value;

    // Default vendors for USPS
    const uspsVendors = ["Shippo", "Rollo","Evs",'ATFM',''];
    const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];
     const uspsPreVendors = ['Easypost']
    

    // Find the selected carrier from allowedCarriers
    const carrierData = allowedCarriers.find(carrier => carrier.carrier === selectedCarrier);
    
    // Set vendors based on selected carrie
    if (selectedCarrier === "USPS") {
      setAvailableVendors(uspsVendors);
  } else if (selectedCarrier === "UPS") {
    setAvailableVendors(upsVendors);
  } else if (selectedCarrier === "USPS(Pre Shipment)") {
    setAvailableVendors(uspsPreVendors);
  } else {
      setAvailableVendors([]);
  }

  // Update form data
  setFormData(prev => ({
      ...prev,
      carrier: selectedCarrier,
      vendor: "" // Reset vendor when carrier changes
  }));
};

  // Handle Vendor Selection
  const handleVendorChange = (e) => {
    const ATFMLabelTypes = ['ground_advantage']
    const ShippoLabelTypes = ['ground_advantage','priority']
    const EvsLabelTypes = ['ground_advantage','priority']
    const RolloLabelTypes = ['ground_advantage','priority']
    const EasypostLabelTypes = ['preship']

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
    else if(e.target.value == 'Easypost'){
      setVendorLabelType(EasypostLabelTypes)
    }
    else{
      setVendorLabelType('')
    }
      setFormData(prev => ({
          ...prev,
          vendor: e.target.value,
          labelType: "",
      }));
    
  };


  return (
    <div>
      <ReactModal
  isOpen={successMessage}
  onRequestClose={() => setSuccessMessage(false)}
  contentLabel="Labels Generated Successfully"
  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
  }}
>
  <div className="tick-container">
    <div className="tick">✓</div> {/* Unicode tick symbol */}
  </div>
  <h2>Labels Generated Successfully!</h2>
  <button className="modal_close_btn" onClick={() => setSuccessMessage(false)}>X</button>
</ReactModal>
      {/* <Dashboardhead /> */}
      <div className="container">
        <div className="dashboard_Sec">
          <div className="dashboard_left">
            <Sidebar />
          </div>
          <div className="dashboard_right">
          <h4 className="create_sec_heading" style={{marginBottom:'24px'}}>Generate Bulk Labels</h4>
          <h4 style={{marginBottom:'20px'}}>Download Sample Sheets</h4>
       <button
          onClick={downloadSampleSheet}
          className="download_button"
          style={{marginBottom:'5px'}}
        >
          Download Sample Sheet
        </button>
            <p className="text-warning" style={{color:'red', marginBottom:'20px', fontSize:'14px'}}>
              Note: *Follow below sample to generate labels, format except this sample will not be accepted
            </p>
            {/* <h2 className="text-lg font-semibold mb-4">Bulk Label Upload</h2> */}
            <h4 style={{marginBottom:'10px'}}>Create Labels</h4>

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
                      <option key={index} value={formData.vendor == 'ATFM' && labelType == 'ground_advantage' 
                        ? 'ground_advantage_tm':labelType }>
                        {labelType == 'preship' ? 'priority' : labelType}
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
        
      
            <input type="file" accept="" onChange={handleFileUpload} ref={fileInputRef} />
            {loading ? (<button
        
              className="download_button"
              style={{backgroundColor:'black'}}
            >
              <span class="loader2"></span>
            </button>) : (

            <button
              onClick={handleProcessFile}
              className="download_button"
              style={{backgroundColor:'black'}}
            >
             Process File
            </button>
          )}
            <p>
              Progress: {labelsGenerated} / {totalRows} labels generated
            </p>

          
            {generatedLabels.length > 0 && <BulkDownloadLabels labelDataList={generatedLabels} uploadedExcelFile={file} />}

            {stateValidationErrors.length > 0 && (
        <div style={{ marginTop: '24px', color: 'red' }}>
          <h4>Validation Errors:</h4>
          <ul>
            {stateValidationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}


            {missRow.length > 0 && (
        <div style={{marginTop:'24px'}}>
          Label not Generated for :
          <ol>
          {missRow.map((error, idx) => (
            <li key={idx} style={{ color: 'red' }}>{error}</li>
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