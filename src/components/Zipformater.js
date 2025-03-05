import React, { useState } from "react";

const ZipCodeFormatter = () => {
  const [zipCode, setZipCode] = useState("");

  // Function to format the zip code
  const formatZipCode = (zip) => {
    if (!zip) return ""; // Handle empty input
    let trimmedZip = zip.split("-")[0]; // Get digits before '-'
    return trimmedZip.padStart(5, "0"); // Ensure 5-digit format
  };

  const handleChange = (e) => {
    const rawZip = e.target.value;
    setZipCode(formatZipCode(rawZip)); // Format and update state
  };

  return (
    <div>
      <label>Enter ZIP Code:</label>
      <input
        type="text"
    
        onChange={handleChange}
        placeholder="Enter ZIP Code"
      />
      <p>Formatted ZIP Code: {zipCode}</p>
    </div>
  );
};

export default ZipCodeFormatter;
