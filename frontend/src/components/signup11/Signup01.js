import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup01 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Enter a valid email address.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!formData.age || formData.age < 10 || formData.age > 100)
      newErrors.age = "Enter a valid age (10-100).";
    if (!formData.gender) newErrors.gender = "Please select a gender.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form Data:", formData);
      navigate("/signup2", { state: formData });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "20px",
        fontFamily: "Poppins, sans-serif", backgroundColor: "#f5f5f5"
      }}
    >
      {/* Step Progress Bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        {["Step 1: Basic Info", "Step 2: Health Details", "Step 3: Preferences"].map(
          (step, index) => (
            <div
              key={index}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                minWidth: "150px",
                textAlign: "center",
                flex: "1 1 auto",
                backgroundColor:
                  index === 0 ? "#2196F3" : index === 0 ? "#4CAF50" : "#ddd",
                color: index === 0 ? "white" : "black",
              }}
            >
              {step}
            </div>
          )
        )}
      </div>

      {/* Signup Form Container */}
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          👋 Welcome! Let's get started.
        </h2>

        {/* Name Field */}
        <label style={{ fontWeight: "bold" }}>Full Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          style={inputStyle}
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}

        {/* Email Field */}
        <label style={{ fontWeight: "bold" }}>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          style={inputStyle}
        />
        {errors.email && <p style={errorStyle}>{errors.email}</p>}

        {/* Password Field */}
        <label style={{ fontWeight: "bold" }}>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Choose a strong password"
          style={inputStyle}
        />
        {errors.password && <p style={errorStyle}>{errors.password}</p>}

        {/* Age Field */}
        <label style={{ fontWeight: "bold" }}>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Your age"
          style={inputStyle}
        />
        {errors.age && <p style={errorStyle}>{errors.age}</p>}

        {/* Gender Field */}
        <label style={{ fontWeight: "bold" }}>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Choose one</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p style={errorStyle}>{errors.gender}</p>}

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: "#4caf50",
              color: "white",
              padding: "12px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#45a049")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4caf50")}
          >
            Next ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

// Common Input Field Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "5px 0 10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

// Error Message Styles
const errorStyle = {
  color: "red",
  fontSize: "12px",
  marginTop: "-5px",
  marginBottom: "10px",
};

export default Signup01;
