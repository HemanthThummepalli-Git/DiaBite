import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUserState } from "../redux/slices/userslice";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUtensils, FaBrain, FaHeartbeat } from "react-icons/fa";
import "./NavBar.css"; // Import styles
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt } from "react-icons/fa";
const NavBar = () => {
  const { isLoggedIn, currentUser } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SignOut = () => {
    localStorage.removeItem("token");
    dispatch(resetUserState());
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="navbar-glass-a py-3 ">
      <Container className="">
        {/* Brand Name with Glow Effect */}
        <Navbar.Brand as={NavLink} to="/" className="brand-glow fs-2 px-3 text-dark">
          DiaBite
        </Navbar.Brand>

        <Navbar.Toggle 
  aria-controls="basic-navbar-nav" 
  style={{ 
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    fontSize: "1.2rem",
    transition: "all 0.3s ease-in-out",
  }} 
/>

<Navbar.Collapse 
  id="basic-navbar-nav" 
  style={{
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    transition: "all 0.4s ease-in-out",
  }}
>
  {/* Navigation Links */}
  <Nav className="mx-auto d-flex flex-column flex-lg-row fs-6 gap-3 text-center">
    <Nav.Link as={NavLink} to="/sugar-tracker" className="nav-link-glow">
      <FaHeartbeat className="me-1" /> Sugar Tracker
    </Nav.Link>
    <Nav.Link as={NavLink} to="/food-logging" className="nav-link-glow">
      <FaUtensils className="me-1" /> Food Logging
    </Nav.Link>
    <Nav.Link as={NavLink} to="/ai-recommendations" className="nav-link-glow">
      <FaBrain className="me-1" /> AI Recommendations
    </Nav.Link>
  </Nav>

  {/* Login / Logout Buttons */}
  <Nav className="text-center mt-3 mt-lg-0">
    {localStorage.getItem("token") ? (
      <div
        className="d-flex flex-column flex-lg-row align-items-center gap-2 gap-lg-3"
        style={{ width: "100%" }}
      >
        <Nav.Link
          as={NavLink}
          to="/dashboard"
          className="nav-link-glow d-flex align-items-center justify-content-center px-2"
          style={{ width: "100%", textAlign: "center" }}
        >
          <FaTachometerAlt className="me-1" />
          <div>Dashboard</div>
        </Nav.Link>

        <span
          className="welcome-text"
          style={{
            fontWeight: "500",
            color: "#333",
            textAlign: "center",
            width: "100%",
          }}
        >
          Welcome,{" "}
          <span className="highlight-text d-block">
            {currentUser?.name ||
              (localStorage.getItem("currentUser")
                ? JSON.parse(localStorage.getItem("currentUser")).payload.name
                : "User")}
          </span>
        </span>

        <Button
          variant="danger"
          className="btn-neon border-0"
          style={{ width: "100%" }}
          onClick={SignOut}
        >
          <FaSignOutAlt className="me-1" /> Logout
        </Button>
      </div>
    ) : (
      <Button
        as={NavLink}
        to="/signin"
        className="btn-neon border-0"
        style={{ width: "100%" }}
      >
        <FaSignInAlt className="me-1" /> Login
      </Button>
    )}
  </Nav>
</Navbar.Collapse>


      </Container>
    </Navbar>
  );
};

export default NavBar;