import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../components/Images/ShipPRO.svg"
import { Navbar, Nav, Container } from "react-bootstrap";
import LoginIcon from "../components/Images/loginIcon.svg"
import manImg from "../components/Images/manImg.svg"
import client from "../components/Images/Clientjoin.svg"
import brandPartner from "../components/Images/BrandPartner.svg"
import aboutUs from "../components/Images/AboutUs.svg"
import chooseUs from "../components/Images/WhyChooseUs.svg"
import order from "../components/Images/Howtoorder.svg"
import orderStats from "../components/Images/Orderstas.svg"
import testimonial from "../components/Images/Testimonial.svg"
import faq from "../components/Images/FAQ.svg"
import mail from "../components/Images/Group 61.svg"
import loc from "../components/Images/Group 62.svg"
import phone from "../components/Images/Vector.svg"
import sesos from "../components/Images/sosmed.svg"
import footerLogoPro from "../components/Images/ShipPRO.png"
import { FaTwitter, FaInstagram, FaFacebookF, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
const Home = () => {
  const navigate = useNavigate();
  const styles = {
    container: {

    },
    heading: {
      fontSize: '2.5em',
      color: '#333',
    },
    label: {
      display: 'block',
      marginTop: '20px',
      fontSize: '1.2em',
      color: '#555',
    },
    button: {
      marginTop: '30px',
      padding: '10px 20px',
      fontSize: '1em',
      color: '#fff',
      backgroundColor: 'var(--theme_color)',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },


  };

  return (
    <>

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
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center" style={{ justifyContent: "center" }}>
            <Nav>
              <Nav.Link >Home</Nav.Link>
              <Nav.Link >Services</Nav.Link>
              <Nav.Link >Contact Us</Nav.Link>
              <Nav.Link >About Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          {/* Right-side Links (Optional) */}
          <div className="col-4 d-flex justify-content-end">
            <Nav>
              <Nav.Link href="#login">
                <button className='theme-btn align-items-center d-flex' onClick={() => navigate('/login')}>
                  <img src={LoginIcon} alt="" />
                  <span className='ps-2' style={{ color: "#0155A5", fontSize: "21px", fontWeight: "600" }}>Login</span>
                </button>
              </Nav.Link>

            </Nav>
          </div>
        </Container>
      </Navbar>
      <div className='col-12 d-flex mt-5 px-3'>
        <div className='col-5' style={{ marginTop: "60px" }}>
          <img src={manImg} alt="" />
        </div>
        <div className='col-7'>
          <div>
            <span style={{ color: "#1C2F41", fontSize: "96px", fontWeight: "700", lineHeight: "100px" }}>
              The trusted provider of
            </span>
            <br />
            <span style={{ color: "#14A39A", fontSize: "96px", fontWeight: "700", lineHeight: "100px" }}>

              E-Commerce Business Services!
            </span>
          </div>
          <div style={{ color: "#666666", fontSize: "16px", fontWeight: "400", lineHeight: "32px" }}>
            ShipPro: The trusted provider of E-commerce business solutions &  services, delivering fast and reliable shipping solutions for your business.
          </div>
          <div className='mt-4'>
            <button className='contact-btn'> Contact Us</button>
          </div>
          <div className='col-12 mt-4'>
            <img src={client} width={421} height={80} alt="" />
          </div>
        </div>
      </div>
      <div>
        <img className='col-12' src={brandPartner} alt="" />
      </div>
      <div>
        <img className='col-12' src={aboutUs} alt="" />
      </div>
      <div>
        <img className='col-12' src={chooseUs} alt="" />
      </div>
      <div>
        <img className='col-12' src={order} alt="" />
      </div>
      <div>
        <img className='col-12' src={orderStats} alt="" />
      </div>
      <div >
        <img className='col-12' src={testimonial} alt="" />
      </div>
      <div>
        <img className='col-12' src={faq} alt="" />
      </div>
      <div className='col-12 d-flex justify-content-center pt-5 ' style={{ background: "#EAF0FF" }}>
        <div className='col-10' style={{ background: "#E3EBFF", borderRadius: "10px" }}>
          <div className='col-12 mt-5 d-flex justify-content-center' style={{ fontSize: "67px", color: "#1C2F41", fontWeight: "600" }}>
            Fill the form to contact us
          </div>
          <div className='col-12 d-flex justify-content-center' style={{ fontSize: "16px", color: "#666666", fontWeight: "600" }}>
            <div className='col-9 text-center'>
              Have a question or need assistance? Simply fill out the form to get in touch with our team. We’ll respond promptly to provide the support you need!
            </div>
          </div>
          <div className='mt-5 d-flex p-3 pb-5'>
            <div className='col-5 p-4'>
              <div className='p-4' style={{ background: "#0155A5", borderRadius: "10px" }}>
                <div style={{ fontSize: "28px", color: "#FFFFFF", fontWeight: "600" }}>
                  Contact Information
                </div>
                <div className='mt-2' style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                  ShipPRO at your service 24/7!
                </div>
                <div className='mt-3'>
                  <div style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                    <img src={mail} alt="" /> <span className='ps-2'>hello@website.com</span>
                  </div>
                </div>
                <div className='mt-3'>
                  <div className='d-flex' style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                    <img src={loc} alt="" /> <div className='ps-2'>
                      <div>
                        Riverside Building, County Hall,
                      </div>
                      <div>
                        London SE1 7PB, United Kingdom
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-3'>
                  <div style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                    <img src={phone} alt="" /> <span className='ps-2'>+02 5421234560</span>
                  </div>
                </div>
                <div className='mt-5'>
                  <div style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                    <img src={sesos} alt="" />

                  </div>
                </div>
              </div>

            </div>
            <div className='col-7 p-4'>
              <div className='p-4' style={{ background: "#FFFFFF", borderRadius: "10px" }}>


                <form className='mt-4'>
                  {/* Full Name */}
                  <div className="mb-4">
                    <label htmlFor="fullName" className="form-label fw-bold">
                      Full Name
                    </label>
                    <input
                      style={{ borderRadius: "20px", height: "50px" }}
                      type="text"
                      className="form-control"
                      id="fullName"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email
                    </label>
                    <input
                      style={{ borderRadius: "20px", height: "50px" }}
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Message */}
                  <div className="mb-5">
                    <label htmlFor="message" className="form-label fw-bold">
                      Message
                    </label>
                    <textarea
                      style={{ borderRadius: "20px", minHeight: "50px" }}
                      className="form-control"
                      id="message"
                      rows="4"
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis eleifend quam, non efficitur nisi mattis quis. "
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button className="btn btn-success w-100" style={{ borderRadius: "20px", height: "50px", background: "#2FB95D", border: "none" }}>
                    Get Started
                  </button>
                </form>

              </div>

            </div>
          </div>
        </div >
      </div >
      {/* <div className='home_box_container'>
        <div className='container'>
          <navbar className="text-white">
            <div className='logo navbar_logo'>Ship Pro</div>
            <ul className='navbar-list'>
              <li>Home</li>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Recharge</li>
            </ul>
          </navbar>

          <div className='main-box-content'>
            <h1 className='text-white'>Welcome to Ship Pro</h1>

            <button style={styles.button} onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      </div> */}
      {/* <div div className='work_style_container sec-distance' style={{ padding: '60px 0px' }}>
        <div className='container'>
          <h2 className='heading_main' style={{ textAlign: 'center' }}>How It Work</h2>
          <div class="row work_style_head" style={{ position: "relative" }}>
            <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="100">
              <div class="how-it-work-item">
                <span class="number">1</span>
                <div class="how-it-work-body">
                  <h2>Create Label</h2>
                  <p class="mb-5">You have the option to create shipping labels easily either by filling out a form or by uploading a CSV file.</p>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="200">
              <div class="how-it-work-item">
                <span class="number">2</span>
                <div class="how-it-work-body">
                  <h2>Download Shipping Label</h2>
                  <p class="mb-5">Subsequently, you can acquire the shipping label directly from your dashboard by clicking on download link..</p>

                </div>
              </div>
            </div>

            <div class="col-md-6 col-lg-4 mb-5 mb-lg-0 aos-init aos-animate" data-aos="fade" data-aos-delay="300">
              <div class="how-it-work-item">
                <span class="number">3</span>
                <div class="how-it-work-body">
                  <h2>Ready to Ship</h2>
                  <p class="mb-5">Affix the label onto your parcel/Package so it can be shipped using specific courier service..</p>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div > */}
      <footer className="text-white py-4" style={{ background: "#0155A5" }}>
        <div className="container">
          <div className="row mt-3">
            {/* Logo and Description */}
            <div className="col-md-4">
              <h4 className="fw-bold">
                <img src={footerLogoPro} alt="" />
              </h4>
              <p className='mt-5'>
                Choose ShipPRO for reliable, efficient, and tailored logistics
                solutions & services.
              </p>
              {/* Social Icons */}
              <div className="d-flex gap-2 mt-5">
                <a href="#" className="btn btn-success" style={{ borderRadius: "10px" }}>
                  <FaYoutube size={20} className="text-white" />
                </a>
                <a href="#" className="btn btn-outline-light " style={{ borderRadius: "10px" }}>
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="btn btn-outline-light" style={{ borderRadius: "10px" }}>
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="btn btn-outline-light" style={{ borderRadius: "10px" }}>
                  <FaFacebookF size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-md-2">
              <h5 className="fw-bold">Quick Links</h5>
              <ul className="list-unstyled">
                <li className='mt-5'><a className="text-white text-decoration-none">About Us</a></li>
                <li className='mt-4'><a className="text-white text-decoration-none">Service</a></li>
                <li className='mt-4'><a className="text-white text-decoration-none">Contact Us</a></li>
                <li className='mt-4'><a className="text-white text-decoration-none">Testimonial</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-md-3">
              <h5 className="fw-bold">Contact Us</h5>
              <div className='mt-5'>
                <div style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                  <img src={mail} alt="" /> <span className='ps-2'>hello@website.com</span>
                </div>
              </div>
              <div className='mt-4'>
                <div className='d-flex' style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                  <img src={loc} alt="" /> <div className='ps-2'>
                    <div>
                      Riverside Building, County Hall,
                    </div>
                    <div>
                      London SE1 7PB, United Kingdom
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4'>
                <div style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600" }}>
                  <img src={phone} alt="" /> <span className='ps-2'>+02 5421234560</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-md-3 mt-5">
              <h5 className="fw-bold">Newsletter</h5>
              <div className="d-flex pt-4">
                <input style={{ height: "60px", borderRadius: "0px", border: "none" }} type="email" className="form-control rounded-start" placeholder="Enter your email" />
                <button style={{ height: "60px", borderRadius: "0px", backgroundColor: "#2FB95D", border: "none" }} className="btn btn-success px-4 rounded-end">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};



export default Home;
