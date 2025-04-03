// CreateLabel.js
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import HandleLabel from "./HandleLabel";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";
import ReactModal from 'react-modal';
import Dashboardhead from "./Dashboardhead";
import { Form, Modal, InputGroup } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { Toaster, toast } from "react-hot-toast";
const CreateLabel = () => {
  const [loading, setLoading] = useState(false); // New state for loading
  const [successMessage, setSuccessMessage] = useState(false);
  // const { user, setUser } = useContext(AuthContext);
  const { user, updateUser } = useContext(AuthContext);
  const [labelData, setLabelData] = useState(null); // New state for label data
  const [downloadState, setDownloadState] = useState(false)
  const [singleHistory, setSingleHistory] = useState([]);
  const [error, setError] = useState(null);
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
    { name: "Puerto Rico", abbreviation: "PR" },
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
    { name: "Wyoming", abbreviation: "WY" },

  ];
  const loginUser = user;
  // console.log('the user data is ',user)
  const [trackingNumber, setTrackingNumber] = useState(null)
  const [allowedCarriers, setAllowedCarriers] = useState([]);
  const [availableVendors, setAvailableVendors] = useState([]);
  const [vendorLabelType, setVendorLabelType] = useState([]);
  const [barcodeImg, setBarcodeImg] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

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
    barcodeImg: '',
    weight: "",
    height: "",
    length: "",
    width: ""
  });

  const [savedSenders, setSavedSenders] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    const storedSenders = JSON.parse(localStorage.getItem("savedSenders")) || [];
    setSavedSenders(storedSenders);
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setShow(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/label-history-single/${user.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch label history");
      }

      const data = await response.json();

      // setSingleHistory(data.labelHistory || []);
      // setBulkHistory(data.bulkLabelHistory || []);
      setSingleHistory((data.labelHistory || []).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt)));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const saveSenderToLocal = () => {
    const senderData = {
      senderName: formData.senderName,
      senderAddress: formData.senderAddress,
      senderAddress1: formData.senderAddress1,
      senderCity: formData.senderCity,
      senderPh: formData.senderPh,
      senderState: formData.senderState,
      senderZip: formData.senderZip
    };

    // Prevent duplicate sender entries
    const exists = savedSenders.some(sender =>
      sender.senderName === senderData.senderName &&
      sender.senderAddress === senderData.senderAddress &&
      sender.senderCity === senderData.senderCity &&
      sender.senderZip === senderData.senderZip
    );

    if (exists) {
      alert("Sender information is already saved!");
      return;
    }

    // Save only sender details in local storage
    const updatedSenders = [...savedSenders, senderData];
    localStorage.setItem("savedSenders", JSON.stringify(updatedSenders));
    setSavedSenders(updatedSenders);
    setShowSaveButton(false);
    alert("Sender details saved successfully!");
  };

  // Autofill sender details when selecting a saved sender
  const fillSenderDetails = (selectedSender) => {
    setFormData((prev) => ({
      ...prev, // Keep existing values (like carrier, vendor, length, width, etc.)
      ...selectedSender, // Only update sender-related fields
    }));

    setShowSuggestions(false);
    setShowSaveButton(false);
  };



  const [showLabel, setShowLabel] = useState(false);


  const [errors, setErrors] = useState({}); // State to manage validation errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "senderName") {
      setShowSuggestions(true);
    }

    const exists = savedSenders.some(sender =>
      sender.senderName === formData.senderName &&
      sender.senderAddress === formData.senderAddress &&
      sender.senderCity === formData.senderCity &&
      sender.senderZip === formData.senderZip
    );
    setShowSaveButton(!exists);
  };
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only check if the click is outside the input
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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
    if (!formData.weight) newErrors.weight = "weight is required";
    if (!formData.length) newErrors.length = "length is required";
    if (!formData.width) newErrors.width = "width is required";
    if (!formData.width) newErrors.width = "width is required";
    if (formData.weight > 70) newErrors.weight = "Max 70 lbs allowed";
    if (!formData.height) newErrors.height = "height is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleGenerateLabel = async () => {
    if (loginUser.availableBalance < loginUser.rate) {
      toast.error("Insufficient balance to generate a label.");
      return;
    }

    setShowLabel(false); // Reset label state before generation
    setLoading(true); // Disable button and show loader

    try {
      const isValid = validateForm();
      if (!isValid) return;

      const formatZipCode = (zip) => {
        const zipString = String(zip || "");
        const [zipPart1] = zipString.split("-");
        return zipPart1.replace(/\D/g, "").padStart(5, "0");
      };

      const apiVendor = formData.vendor.toLowerCase();
      let pulledTrackingNumber;
      let newBarcodeImg;
      let formattedZip = formatZipCode(formData.recipientZip);

      await toast.promise(
        (async () => {
          // Fetch tracking number
          const backendResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/admin/get/vtno`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                vendor: apiVendor,
                labelType: apiVendor == "easypost" ? "priority_r" : formData.labelType,
              }),
            }
          );

          if (!backendResponse.ok) {
            throw new Error("Server Error: Unable to fetch tracking number.");
          }

          const data = await backendResponse.json();
          pulledTrackingNumber = data.trackingNumber;

          setFormData((prev) => ({
            ...prev,
            trackingNumber: pulledTrackingNumber,
          }));

          // Fetch barcode image
          const barcodeResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/admin/set/barcode?zip=${formattedZip}&tracking=${pulledTrackingNumber}`
          );

          if (!barcodeResponse.ok) {
            throw new Error("Failed to fetch barcode.");
          }

          const barcodeData = await barcodeResponse.json();
          setBarcodeImg(barcodeData.barcode_data_url);
          newBarcodeImg = barcodeData.barcode_data_url;

          // Generate label
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/auth/generate-label/${loginUser.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loginUser.token}`,
              },
              body: JSON.stringify({
                amount: -loginUser.rate,
                count: 1,
                carrier: formData.carrier,
                trackingNumber: pulledTrackingNumber,
                labelType: formData.labelType,
                vendor: formData.vendor,
                weight: formData.weight,
                height: formData.height,
                width: formData.width,
                length: formData.length,
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
                barcodeImg: newBarcodeImg,
              }),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.msg || "Failed to generate label.");
          }

          updateUser({
            availableBalance: result.availableBalance,
            totalGeneratedLabels: result.totalGeneratedLabels,
          });

          setLabelData({
            ...formData,
            trackingNumber: pulledTrackingNumber,
            barcodeImg: newBarcodeImg,
          });

          setShowLabel(true);
          setSuccessMessage(true);
          setDownloadState(true)
          setFormData({
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
            barcodeImg: "",
            weight: "",
            length: "",
            height: "",
            width: "",
          });

          return "Label generated successfully!";
        })(),
        {
          loading: "Generating label...",
          success: "Label generated successfully! ✅",
          error: "Failed to generate label. Please try again.",
        }
      );
    } catch (error) {
      console.error("Error generating label:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCarrierChange = (e) => {
    const selectedCarrier = e.target.value;

    // Default vendors for USPS
    const uspsVendors = ["Shippo", "Rollo", "Evs", "ATFM"];
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
    const EasypostLabelTypes = ['preship']
    const ShippoLabelTypes = ['ground_advantage', 'priority']
    const EvsLabelTypes = ['ground_advantage', 'priority']
    const RolloLabelTypes = ['ground_advantage', 'priority']

    if (e.target.value == 'Shippo') {
      setVendorLabelType(ShippoLabelTypes)
    }
    else if (e.target.value == 'ATFM') {
      setVendorLabelType(ATFMLabelTypes)
    }
    else if (e.target.value == 'Evs') {
      setVendorLabelType(EvsLabelTypes)
    }
    else if (e.target.value == 'Rollo') {
      setVendorLabelType(RolloLabelTypes)
    }
    else if (e.target.value == 'Easypost') {
      setVendorLabelType(EasypostLabelTypes)
    }
    else {
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Address List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Sr #</th>
                <th>Sender Name</th>
                <th>Recepient Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                loading
                  ? Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton width={20} /></td>
                      <td><Skeleton width={150} /></td>
                      <td><Skeleton width={150} /></td>
                      <td><Skeleton width={10} /></td>


                    </tr>
                  ))
                  : singleHistory?.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.senderName}</td>
                      <td>{user.recipientName}</td>
                      <td> <button style={{ fontSize: "14px" }} className="contact-btn" onClick={() => {
                        setShow(false);
                        setFormData({
                          carrier: user.carrier,
                          vendor: user.vendor,
                          labelType: user.labelType,
                          senderName: user.senderName,
                          senderAddress: user.senderAddress,
                          senderAddress1: user.senderAddress1 ? user.senderAddress1 : "",
                          senderCity: user.senderCity,
                          senderPh: user.senderPh,
                          senderState: user.senderState,
                          senderZip: user.senderZip,
                          recipientName: user.recipientName,
                          recipientAddress: user.recipientAddress,
                          recipientAddress1: user.recipientAddress1 ? user.recipientAddress1 : "",
                          recipientPh: user.recipientPh,
                          recipientCity: user.recipientCity,
                          recipientState: user.recipientState,
                          recipientZip: user.recipientZip,
                          trackingNumber: user.trackingNumber,
                          barcodeImg: user.barcodeImg,
                          weight: user.weight,
                          length: user.length,
                          height: user.height,
                          width: user.width,
                        });
                      }}>
                        Get
                      </button></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Modal.Body>

      </Modal>
      <ReactModal
        isOpen={successMessage}
        onRequestClose={() => setSuccessMessage(false)}
        contentLabel="Label Generated Successfully"
        shouldCloseOnOverlayClick={false}  // Prevents closing when clicking outside
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            padding: "30px",
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          },
        }}
      >
        {/* Close button inside modal */}
        <button
          className="modal_close_btn"
          onClick={() => setSuccessMessage(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '15px',
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ❌
        </button>

        {/* Display label */}
        <div className="mt-4">
          {showLabel && <HandleLabel formData={labelData} barcodeImg={barcodeImg} setDownloadState={setDownloadState} downloadState={setDownloadState} />}
        </div>

      </ReactModal>
      {/* <Dashboardhead /> */}
      < div className="container" >
        <div className="mt-2">
          {/* <div className="dashboard_left">
            <Sidebar />
          </div> */}
          <div className="">
            {/* <h4 className="create_sec_heading" style={{ marginBottom: '24px' }}>Generate Label</h4> */}
            <div className="px-2">
              {/* Carrier, Vendor, Label Type */}
              <button style={{ fontSize: "14px" }} className="contact-btn" onClick={() => { fetchHistory() }}>
                Get Address List
              </button>
              <div className="form-row">
                <div className="w-100">
                  <div className="mt-4" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Select Carrier <span style={{ color: "red" }}>*</span>
                  </div>
                  <select
                    className="mt-2"
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

                <div className="w-100"
                >
                  <div className="mt-4" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Select Vendor <span style={{ color: "red" }}>*</span>
                  </div>
                  <select
                    className="mt-2"
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
                <div className="w-100">
                  <div className="mt-4" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Select Shipping Service <span style={{ color: "red" }}>*</span>
                  </div>
                  <select
                    className="mt-2"
                    name="labelType"
                    value={formData.labelType}
                    onChange={handleChange}


                  >
                    <option value="" disabled>
                      --- Select Shipping Service ---
                    </option>
                    {vendorLabelType.length > 0
                      ? vendorLabelType.map((labelType, index) => (
                        <option key={index} value={formData.vendor == 'ATFM' && labelType == 'ground_advantage'
                          ? 'ground_advantage_tm' : labelType}>
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
                <div className="form-input-main col-3">
                  <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Weight (lbs) <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="number"
                    name="weight"
                    placeholder="Enter Value"
                    value={formData.weight}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.weight && <p style={{ color: "red" }}>{errors.weight}</p>}
                </div>
                <div className="form-input-main col-3">
                  <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Length (in) <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="number"
                    name="length"
                    placeholder="Enter Value"
                    value={formData.length}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.length && <p style={{ color: "red" }}>{errors.length}</p>}
                </div>
                <div className="form-input-main col-3">
                  <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Width (in) <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="number"
                    name="width"
                    placeholder="Enter Value"
                    value={formData.width}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.width && <p style={{ color: "red" }}>{errors.width}</p>}
                </div>
                <div className="form-input-main col-3">
                  <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Height (in) <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="number"
                    name="height"
                    placeholder="Enter Value"
                    value={formData.height}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.height && <p style={{ color: "red" }}>{errors.height}</p>}

                </div>


              </div>

              {/* Sender and Recipient Information */}
              <div className="form-columns">
                <div className="form-column">
                  <div className="" style={{ fontSize: "20px", fontWeight: "700" }}>
                    Sender Information
                  </div>
                  {/* <h3 className="form_heading"></h3> */}
                  <div className="sender_info gap-2" style={{ position: 'relative' }}>
                    <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                      Name <span style={{ color: "red" }}>*</span>
                    </div>
                    <input
                      ref={inputRef} // Attach the ref to the input element
                      type="text"
                      name="senderName"
                      placeholder="Enter Name"
                      value={formData.senderName}
                      autocomplete="off"
                      onChange={handleChange}
                      onFocus={handleFocus}
                      className="form-input"
                    />

                    {showSuggestions && savedSenders.length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, border: "1px solid black", maxHeight: "150px", overflowY: "auto" }}>
                        {savedSenders.map((sender, index) => (
                          <li key={index} onClick={() => fillSenderDetails(sender)} style={{ padding: "5px", cursor: "pointer", background: "aliceblue", borderBottom: "1px solid black" }}>
                            {sender.senderName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {errors.senderName && <p style={{ color: "red" }}>{errors.senderName}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Address <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="senderAddress"
                    placeholder="Enter Address"
                    value={formData.senderAddress}
                    onChange={handleChange}
                    autocomplete="off"
                    className="form-input"
                  />
                  {errors.senderAddress && <p style={{ color: "red" }}>{errors.senderAddress}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Address 1
                  </div>
                  <input
                    type="text"
                    name="senderAddress1"
                    placeholder="Enter Address 1"
                    value={formData.senderAddress1}
                    onChange={handleChange}
                    autocomplete="off"
                    className="form-input"
                  />
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Phone No
                  </div>
                  <input
                    type="text"
                    name="senderPh"
                    placeholder="Enter Phone no"
                    value={formData.senderPh}
                    onChange={handleChange}
                    autocomplete="off"
                    className="form-input"
                  />
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    City <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="senderCity"
                    placeholder="Enter City"
                    value={formData.senderCity}
                    onChange={handleChange}
                    autocomplete="off"
                    className="form-input"
                  />
                  {errors.senderCity && <p style={{ color: "red" }}>{errors.senderCity}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    State
                  </div>
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
                      <option key={index} value={state.abbreviation}>
                        {state.name} ({state.abbreviation})
                      </option>
                    ))}
                  </select>
                  {errors.senderState && <p style={{ color: "red" }}>{errors.senderState}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Zip Code <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="senderZip"
                    placeholder="Enter ZIP Code"
                    value={formData.senderZip}
                    onChange={handleChange}
                    autocomplete="off"
                    className="form-input"
                  />

                  {errors.senderZip && <p style={{ color: "red" }}>{errors.senderZip}</p>}

                </div>

                <div className="form-column">
                  <div className="" style={{ fontSize: "20px", fontWeight: "700" }}>
                    Recipient Information
                  </div>
                  {/* <h3 className="form_heading"></h3> */}
                  <div className="" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Name <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="recipientName"
                    placeholder="Enter Name"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.recipientName && <p style={{ color: "red" }}>{errors.recipientName}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Address <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="recipientAddress"
                    placeholder="Enter Address"
                    value={formData.recipientAddress}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.recipientAddress && <p style={{ color: "red" }}>{errors.recipientAddress}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Address 1
                  </div>
                  <input
                    type="text"
                    name="recipientAddress1"
                    placeholder="Enter Address 1"
                    value={formData.recipientAddress1}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    Phone no
                  </div>
                  <input
                    type="text"
                    name="recipientPh"
                    placeholder="Enter Phone no"
                    value={formData.recipientPh}
                    onChange={handleChange}
                    className="form-input"
                  />
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    City <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="recipientCity"
                    placeholder="Enter City"
                    value={formData.recipientCity}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.recipientCity && <p style={{ color: "red" }}>{errors.recipientCity}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    State <span style={{ color: "red" }}>*</span>
                  </div>
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
                      <option key={index} value={state.abbreviation}>
                        {state.name} ({state.abbreviation})
                      </option>
                    ))}
                  </select>
                  {errors.recipientState && <p style={{ color: "red" }}>{errors.recipientState}</p>}
                  <div className="mt-2" style={{ fontSize: "16px", fontWeight: "600" }}>
                    ZIP Code <span style={{ color: "red" }}>*</span>
                  </div>
                  <input
                    type="text"
                    name="recipientZip"
                    placeholder="Enter ZIP Code"
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
              </button>) : (
                <>
                  <div className="mt-2 d-flex justify-content-center">
                    <button onClick={handleGenerateLabel} className="contact-btn col-6">
                      Generate Label
                    </button>
                  </div>

                </>

              )}

            </div>
          </div>

        </div>
      </div>

      {/* <button onClick={saveSenderToLocal}>Save Address</button> */}
    </div >
  );
};

export default CreateLabel;
