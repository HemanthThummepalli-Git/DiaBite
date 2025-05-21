import React, { useState, useEffect } from "react";
import axios from "axios";
import CGMAnalysis from "./CGMAnalysis";
import { Modal, Form, Button, Alert, Card, Container, Spinner } from "react-bootstrap";
import { FaUtensils, FaHeartbeat, FaCalendarAlt, FaHistory, FaInfoCircle ,FaFilePdf, FaFileExcel} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CGMForm = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [formData, setFormData] = useState({
    mealType: "",
    fastingSugarLevel: "",
    preMealSugarLevel: "",
    postMealSugarLevel: "",
    date: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Spinner state
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchAnalysis();
      fetchHistory();
    } else {
      setIsLoggedIn(false);
      setMessage("Please log in to view and track your sugar levels");
    }
  }, []);

  
  const fetchAnalysis = async () => {
    try {
      setIsLoading(true); // Show spinner
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cgm/analyze`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching analysis:", error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cgm/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Show spinner on submit
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found, user must log in.");

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cgm/save`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(response.data.message);
      setAnalysis(response.data.analysis);
      fetchHistory();
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
    } finally {
      setIsLoading(false); // Hide spinner after fetching data
    }
  };
  
  const downloadExcel = () => {
    if (isDownloadingExcel) return;
    if (!history.length) {
      alert("No data available for download.");
      return;
    }

    setIsDownloadingExcel(true);

    const worksheet = XLSX.utils.json_to_sheet(history);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SugarHistory");
    XLSX.writeFile(workbook, "Sugar_History.xlsx");

    setTimeout(() => setIsDownloadingExcel(false), 2000);
  };

  const downloadPDF = () => {
    if (isDownloadingPDF) return;
    if (!history.length) {
      alert("No data available for download.");
      return;
    }

    setIsDownloadingPDF(true);

    const doc = new jsPDF();
    doc.text("Sugar Level History", 14, 10);

    const tableColumn = ["Date", "Meal Type", "Fasting Sugar", "Pre-Meal Sugar", "Post-Meal Sugar"];
    const tableRows = history.map((entry) => [
      new Date(entry.date).toLocaleDateString(),
      entry.mealType,
      entry.fastingSugarLevel || "-",
      entry.preMealSugarLevel || "-",
      entry.postMealSugarLevel || "-",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });

    doc.save("Sugar_History.pdf");

    setTimeout(() => setIsDownloadingPDF(false), 2000);
  };


  return (
    <Container className="d-flex flex-column gap-4 justify-content-center align-items-center mt-4 ">
      <div className="container mt-4">
        <div className="row g-4 justify-content-center align-items-center">
          {/* Sugar Level Tracking Form */}
          <div
  style={{
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    boxSizing: "border-box",
  }}
>
  <Card
    style={{
      padding: "1.5rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      border: "1px solid #dee2e6",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      boxSizing: "border-box",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        marginBottom: "1.5rem",
        fontWeight: "600",
        fontSize: "1.75rem",
      }}
    >
      Sugar Level Tracking
    </h2>

    {message && (
      <Alert
        variant="success"
        style={{
          textAlign: "center",
          fontSize: "1rem",
          fontWeight: "500",
          borderRadius: "8px",
        }}
      >
        {message}
      </Alert>
    )}

    <Form onSubmit={handleSubmit}>
      {/* Meal Type and Date side by side */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",  
          marginBottom: "1rem",
        }}
      >
      <div style={{ flex: "1", minWidth: "250px" }}>
          <Form.Group controlId="mealType">
            <Form.Label style={{ fontWeight: "500", color: "#495057" }}>
              <FaUtensils style={{ marginRight: "0.5rem" }} />
              Meal Type
            </Form.Label>
            <Form.Select
              name="mealType"
              value={formData.mealType}
              onChange={(e) =>
                setFormData({ ...formData, mealType: e.target.value })
              }
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                width: "100%",
              }}
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">🍳 Breakfast</option>
              <option value="lunch">🥗 Lunch</option>
              <option value="dinner">🍽️ Dinner</option>
            </Form.Select>
          </Form.Group>
        </div>

        <div style={{ flex: "1", minWidth: "250px" }}>
          <Form.Group controlId="date">
            <Form.Label style={{ fontWeight: "500", color: "#495057" }}>
              <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
              Date
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                width: "100%",
              }}
            />
          </Form.Group>
        </div>
      </div>


      {/* Other inputs remain the same */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        <div style={{ flex: "1 1 30%", minWidth: "160px" }}>
          <Form.Group controlId="fastingSugarLevel">
            <Form.Label style={{ fontWeight: "500", color: "#495057" , fontSize: "0.9rem"}}>
              <FaHeartbeat style={{ marginRight: "0.5rem" }} />
              Fasting Sugar
            </Form.Label>
            <Form.Control
              type="number"
              name="fastingSugarLevel"
              value={formData.fastingSugarLevel}
              onChange={(e) =>
                setFormData({ ...formData, fastingSugarLevel: e.target.value })
              }
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                width: "100%",
              }}
            />
          </Form.Group>
        </div>

        <div style={{ flex: "1 1 30%", minWidth: "160px" }}>
          <Form.Group controlId="preMealSugarLevel">
            <Form.Label style={{ fontWeight: "500", color: "#495057" , fontSize: "0.9rem"}}>
              <FaHeartbeat style={{ marginRight: "0.5rem" }} />
              Pre-Meal Sugar
            </Form.Label>
            <Form.Control
              type="number"
              name="preMealSugarLevel"
              value={formData.preMealSugarLevel}
              onChange={(e) =>
                setFormData({ ...formData, preMealSugarLevel: e.target.value })
              }
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                width: "100%",
              }}
            />
          </Form.Group>
        </div>

        <div style={{ flex: "1 1 30%", minWidth: "160px" }}>
          <Form.Group controlId="postMealSugarLevel">
            <Form.Label style={{ fontWeight: "500", color: "#495057" , fontSize: "0.9rem"}} >
              <FaHeartbeat style={{ marginRight: "0.5rem" }} />
              Post-Meal Sugar
            </Form.Label>
            <Form.Control
              type="number"
              name="postMealSugarLevel"
              value={formData.postMealSugarLevel}
              onChange={(e) =>
                setFormData({ ...formData, postMealSugarLevel: e.target.value })
              }
              style={{
                borderRadius: "8px",
                padding: "10px",
                border: "1px solid #ced4da",
                width: "100%",
              }}
            />
          </Form.Group>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isLoggedIn}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          backgroundColor: "#0d6efd",
          color: "#fff",
          border: "none",
          padding: "12px",
          fontWeight: "600",
          fontSize: "1rem",
          borderRadius: "8px",
          cursor: isLoggedIn ? "pointer" : "not-allowed",
        }}
      >
        📩 Submit Data
      </button>
    </Form>
  </Card>
</div>




          {/* Analysis Section */}
          {isLoggedIn && analysis && (
  <div className="col-12 col-md-6">
    <Card className="p-4 bg-white shadow-sm">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center gap-2" style={{ height: "5rem" }}>
          <Spinner animation="border" variant="primary" />
          <p style={{ marginTop: "10px", color: "#333" }}>Analyzing your health...</p>
        </div>
      ) : (
        <CGMAnalysis analysis={analysis} />
      )}
    </Card>
  </div>
)}

        </div>
      </div>
      
      <div className="w-100">
      <div className="p-3 w-100 mt-4">
        {history.length > 0 && (
          <Card className="border-0 mt-2 w-100 position-relative">

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* PDF Button */}
          <button
            onClick={downloadPDF}
            disabled={isDownloadingPDF}
            style={{
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '0.375rem',
              cursor: isDownloadingPDF ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isDownloadingPDF ? 0.6 : 1,
            }}
          >
            {isDownloadingPDF ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <FaFilePdf />
            )}
            Save as PDF
          </button>

          {/* Excel Button */}
          <button
            onClick={downloadExcel}
            disabled={isDownloadingExcel}
            style={{
              backgroundColor: '#198754',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '0.375rem',
              cursor: isDownloadingExcel ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isDownloadingExcel ? 0.6 : 1,
            }}
          >
            {isDownloadingExcel ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            ) : (
              <FaFileExcel />
            )}
            Save as Excel
          </button>
        </div>

        <Button
          variant="info"
          onClick={() => setShowGuide(true)}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            width: "40px",
            height: "40px",
            backgroundColor: "#138496",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            border: "none",
            zIndex: 10,
            transition: "background-color 0.3s ease-in-out, transform 0.2s ease-in-out",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#117a8b";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#138496";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "scale(0.9)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          <FaInfoCircle style={{ fontSize: "1.2rem" }} />
        </Button>

        <div
  style={{
    textAlign: 'center',
    backgroundColor: '#e9ecef',
    padding: '1rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  }}
>
  <h4
    style={{
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      userSelect: 'none',
    }}
  >
    <FaHistory /> Sugar Level History
  </h4>
</div>

<div style={{ overflowX: 'auto' }}>
  <table
    style={{
      width: '100%',
      marginTop: '1rem',
      borderCollapse: 'separate',
      minWidth: '600px',
      backgroundColor: '#fff',
      fontSize: '0.95rem',
      color: '#343a40',
    }}
  >
    <thead>
      <tr
        style={{
          backgroundColor: '#0d6efd',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '600',
          borderRadius: '0.5rem',
        }}
      >
        <th style={{ padding: '1rem', textAlign: 'center' }}>Date</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>Meal Type</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>Fasting Sugar</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>Pre-Meal Sugar</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>Post-Meal Sugar</th>
      </tr>
    </thead>
    <tbody>
      {[...history]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((entry, index) => {
          const badgeStyle = (level, low, mid, high) => {
            if (level === null || level === 0) {
              return {
                backgroundColor: 'transparent',
                color: '#6c757d',
                border: 'none',
              };
            }
            if (level < low) {
              return {
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
              };
            }
            if (level <= mid) {
              return {
                backgroundColor: '#198754',
                color: '#fff',
                border: 'none',
              };
            }
            if (level <= high) {
              return {
                backgroundColor: '#ffc107',
                color: '#212529',
                border: 'none',
              };
            }
            return {
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
            };
          };

          return (
            <tr
              key={index}
              style={{
                backgroundColor: '#fefefe',
                transition: 'background-color 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f3f5')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fefefe')}
            >
              <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                {entry.mealType}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25em 0.6em',
                    borderRadius: '0.375rem',
                    fontSize: '0.875em',
                    fontWeight: '600',
                    ...badgeStyle(entry.fastingSugarLevel, 100, 125, Infinity),
                  }}
                >
                  {entry.fastingSugarLevel === null || entry.fastingSugarLevel === 0
                    ? '-'
                    : `${entry.fastingSugarLevel} mg/dL`}
                </span>
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25em 0.6em',
                    borderRadius: '0.375rem',
                    fontSize: '0.875em',
                    fontWeight: '600',
                    ...badgeStyle(entry.preMealSugarLevel, 72, 99, 130),
                  }}
                >
                  {entry.preMealSugarLevel === null || entry.preMealSugarLevel === 0
                    ? '-'
                    : `${entry.preMealSugarLevel} mg/dL`}
                </span>
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center', verticalAlign: 'middle' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25em 0.6em',
                    borderRadius: '0.375rem',
                    fontSize: '0.875em',
                    fontWeight: '600',
                    ...badgeStyle(entry.postMealSugarLevel, 140, 180, Infinity),
                  }}
                >
                  {entry.postMealSugarLevel === null || entry.postMealSugarLevel === 0
                    ? '-'
                    : `${entry.postMealSugarLevel} mg/dL`}
                </span>
              </td>
            </tr>
          );
        })}
    </tbody>
  </table>
</div>



          </Card>
        )}
      </div>

      <Modal 
        show={showGuide} 
        onHide={() => setShowGuide(false)} 
        centered 
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">Help Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This section allows you to log your sugar levels for better tracking and monitoring of your diabetes. You can input the date, meal type, and sugar levels (fasting, pre-meal, post-meal). Once data is submitted, the AI analysis will provide insights based on your sugar levels.
          </p>

          <table className="table">
            <thead>
              <tr>
                <th>Measurement</th>
                <th>Good (Normal)</th>
                <th>Moderate</th>
                <th>Dangerous</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fasting Blood Sugar</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>Less than 100 mg/dL (5.6 mmol/L)</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>100 to 125 mg/dL (5.6 to 6.9 mmol/L)</td>
                <td style={{ backgroundColor: '#FF8A80' }}>126 mg/dL (7.0 mmol/L) or higher</td>
              </tr>
              <tr>
                <td>Pre-Meal Blood Sugar (Before eating)</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>80 to 130 mg/dL</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>Values outside of the target range, but not yet in the dangerous zone</td>
                <td style={{ backgroundColor: '#FF8A80' }}>Values outside of the target range, especially if consistently high</td>
              </tr>
              <tr>
                <td>Post-Meal Blood Sugar (2 hours after eating)</td>
                <td style={{ backgroundColor: '#A8E6CF' }}>Less than 140 mg/dL</td>
                <td style={{ backgroundColor: '#FFE0B2' }}>Values outside of the target range, but not yet in the dangerous zone</td>
                <td style={{ backgroundColor: '#FF8A80' }}>180 mg/dL or higher within 2 hours of eating</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center">
            <Button variant="secondary" onClick={() => setShowGuide(false)}>
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal></div>
    </Container>
  );
};

export default CGMForm;
