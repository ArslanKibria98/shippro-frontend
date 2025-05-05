import React, { useState, useEffect, useContext } from "react";
import { FaUserCircle, FaTimes } from "react-icons/fa"; // Added FaTimes for the close icon
import { MdLogout, MdPerson } from "react-icons/md"; // For logout and profile icons
import AuthContext from "../context/AuthContext";
import { Form, Modal, InputGroup } from "react-bootstrap";
import { Toaster, toast } from "react-hot-toast";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
// import "./Dashboardhead.css"; // Add CSS for styling
import logo from "../components/Images/ShipPRO.svg"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboardhead = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility
  const { user, logout } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const dataUser = JSON.parse(localStorage.getItem("userData"));
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  console.log(dataUser?.id, "userIduserId")
  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Add/remove body class when sidebar is open/closed
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [isSidebarOpen]);

  // Handle logout
  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
    logout(); // Call the logout function from AuthContext
  };

  // Handle profile click
  const handleProfile = () => {
    console.log("Profile clicked");
    // Add your profile logic here
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const handleSave = () => {
  //   // Handle password change logic here
  //   console.log("Email:", email);
  //   console.log("New Password:", password);
  //   handleClose();
  // };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve auth token

    const updatePasswordPromise = axios.put(
      dataUser?.dealerId ? `${process.env.REACT_APP_API_URL}/api/auth/update-password/dealer/${dataUser?.dealerId}/${dataUser?.id}` : `${process.env.REACT_APP_API_URL}/api/auth/update-password`,
      dataUser?.dealerId ? { oldPassword, newPassword } : { userId: dataUser.id, oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.promise(updatePasswordPromise, {
      loading: "Updating password...",
      success: "Password updated successfully!",
      error: "Error updating password. Please try again.",
    });

    try {
      const response = await updatePasswordPromise;
      setMessage(response.data.msg);
      setShow(false)
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error updating password");
    }
  };

  return (
    <div className="dashboard-header">
      {/* Logo on the left */}
      <div className="logo-container">
        <img src={logo} alt="" />
      </div>

      {/* User profile icon on the right */}
      <div className="user-icon-container" onClick={toggleSidebar}>
        <FaUserCircle className="user-icon" />
        <span className="username">{user?.name}</span> {/* Replace with dynamic user name */}
      </div>

      {/* Slide bar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Close button at the top of the sidebar */}
        <div className="sidebar-close" onClick={closeSidebar}>
          <FaTimes className="close-icon" />
        </div>

        {/* Sidebar items */}
        <div className="sidebar-item" onClick={handleProfile}>
          <MdPerson className="sidebar-icon" />
          <span>Profile</span>
        </div>
        <div className="sidebar-item" onClick={handleLogout}>
          <MdLogout className="sidebar-icon" />
          <div>Logout</div>
        </div>
        <div className="sidebar-item" onClick={handleShow}>
          <MdPerson className="sidebar-icon" />
          <div >Setting</div>
        </div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Old Password Field */}
              <Form.Group controlId="formOldPassword">
                <Form.Label>Old Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <InputGroup.Text onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: "pointer" }}>
                    {showOldPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>

              {/* New Password Field */}
              <Form.Group controlId="formNewPassword" className="mt-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <InputGroup.Text onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: "pointer" }}>
                    {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button className="theme-btn" onClick={handleClose}>
              Close
            </button>
            <button type="submit" className="contact-btn" style={{ fontSize: "14px" }} onClick={handlePasswordUpdate}>
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboardhead;