import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "./logo.png"; // Update with your logo path

const MyNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container className="d-flex justify-content-between align-items-center">
        {/* Logo Section */}
        <div className="col-4">
          <Navbar.Brand href="#">
            <img src={logo} alt="Logo" height="40" />
          </Navbar.Brand>
        </div>

        {/* Navbar Toggle for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Centered Navigation Links */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav>
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Right-side Links (Optional) */}
        <div className="col-4 d-flex justify-content-end">
          <Nav>
            <Nav.Link href="#login">Login</Nav.Link>
            <Nav.Link href="#signup">Sign Up</Nav.Link>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
