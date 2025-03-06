// CreateLabel.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import HandleLabel from "./HandleLabel";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Dashboardhead from "./Dashboardhead";

const CreateLabel = () => {
  const [loading, setLoading] = useState(false); // New state for loading

  // const { user, setUser } = useContext(AuthContext);
  const { user, updateUser } = useContext(AuthContext);
 const usStates = [
    { name: "Alabama", abbreviation: "AL" },
    { name: "Alaska", abbreviation: "AK" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Montana", abbreviation: "MT" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "New York", abbreviation: "NY" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Washington", abbreviation: "WA" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "Wyoming", abbreviation: "WY" }
];
  const loginUser = user;
  // console.log('the user data is ',user)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
   const [vendorLabelType,setVendorLabelType] = useState([]);
   const [barcodeImg, setBarcodeImg] = useState(null);


   
    useEffect(() => {
        const fetchAllowedCarriers = async () => {
            try {
                if (!user?.id) return; // Ensure user is loaded

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/allowed-carriers/${user.id}`, {
                    headers: { "Authorization": `Bearer ${user.token}` }
                });

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
  
    const [formData, setFormData] = useState({
        carrier: "",
        vendor: "",
        labelType: "",
        senderName: "",
        senderAddress: "",
        senderAddress1: "",
        senderCity: "",
        senderPh: "",
        senderState: "",
        senderZip: "",
        recipientName: "",
        recipientAddress: "",
        recipientAddress1: "",
        recipientPh: "",
        recipientCity: "",
        recipientState: "",
        recipientZip: "",
        trackingNumber: "",
        barcodeImg:'',
        weight: ""
    });

    const [showLabel, setShowLabel] = useState(false);


    const [errors, setErrors] = useState({}); // State to manage validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for the field being updated
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.labelType) newErrors.labelType = "Service Type is required";
    // Sender validation
    if (!formData.senderName) newErrors.senderName = "Sender Name is required";
    if (!formData.senderAddress) newErrors.senderAddress = "Sender Address is required";
    if (!formData.senderCity) newErrors.senderCity = "Sender City is required";
    if (!formData.senderState) newErrors.senderState = "Sender State is required";
    if (!formData.senderZip) newErrors.senderZip = "Sender ZIP Code is required";

    // Recipient validation
    if (!formData.recipientName) newErrors.recipientName = "Recipient Name is required";
    if (!formData.recipientAddress) newErrors.recipientAddress = "Recipient Address is required";
    if (!formData.recipientCity) newErrors.recipientCity = "Recipient City is required";
    if (!formData.recipientState) newErrors.recipientState = "Recipient State is required";
    if (!formData.recipientZip) newErrors.recipientZip = "Recipient ZIP Code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleGenerateLabel = async () => {
    if (loginUser.availableBalance <= loginUser.rate) {
      alert("Insufficient balance to generate a label.");
      return;
    }
  
    setShowLabel(false); // Reset the label state before generation
    setLoading(true); // Disable button and show loader

    try {
      const isValid = validateForm();
      if (isValid) {

        


        // for online get tracking start here 
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



const apiVendor = formData.vendor.toLowerCase();
let formattedZip
// console.log("API Vendor:", apiVendor);
// console.log("Label Type:", formData.labelType);
let pulledTrackingNumber;
let newBarcodeImg;
try {
  
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
    throw new Error(`Failed to fetch tracking number: ${backendResponse.statusText}`);
  }

  const data = await backendResponse.json();
  pulledTrackingNumber = data.trackingNumber;

  // Update formData with the new tracking number
  setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));


  formattedZip = formatZipCode(formData.recipientZip)

  const barcodeResponse = await fetch(
    `${process.env.REACT_APP_API_URL}/api/admin/set/barcode?zip=${formattedZip}&tracking=${pulledTrackingNumber}`,
    {
      method: 'GET', // Explicitly specify GET
    }
  );

  if (!barcodeResponse.ok) {
    throw new Error(`Failed to fetch barcode: ${barcodeResponse.statusText}`);
  }

  const barcodeData = await barcodeResponse.json();
  setBarcodeImg(barcodeData.barcode_data_url);
  newBarcodeImg = barcodeData.barcode_data_url;
} catch (error) {
  console.error('Error:', error);
  // Handle the error (e.g., show a message to the user)
}






  // Fetch barcode based on the new tracking number




        // Use a callback to ensure the state is updated



//  for local production

        // const pullResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pull/shipts`, {
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
        //   throw new Error(`Pull shipment error: ${errText}`);
        // }
  
        // const shipmentResult = await pullResponse.json();
        // // let pulledTrackingNumber;
        // if (shipmentResult.shipment && shipmentResult.shipment.tracking) {
        //   pulledTrackingNumber = shipmentResult.shipment.tracking;
        //   setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));
        //   setTrackingNumber(pulledTrackingNumber);
        // } else {
        //   console.error("Invalid shipment data:", shipmentResult);
        //   alert("Failed to retrieve tracking number.");
        // }




        // for online get tracking url end here 

// Fetch the barcode image
// let newBarcodeImg;
        // const textData = {
        //   barcode_data_url:
        //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAvoAAAB8AgMAAABlB/yqAAAADFBMVEX///8AAABmVWZmgGYbl+3aAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAA70lEQVR4nO3OQUrEQBAF0IoQEPfZi1svkSNkMXUfjzLH8DgexV/BcfbCgIv3CU2lu6v6VYmIyF+z9H6prY/q7uVIsWWne691X27rclSKPov+udOXNY33rpxmp9ZOXbWlyJdrqWdCZk5vZUKeS+N8c+d8Ylrm9D5h7dvpDEnXrOeQ83cm8PPz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/Pz8/M/2i/yL/Ly9Vt+vF+r3j7rNeX8Pz0/5slvWB4NJ8ydid0AAAAASUVORK5CYII=",
        //   success: true,
        // };
  
        // setBarcodeImg(textData.barcode_data_url);
        // newBarcodeImg = textData.barcode_data_url





      
// get barcode from api
            try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/generate-label/${loginUser.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${loginUser.token}`,
                },
                body: JSON.stringify({
                  amount: -(loginUser.rate),
                  count: 1,
                  carrier: formData?.carrier,
                  trackingNumber: pulledTrackingNumber,
                  labelType: formData.labelType,
                  vendor: formData.vendor,
                  weight: formData.weight,
                  senderName: formData.senderName,
                  senderAddress: formData.senderAddress,
                  senderAddress1: formData.senderAddress1,
                  senderPh: formData.senderPh,
                  senderCity: formData.senderCity,
                  senderState: formData.senderState,
                  senderZip: formData.senderZip,
                  recipientName: formData.recipientName,
                  recipientAddress: formData.recipientAddress,
                  recipientAddress1: formData.recipientAddress1,
                  recipientPh: formData.recipientPh,
                  recipientCity: formData.recipientCity,
                  recipientState: formData.recipientState,
                  barcodeImg: newBarcodeImg,
                  recipientZip: formData.recipientZip,
                }),
              });
  
              const result = await response.json();
              // console.log(result);
  
              if (response.ok) {
                updateUser({
                  availableBalance: result.availableBalance,
                  totalGeneratedLabels: result.totalGeneratedLabels,
                });
                setShowLabel(true); // Show the generated label
              } else {
                alert(result.msg || "Failed to generate label. Please try again.");
              }
            } catch (error) {
              console.error("Error generating label:", error);
            }
          };
  
    } catch (error) {
      console.error("Error generating label:", error);
    }
    finally {
      setLoading(false); // Re-enable button after processing
    }
  };
    const handleCarrierChange = (e) => {
      const selectedCarrier = e.target.value;

      // Default vendors for USPS
      const uspsVendors = ["Shippo", "Rollo","Evs"];
      const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];
       const uspsPreVendors = ['ATFM']
      

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
    const ATFMLabelTypes = ['preship']
    const EasypostLabelTypes = ['preship']
    const ShippoLabelTypes = ['ground_advantage','priority']
    const EvsLabelTypes = ['ground_advantage','priority']
    const RolloLabelTypes = ['ground_advantage','priority']

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
      {/* <Dashboardhead /> */}
    <div className="container">
  
      <div className="dashboard_Sec">
        <div className="dashboard_left">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          <h4 className="create_sec_heading" style={{marginBottom:'24px'}}>Generate Label</h4>
          <div className="form-container">
            {/* Carrier, Vendor, Label Type */}
            <div className="form-row">
              <div className="form-select">
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleCarrierChange}
                
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
              </div>
            
            <div className="form-select"
            >
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleVendorChange}
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
              </div>
              <div  className="form-select">
              <select
                name="labelType"
                value={formData.labelType}
                onChange={handleChange}
               
              >
                <option value="" disabled>
                  --- Select Shipping Service ---
                </option>
                {vendorLabelType.length > 0
                  ? vendorLabelType.map((labelType, index) => (
                      <option key={index} value={labelType}>
                        {labelType == 'preship' ? 'priority' : labelType}
                      </option>
                    ))
                  : (
                      <option value="" disabled>
                        No Service Available
                      </option>
                    )}
              </select>
              {errors.labelType && <p style={{ color: "red" }}>{errors.labelType}</p>}
              </div>
            </div>

            {/* Weight, Height, Width, Length */}
            <div className="form-row">
              <input
                type="number"
                name="weight"
                placeholder="Weight (lbs)"
                value={formData.weight}
                onChange={handleChange}
                className="form-input"
              />
               <input
                type="number"
                name="length"
                placeholder="Length (in)"
                value={formData.length}
                onChange={handleChange}
                className="form-input"
              />
                 <input
                type="number"
                name="width"
                placeholder="Width (in)"
                value={formData.width}
                onChange={handleChange}
                className="form-input"
              />
              <input
                type="number"
                name="height"
                placeholder="Height (in)"
                value={formData.height}
                onChange={handleChange}
                className="form-input"
              />
           
             
            </div>

            {/* Sender and Recipient Information */}
            <div className="form-columns">
              <div className="form-column">
                <h3 className="form_heading">Sender Information</h3>
                <input
                  type="text"
                  name="senderName"
                  placeholder="Name"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="form-input"
                />
             {errors.senderName && <p style={{ color: "red" }}>{errors.senderName}</p>}

                <input
                  type="text"
                  name="senderAddress"
                  placeholder="Address"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  className="form-input"
                />
            {errors.senderAddress && <p style={{ color: "red" }}>{errors.senderAddress}</p>}

                <input
                  type="text"
                  name="senderAddress1"
                  placeholder="Address 1"
                  value={formData.senderAddress1}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="senderPh"
                  placeholder="Phone no"
                  value={formData.senderPh}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="senderCity"
                  placeholder="City"
                  value={formData.senderCity}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.senderCity && <p style={{ color: "red" }}>{errors.senderCity}</p>}

                <select
                  name="senderState"
                  value={formData.senderState}
                  onChange={handleChange}
                  className="form-select_state"
                >
                  <option value="" disabled>
                    --- Select State ---
                  </option>
                  {usStates.map((state, index) => (
                    <option key={index} value={state.name}>
                      {state.name} ({state.abbreviation})
                    </option>
                  ))}
                </select>
                {errors.senderState && <p style={{ color: "red" }}>{errors.senderState}</p>}

                <input
                  type="text"
                  name="senderZip"
                  placeholder="ZIP Code"
                  value={formData.senderZip}
                  onChange={handleChange}
                  className="form-input"
                />
                             
            {errors.senderZip && <p style={{ color: "red" }}>{errors.senderZip}</p>}

              </div>

              <div className="form-column">
                <h3 className="form_heading">Recipient Information</h3>
                <input
                  type="text"
                  name="recipientName"
                  placeholder="Name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="form-input"
                />
                        {errors.recipientName && <p style={{ color: "red" }}>{errors.recipientName}</p>}

                <input
                  type="text"
                  name="recipientAddress"
                  placeholder="Address"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  className="form-input"
                />
                        {errors.recipientAddress && <p style={{ color: "red" }}>{errors.recipientAddress}</p>}

                 <input
                  type="text"
                  name="recipientAddress1"
                  placeholder="Address1"
                  value={formData.recipientAddress1}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="recipientPh"
                  placeholder="Phone no"
                  value={formData.recipientPh}
                  onChange={handleChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="recipientCity"
                  placeholder="City"
                  value={formData.recipientCity}
                  onChange={handleChange}
                  className="form-input"
                />
                        {errors.recipientCity && <p style={{ color: "red" }}>{errors.recipientCity}</p>}

                <select
                  name="recipientState"
                  value={formData.recipientState}
                  onChange={handleChange}
                  className="form-select_state"
                >
                  <option value="" disabled>
                    --- Select State ---
                  </option>
                  {usStates.map((state, index) => (
                    <option key={index} value={state.name}>
                     {state.name} ({state.abbreviation})
                    </option>
                  ))}
                </select>
                {errors.recipientState && <p style={{ color: "red" }}>{errors.recipientState}</p>}

                <input
                  type="text"
                  name="recipientZip"
                  placeholder="ZIP Code"
                  value={formData.recipientZip}
                  onChange={handleChange}
                  className="form-input"
                />
                        {errors.recipientZip && <p style={{ color: "red" }}>{errors.recipientZip}</p>}

              </div>
            </div>

            {/* Generate Label Button */}
            {loading ? (<button
        
        className="generate-button"
     
      >
        <span class="loader2"></span>
         </button>):(
            <button onClick={handleGenerateLabel} className="generate-button">
              Generate Label
            </button>
            )}
            {showLabel && <HandleLabel formData={formData} barcodeImg={barcodeImg} />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateLabel;
