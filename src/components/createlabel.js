// CreateLabel.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import HandleLabel from "./HandleLabel";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Dashboardhead from "./Dashboardhead";
const CreateLabel = () => {
  // const { user, setUser } = useContext(AuthContext);
  const { user, updateUser } = useContext(AuthContext);
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
    "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  const loginUser = user;
  // console.log('the user data is ',user)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
   const [vendorLabelType,setVendorLabelType] = useState([]);
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
  // try{
  //   const params = {
  //       user_name: 'johndoe',
  //       api_key: 'abc123',
  //       class: 'ground_advantage',
  //       count: 5
  //   };
  //   axios.get('https://my.labelscheap.com/api/generate_tracking.php', { params })
  //       .then(response => console.log(response.data))
  //       .catch(error => console.error('Error:', error));
  // }
  // catch{};
  // const { user } = useContext(AuthContext); // Get admin token
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
        weight: ""
    });

    const [showLabel, setShowLabel] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };    
    const handleGenerateLabel = async () => {
      console.log("Token being sent:", loginUser.token);

      if (loginUser.availableBalance <= loginUser.rate) {
        alert("Insufficient balance to generate a label.");
        return;
      }
    
      setShowLabel(false); // Reset the label state before generation
    
      try {
        const labelData = { ...formData, userId: loginUser.id };
        const apiResponse = await fetch(`https://my.labelscheap.com/api/generate_tracking.php?user_name=sarim&api_key=4ec5cdddf39363d957608a7927b6dc28be4211c9f5cc3e836cb12abb61054aca&vendor=${formData.vendor}&class=${formData.labelType}&count=1`);
        const data = await apiResponse.json();
        const pulledTrackingNumber = data.tracking_numbers[0];
        console.log("Retrieved shipment trackingNumber:", pulledTrackingNumber);

        setFormData(prev => ({ ...prev, trackingNumber: pulledTrackingNumber }));
      
        console.log("Retrieved shipment trackingNumber:", pulledTrackingNumber);


        
        // ///locally call api for tracking get from sheet
        // const data = await apiResponse.json();
        //   const pulledTrackingNumber = pullTracking;
        //   console.log("Retrieved shipment trackingNumber by name cheap:", pullResponse);

        // const pullResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/pull/shipts`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${user.token}`
        //       },
        //     body: JSON.stringify({
        //       labelType: formData.labelType,
        //       carrier: formData.carrier.toLowerCase(),
        //     })
        //   });
        
        // //   // Check if the pull call succeeded
        //   if (!pullResponse.ok) {
        //     const errText = await pullResponse.text();
        //     alert(errText)
        //     throw new Error(`Pull shipment error: ${errText}`);
        //   }
        //   const shipmentResult = await pullResponse.json();
        //   var pulledTrackingNumber;
        //   if (shipmentResult.shipment && shipmentResult.shipment.tracking) {
        //      pulledTrackingNumber = shipmentResult.shipment.tracking;
        //     setFormData(prev => ({ ...prev, trackingNumber: pulledTrackingNumber }));
        //     setTrackingNumber(pulledTrackingNumber);
        //   } else {
        //     console.error('Invalid shipment data:', shipmentResult);
        //     alert('Failed to retrieve tracking number.');
        //   }
          
      
          // Update state with the pulled tracking number so it's available for preview/download
          // setTrackingNumber(shipmentResult.shipment.tracking);
          // const pulledTrackingNumber = shipmentResult.shipment.tracking;
          


   

        // Call API to update both balance and labels in one request
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/generate-label/${loginUser.id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${loginUser.token}`,  // Ensure 'Bearer' is included
          },
          body: JSON.stringify({
            amount: -(loginUser.rate),         // To deduct balance
            count: 1,           // To increment total label count
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
            recipientZip: formData.recipientZip,
          })
          
        });
    
        const result = await response.json();
        console.log(result)
    
        if (response.ok) {
          // Update the local state if the API call is successful
          // setLoginUser(result.user);

          updateUser({
            availableBalance: result.availableBalance,
            totalGeneratedLabels: result.totalGeneratedLabels,
        });
    
          setShowLabel(true); // Show the generated label
          console.log("Label generated successfully!", formData);

        } else {
          alert(result.msg || "Failed to generate label. Please try again.");
        }
      } catch (error) {
        console.error("Error generating label:", error);
        // alert("An error occurred while generating the label.");
      }
    };
    const handleCarrierChange = (e) => {
      const selectedCarrier = e.target.value;

      // Default vendors for USPS
      const uspsVendors = ["ATFM", "Shippo", "Rollo","Evs"];
      const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];
     
      

      // Find the selected carrier from allowedCarriers
      const carrierData = allowedCarriers.find(carrier => carrier.carrier === selectedCarrier);
      
      // Set vendors based on selected carrie
      if (selectedCarrier === "USPS") {
          setAvailableVendors(uspsVendors);
      } else if (selectedCarrier === "UPS") {
        setAvailableVendors(upsVendors);
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
    const ATFMLabelTypes = ['ground_advantage','preship']
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
    else{
      setVendorLabelType('')
    }
      setFormData(prev => ({
          ...prev,
          vendor: e.target.value
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
                <input
                  type="text"
                  name="senderAddress"
                  placeholder="Address"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  className="form-input"
                />
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
                 
                <select
                  name="senderState"
                  value={formData.senderState}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="" disabled>
                    --- Select State ---
                  </option>
                  {usStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="senderZip"
                  placeholder="ZIP Code"
                  value={formData.senderZip}
                  onChange={handleChange}
                  className="form-input"
                />
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
                <input
                  type="text"
                  name="recipientAddress"
                  placeholder="Address"
                  value={formData.recipientAddress}
                  onChange={handleChange}
                  className="form-input"
                />
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
                <select
                  name="recipientState"
                  value={formData.recipientState}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="" disabled>
                    --- Select State ---
                  </option>
                  {usStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="recipientZip"
                  placeholder="ZIP Code"
                  value={formData.recipientZip}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Generate Label Button */}
            <button onClick={handleGenerateLabel} className="generate-button">
              Generate Label
            </button>

            {showLabel && <HandleLabel formData={formData} />}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateLabel;
