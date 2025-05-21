import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Signup02 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prevData = location.state || {};

  const [formData, setFormData] = useState({
    ...prevData,
    diabetesType: "",
    sugarLevels: [
      {
        mealType: "",
        fastingSugarLevel: "",
        preMealSugarLevel: "",
        postMealSugarLevel: "",
        date: new Date().toISOString(),
      },
    ],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      sugarLevels: [
        {
          ...formData.sugarLevels[0],
          [e.target.name]: e.target.value,
        },
      ],
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.diabetesType) newErrors.diabetesType = "Please select a diabetes type.";
    if (!formData.sugarLevels[0].mealType) newErrors.mealType = "Please select a meal type.";
    if (!formData.sugarLevels[0].fastingSugarLevel) newErrors.fastingSugarLevel = "Enter fasting sugar level.";
    if (!formData.sugarLevels[0].preMealSugarLevel) newErrors.preMealSugarLevel = "Enter pre-meal sugar level.";
    if (!formData.sugarLevels[0].postMealSugarLevel) newErrors.postMealSugarLevel = "Enter post-meal sugar level.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      console.log(formData);
      navigate("/signup3", { state: formData });
    }
  };

  return (
    <div style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", 
      justifyContent: "center", minHeight: "100vh", padding: "20px",
      fontFamily: "Poppins, sans-serif", backgroundColor: "#f5f5f5"
    }}>
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
                  index === 1 ? "#2196F3" : index === 0 ? "#4CAF50" : "#ddd",
                color: index === 2 ? "black" : "white",
              }}
            >
              {step}
            </div>
          )
        )}
      </div>


      {/* Form Container */}
      <div style={{
        width: "100%", maxWidth: "500px", padding: "30px",
        borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🩺 Health Details</h2>

        {/* Diabetes Type */}
        <label style={{ fontWeight: "bold" }}>Diabetes Type:</label>
        <select 
          name="diabetesType" 
          value={formData.diabetesType} 
          onChange={(e) => setFormData({ ...formData, diabetesType: e.target.value })} 
          style={{ width: "100%", padding: "10px", marginBottom: "5px", marginTop: "5px",borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Select Type</option>
          <option value="Type 1">Type 1</option>
          <option value="Type 2">Type 2</option>
          <option value="Gestational">Gestational</option>
        </select>
        {errors.diabetesType && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errors.diabetesType}</p>}

        {/* Meal Type */}
        <label style={{ fontWeight: "bold", marginTop: "10px" }}>Meal Type:</label>
        <select 
          name="mealType" 
          value={formData.sugarLevels[0].mealType} 
          onChange={handleChange} 
          style={{ width: "100%", padding: "10px", marginBottom: "5px",marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
        >
          <option value="">Select</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
        {errors.mealType && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errors.mealType}</p>}

        {/* Sugar Level Inputs */}
        {["Fasting Sugar Level", "Pre-meal Sugar Level", "Post-meal Sugar Level"].map((label, index) => {
          const name = ["fastingSugarLevel", "preMealSugarLevel", "postMealSugarLevel"][index];
          return (
            <div key={name} style={{ marginTop: "10px" }}>
              <label style={{ fontWeight: "bold" }}>{label}:</label>
              <input 
                type="number" 
                name={name} 
                value={formData.sugarLevels[0][name]} 
                onChange={handleChange} 
                style={{ width: "100%", padding: "10px", borderRadius: "5px",marginTop: "5px", border: "1px solid #ccc" }}
              />
              {errors[name] && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{errors[name]}</p>}
            </div>
          );
        })}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button 
            onClick={() => navigate("/signup1")} 
            style={{ 
              padding: "10px 20px", borderRadius: "5px", backgroundColor: "#ccc", 
              border: "none", cursor: "pointer", transition: "0.3s" 
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#bbb"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#ccc"}
          >
            ⬅️ Back
          </button>
          <button 
            onClick={handleNext} 
            style={{ 
              padding: "10px 20px", borderRadius: "5px", backgroundColor: "#2196F3", 
              color: "white", border: "none", cursor: "pointer", transition: "0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#1E88E5"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#2196F3"}
          >
            ➡️ Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup02;
