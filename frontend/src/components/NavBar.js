import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUserState } from "../redux/slices/userslice";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt, FaUtensils, FaBrain, FaHeartbeat, FaTachometerAlt } from "react-icons/fa";
import "./NavBar.css";

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
    <Navbar expand="lg" className="navbar-glass-a py-3">
      <Container>
        {/* Brand Name */}
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="brand-glow fs-2 px-3 text-dark"
        >
          DiaBite
        </Navbar.Brand>

        {/* Toggle Button */}
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

        {/* Collapsible Section */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            transition: "all 0.4s ease-in-out",
            padding: "1rem",
            borderRadius: "12px",
          }}
        >
          {/* Center Nav Links */}
          <Nav
            className="mx-auto d-flex fs-6 gap-3 text-center"
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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

          {/* Right Nav: Login/Logout Section */}
          <Nav
            className="text-center w-100 mt-3 mt-lg-0"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            {localStorage.getItem("token") ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/dashboard"
                  className="nav-link-glow d-flex align-items-center"
                  style={{ gap: "0.5rem" }}
                >
                  <FaTachometerAlt /> Dashboard
                </Nav.Link>

                <div
                  style={{
                    fontWeight: "500",
                    fontSize: "1rem",
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  Welcome,&nbsp;
                  <span className="highlight-text">
                    {currentUser?.name ||
                      (localStorage.getItem("currentUser")
                        ? JSON.parse(localStorage.getItem("currentUser")).payload.name
                        : "User")}
                  </span>
                </div>

                <Button
                  variant="danger"
                  className="btn-neon border-0"
                  style={{ width: "100%", maxWidth: "200px" }}
                  onClick={SignOut}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <Button
                as={NavLink}
                to="/signin"
                className="btn-neon border-0"
                style={{ width: "100%", maxWidth: "200px" }}
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
