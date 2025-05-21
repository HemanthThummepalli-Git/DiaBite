import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup03 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state ?? {};

  const [formData, setFormData] = useState({
    ...prevData,
    dietaryPreference: "",
    dailyCaloricIntake: "",
    foodAllergies: "",
    mealTypePreference: "",
    activityLevel: "",
    weight: "",
    height: ""
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate Form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.dailyCaloricIntake) newErrors.dailyCaloricIntake = "Enter your daily calorie intake.";
    if (!formData.mealTypePreference) newErrors.mealTypePreference = "Select a meal type preference.";
    if (!formData.dietaryPreference) newErrors.dietaryPreference = "Select your dietary preference.";
    if (!formData.activityLevel) newErrors.activityLevel = "Select your activity level.";
    if (!formData.height || formData.height <= 0) newErrors.height = "Enter a valid height.";
    if (!formData.weight || formData.weight <= 0) newErrors.weight = "Enter a valid weight.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const finalData = {
        ...formData,
        foodAllergies: formData.foodAllergies.split(",").map((item) => item.trim()),
      };

      console.log("Final Form Data Sent to Backend:", finalData);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, finalData);

      if (response.status === 201) {
        navigate("/signin");
        alert("🎉 Signup Complete! Your details have been saved.");
      } else {
        alert("⚠️ Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("❌ Error signing up. Check console for details.");
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
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* Progress Steps */}
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
            index === 2 ? "#2196F3" : index === 1 || index === 0 ? "#4CAF50" : "#ddd",
          color: "white"
        }}
      >
        {step}
      </div>
    )
  )}
</div>


     
      {/* Form Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🎯 Final Touches</h2>

        {/* Daily Caloric Intake */}
        <label style={{ fontWeight: "bold" }}>Daily Caloric Intake (kcal):</label>
        <input
          type="number"
          name="dailyCaloricIntake"
          onChange={handleChange}
          placeholder="e.g., 2000"
          style={inputStyle}
        />
        {errors.dailyCaloricIntake && <p style={errorStyle}>{errors.dailyCaloricIntake}</p>}

        {/* Food Allergies */}
        <label style={{ fontWeight: "bold" }}>Food Allergies (if any):</label>
        <input
          type="text"
          name="foodAllergies"
          onChange={handleChange}
          placeholder="e.g., Nuts, Dairy"
          style={inputStyle}
        />

        {/* Meal Type Preference */}
        <label style={{ fontWeight: "bold" }}>Meal Type Preference:</label>
        <select name="mealTypePreference" onChange={handleChange} style={inputStyle}>
          <option value="">Select</option>
          <option value="Indian">Indian</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
          <option value="Mediterranean">Mediterranean</option>
          <option value="Continental">Continental</option>
        </select>
        {errors.mealTypePreference && <p style={errorStyle}>{errors.mealTypePreference}</p>}

        {/* Dietary Preference */}
        <label style={{ fontWeight: "bold" }}>Dietary Preference:</label>
        <select name="dietaryPreference" onChange={handleChange} style={inputStyle}>
          <option value="">Select</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="Paleo">Paleo</option>
          <option value="Omnivore">Omnivore</option>
        </select>
        {errors.dietaryPreference && <p style={errorStyle}>{errors.dietaryPreference}</p>}

        {/* Activity Level */}
        <label style={{ fontWeight: "bold" }}>Activity Level:</label>
        <select name="activityLevel" onChange={handleChange} style={inputStyle}>
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
        {errors.activityLevel && <p style={errorStyle}>{errors.activityLevel}</p>}

        {/* Height */}
        <label style={{ fontWeight: "bold" }}>Height (cm):</label>
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Your height in cm"
          style={inputStyle}
        />
        {errors.height && <p style={errorStyle}>{errors.height}</p>}

        {/* Weight */}
        <label style={{ fontWeight: "bold" }}>Weight (kg):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Your weight in kg"
          style={inputStyle}
        />
        {errors.weight && <p style={errorStyle}>{errors.weight}</p>}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button onClick={() => navigate("/signup2")} style={backButtonStyle}>⬅️ Back</button>
          <button onClick={handleSubmit} style={submitButtonStyle}>✅ Submit</button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  marginTop: "5px",
  border: "1px solid #ccc",
};

const errorStyle = {
  color: "red",
  fontSize: "12px",
};

const backButtonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "#ccc",
  border: "none",
  cursor: "pointer",
};

const submitButtonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default Signup03;
