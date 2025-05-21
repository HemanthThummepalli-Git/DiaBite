import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetUserState } from "../redux/slices/userslice";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUtensils,
  FaBrain,
  FaHeartbeat,
  FaTachometerAlt,
} from "react-icons/fa";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { isLoggedIn, currentUser } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef(null);

  const SignOut = () => {
    localStorage.removeItem("token");
    dispatch(resetUserState());
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className="py-3"
      ref={navRef}
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className="brand-glow fs-2 px-3 text-dark"
        >
          DiaBite
        </Navbar.Brand>

        <Navbar.Toggle
  aria-controls="basic-navbar-nav"
  className={`animated-toggler ${expanded ? "expanded" : ""}`}
>
  <span className="bar top-bar"></span>
  <span className="bar middle-bar"></span>
  <span className="bar bottom-bar"></span>
</Navbar.Toggle>


        <Navbar.Collapse id="basic-navbar-nav">
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

          <Nav className="text-center mt-3 mt-lg-0">
            {localStorage.getItem("token") ? (
              <div className="d-flex flex-column flex-lg-row align-items-center gap-2 gap-lg-3">
                <Nav.Link
                  as={NavLink}
                  to="/dashboard"
                  className="nav-link-glow d-flex align-items-center justify-content-center px-2"
                >
                  <FaTachometerAlt className="me-1" />
                  <div>Dashboard</div>
                </Nav.Link>

              <div className="d-flex align-items-center">
              <span className="welcome-text d-flex gap-2 align-items-center justify-content-center">
                  Welcome,{" "}
                  <span className="highlight-text">
                    {currentUser?.name ||
                      (localStorage.getItem("currentUser")
                        ? JSON.parse(localStorage.getItem("currentUser")).payload.name
                        : "User")}
                  </span>
                </span>

                <Button
                  variant="danger"
                  className="btn-neon border-0"
                  onClick={SignOut}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </div>
                
              </div>
            ) : (
              <Button
                as={NavLink}
                to="/signin"
                className="btn-neon border-0"
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
