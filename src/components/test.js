import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import HandleLabel from "./HandleLabel";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";

// Array of all US states
const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CreateLabel = () => {
  const { user, updateUser } = useContext(AuthContext);
  const loginUser = user;
  console.log("the user data is ", user);
  const [trackingNumber, setTrackingNumber] = useState(null);
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);

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
    weight: "",
    height: "",
    width: "",
    length: "",
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
      const apiResponse = await fetch(
        "https://my.labelscheap.com/api/generate_tracking.php?user_name=sarim&api_key=4ec5cdddf39363d957608a7927b6dc28be4211c9f5cc3e836cb12abb61054aca&vendor=rollo&class=ground_advantage&count=1"
      );
      const data = await apiResponse.json();
      const pulledTrackingNumber = data.tracking_numbers[0];
      console.log("Retrieved shipment trackingNumber:", pulledTrackingNumber);

      setTrackingNumber(pulledTrackingNumber);
      setFormData((prev) => ({ ...prev, trackingNumber: pulledTrackingNumber }));

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/generate-label/${loginUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginUser.token}`,
          },
          body: JSON.stringify({
            amount: -1, // To deduct balance
            count: 1, // To increment total label count
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
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.ok) {
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
    }
  };

  const handleCarrierChange = (e) => {
    const selectedCarrier = e.target.value;

    // Default vendors for USPS
    const uspsVendors = ["ATFM", "Shippo", "Rolo", "Easypost", "Evs"];
    const upsVendors = ["UPS 2nd Day Air", "UPS 3 Day", "UPS Ground", "UPS Next Day"];

    // Find the selected carrier from allowedCarriers
    const carrierData = allowedCarriers.find((carrier) => carrier.carrier === selectedCarrier);

    // Set vendors based on selected carrier
    if (selectedCarrier === "USPS") {
      setAvailableVendors(uspsVendors);
    } else if (selectedCarrier === "UPS") {
      setAvailableVendors(upsVendors);
    } else {
      setAvailableVendors([]);
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
    setFormData((prev) => ({
      ...prev,
      vendor: e.target.value,
    }));
  };

  return (
    <div className="container">
      <div className="dashboard_Sec">
        <div className="dashboard_left">
          <Sidebar />
        </div>
        <div className="dashboard-right">
          <h2 className="text-lg font-semibold mb-4">USPS Label Generator</h2>
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
                  --- Select Vendor Type ---
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
                  --- Select Label Type ---
                </option>
                <option value="ground_advantage">GROUND ADVANTAGE</option>
                <option value="priority_mail">PRIORITY MAIL</option>
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
                name="height"
                placeholder="Height (in)"
                value={formData.height}
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
                name="length"
                placeholder="Length (in)"
                value={formData.length}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Sender and Recipient Information */}
            <div className="form-columns">
              <div className="form-column">
                <h3 className="font-semibold">Sender Information</h3>
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
                  name="senderph"
                  placeholder="Phone no"
                  value={formData.senderph}
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
                <h3 className="font-semibold">Recipient Information</h3>
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
  );
};

export default CreateLabel;