// CreateLabel.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import HandleLabel from "./HandleLabel";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";

const CreateLabel = () => {
  // const { user, setUser } = useContext(AuthContext);
  const { user, updateUser } = useContext(AuthContext);
  const loginUser = user;
  console.log('the user data is ',user)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);


    useEffect(() => {
        const fetchAllowedCarriers = async () => {
            try {
                if (!user?.id) return; // Ensure user is loaded

                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/allowed-carriers/${user.id}`, {
                    headers: { "Authorization": `Bearer ${user.token}` }
                });

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
        senderCity: "",
        senderState: "",
        senderZip: "",
        recipientName: "",
        recipientAddress: "",
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

      if (loginUser.availableBalance <= 0) {
        alert("Insufficient balance to generate a label.");
        return;
      }
    
      setShowLabel(false); // Reset the label state before generation
    
      try {
        const labelData = { ...formData, userId: loginUser.id };
        
         const pullResponse = fetch("https://my.labelscheap.com/api/generate_tracking.php?user_name=sarim&api_key=4ec5cdddf39363d957608a7927b6dc28be4211c9f5cc3e836cb12abb61054aca&vendor=rollo&class=ground_advantage&count=1")
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
          // const pulledTrackingNumber = pullTracking;
          console.log("Retrieved shipment trackingNumber by name cheap:", pullResponse);

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
        
          // Check if the pull call succeeded
          if (!pullResponse.ok) {
            const errText = await pullResponse.text();
            alert(errText)
            // throw new Error(`Pull shipment error: ${errText}`);
          }
        
          // Parse the shipment data
          const shipmentResult = await pullResponse.json();
          const pulledTrackingNumber = shipmentResult.tracking;
          console.log("Retrieved shipment trackingNumber:", pulledTrackingNumber);
      
          // Update state with the pulled tracking number so it's available for preview/download
          setTrackingNumber(pulledTrackingNumber);
          setFormData(prev => ({ ...prev, trackingNumber: pulledTrackingNumber }));
      
        //   console.log("Retrieved shipment trackingNumber:", trackingNumber);

        // Call API to update both balance and labels in one request
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/generate-label/${loginUser.id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${loginUser.token}`,  // Ensure 'Bearer' is included
          },
          body: JSON.stringify({
            amount: -1,         // To deduct balance
            count: 1,           // To increment total label count
            carrier: formData?.carrier,
            trackingNumber: pulledTrackingNumber,
            labelType: formData.labelType,
            vendor: formData.vendor,
            weight: formData.weight,
            senderName: formData.senderName,
            senderAddress: formData.senderAddress,
            senderCity: formData.senderCity,
            senderState: formData.senderState,
            senderZip: formData.senderZip,
            recipientName: formData.recipientName,
            recipientAddress: formData.recipientAddress,
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
      const uspsVendors = ["ATFM", "Shippo", "Rolo", "Easypost","Evs"];
      const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];

      // Find the selected carrier from allowedCarriers
      const carrierData = allowedCarriers.find(carrier => carrier.carrier === selectedCarrier);

      // Set vendors based on selected carrier
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
      setFormData(prev => ({
          ...prev,
          vendor: e.target.value
      }));
  };

    return ( 
        <div className="container">
        <div className="dashboard_Sec">
        <div className="dashboard_left"><Sidebar/></div>
        <div className="dashboard-right">
            <h2 className="text-lg font-semibold mb-4">USPS Label Generator</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>

                <select
                        name="carrier"
                        value={formData.carrier}
                        onChange={handleCarrierChange}
                        id="carrier_type_container"
                    >
                     <option value="" disabled>
                        --- Select Carrier---
                      </option>
                        {allowedCarriers.length > 0 ? (
                allowedCarriers.map((carrier, index) => (
                    <option key={index} value={carrier.carrier}>{carrier.carrier}</option>
                ))
            ) : (
                <option value="" disabled>No Allowed Carriers</option>
            )}
                    </select>
                    <select name="vendor" value={formData.vendor} onChange={handleVendorChange} id="vendor_type_container">
                <option value="" disabled>--- Select Vendor Type ---</option>
                {availableVendors.length > 0 ? (
                    availableVendors.map((vendor, index) => (
                        <option key={index} value={vendor}>{vendor}</option>
                    ))
                ) : (
                    <option value="" disabled>No Vendors Available</option>
                )}
            </select>
                    <h3>Label Type</h3>
                    <select
                        name="labelType"
                        value={formData.labelType}
                        onChange={handleChange}
                        id="label_type_container"
                    >
                        <option value="" disabled>
                            --- Select Label Type ---
                        </option>
                        <option value="ground_advantage">GROUND ADVANTAGE</option>
                        <option value="priority_mail">PRIORITY MAIL</option>
                    </select>
                    <h3 className="font-semibold">Sender Information</h3>
                    <input
                        type="text"
                        name="senderName"
                        placeholder="Name"
                        value={formData.senderName}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="senderAddress"
                        placeholder="Address"
                        value={formData.senderAddress}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="senderCity"
                        placeholder="City"
                        value={formData.senderCity}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="senderState"
                        placeholder="State"
                        value={formData.senderState}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="senderZip"
                        placeholder="ZIP Code"
                        value={formData.senderZip}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <div>
                    <h3 className="font-semibold">Recipient Information</h3>
                    <input
                        type="text"
                        name="recipientName"
                        placeholder="Name"
                        value={formData.recipientName}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="recipientAddress"
                        placeholder="Address"
                        value={formData.recipientAddress}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="recipientCity"
                        placeholder="City"
                        value={formData.recipientCity}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="recipientState"
                        placeholder="State"
                        value={formData.recipientState}
                        onChange={handleChange}
                        className="border p-2 w-full mb-2"
                    />
                    <input
                        type="text"
                        name="recipientZip"
                        placeholder="ZIP Code"
                        value={formData.recipientZip}
                        onChange={handleChange}
                        className="border p-2 w-full"
                    />
                </div>
                <input
                    type="number"
                    name="weight"
                    placeholder="Weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>
            {/* <input
                type="text"
                name="trackingNumber"
                placeholder="Tracking Number"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="border p-2 w-full mt-4"
            /> */}
            <button
                onClick={handleGenerateLabel}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
                Generate Label
            </button>

            {showLabel && <HandleLabel formData={formData}/>}
        </div>
        </div>
        </div>
    );
};

export default CreateLabel;
