import React, { useState } from "react";
import zipcodes from "zipcodes"; // Import the zipcodes package

const HaversineTest = () => {
  const [originZip, setOriginZip] = useState("");
  const [destinationZip, setDestinationZip] = useState("");
  const [distance, setDistance] = useState(null);
  const [zone, setZone] = useState(null);

  // Function to calculate distance between ZIP codes using the Haversine formula
  const getDistance = (zip1, zip2) => {
    const loc1 = zipcodes.lookup(zip1);
    const loc2 = zipcodes.lookup(zip2);

    if (!loc1 || !loc2) return "Unknown";

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distance in miles
  };

  // Function to determine USPS Zone based on distance
  const getUSPSZone = (distance) => {
    if (distance === "Unknown") return "Unknown";
    if (distance <= 150) return 2;
    if (distance <= 300) return 3;
    if (distance <= 600) return 4;
    if (distance <= 1000) return 5;
    if (distance <= 1400) return 6;
    if (distance <= 1800) return 7;
    return distance > 1800 ? 8 : 9;
  };

  // Handle form submission
  const handleCalculate = () => {
    const calculatedDistance = getDistance(originZip, destinationZip);
    const calculatedZone = getUSPSZone(calculatedDistance);

    setDistance(calculatedDistance);
    setZone(calculatedZone);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", textAlign: "center", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>USPS Zone Calculator</h2>
      <input
        type="text"
        placeholder="Origin ZIP"
        value={originZip}
        onChange={(e) => setOriginZip(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Destination ZIP"
        value={destinationZip}
        onChange={(e) => setDestinationZip(e.target.value)}
        style={{ padding: "8px", marginBottom: "10px", width: "100%" }}
      />
      <button onClick={handleCalculate} style={{ padding: "10px", width: "100%", background: "#007bff", color: "white", border: "none", cursor: "pointer" }}>
        Calculate Zone
      </button>
      
      {distance !== null && (
        <div style={{ marginTop: "15px", textAlign: "left" }}>
          <p><strong>Distance:</strong> {distance} miles</p>
          <p><strong>USPS Zone:</strong> {zone}</p>
        </div>
      )}
    </div>
  );
};

export default HaversineTest;
