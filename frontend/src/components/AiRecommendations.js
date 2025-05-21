import axios from "axios";
import React, { useState, useRef } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";

function AiRecommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const promptRef = useRef(null);

  async function generateRecommendations() {
    const prompt = promptRef.current.value.trim();
    if (!prompt) {
      alert("Please enter a prompt before generating recommendations!");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/ai-recom/ai-recommendations`,
        { prompt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setRecommendations([
        ...recommendations,
        { user: prompt, ai: res.data.recommendation },
      ]);
      promptRef.current.value = "";
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setErrorMessage("Failed to generate recommendations. Please try again later.");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  // Beautified Styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
      padding: "2rem",
      fontFamily: "'Poppins', sans-serif",
      marginTop: "3rem",
    },
    header: {
      textAlign: "center",
      fontSize: "21px",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#2c3e50",
    },
    chatWindow: {
      height: "400px",
      overflowY: "auto",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #f7f9fc, #ecf1f8)",
      boxShadow: "inset 0 4px 10px rgba(0,0,0,0.05)",
      padding: "1.2rem",
      marginBottom: "1.5rem",
      border: "1px solid #dde2eb",
    },
    userMessage: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "0.75rem 1rem",
      borderRadius: "15px",
      maxWidth: "70%",
      alignSelf: "flex-end",
      marginLeft: "auto",
      marginBottom: "0.5rem",
      fontSize: "1rem",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
    },
    aiMessage: {
      backgroundColor: "#fff",
      border: "1px solid #ced4da",
      padding: "0.75rem 1rem",
      borderRadius: "15px",
      maxWidth: "70%",
      fontSize: "1rem",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    textarea: {
      width: "100%",
      borderRadius: "8px",
      border: "1px solid #ced4da",
      padding: "0.8rem",
      fontSize: "1rem",
      resize: "vertical",
      marginBottom: "1rem",
      outline: "none",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "0.3s",
    },
    generateButton: {
      backgroundColor: "primary",
      border: "none",
      borderRadius: "8px",
      padding: "0.8rem 1.5rem",
      fontSize: "1.1rem",
      display: "block",
      margin: "auto",
      fontWeight: "bold",
      color: "#fff",
      cursor: "pointer",
      transition: "0.3s",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    buttonHover: {
      backgroundColor: "primary",
    },
    spinnerContainer: {
      textAlign: "center",
      marginTop: "1rem",
      color: "#333",
    },
  };

  return (
    <div style={styles.container}>
      {/* Error Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#dc3545", color: "#fff" }}>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <h2 style={styles.header}>✨Personal AI Assistant</h2>

      {loading && (
        <div style={styles.spinnerContainer}>
          <Spinner animation="border" variant="primary" />
          <p>Generating recommendation...</p>
        </div>
      )}

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {recommendations.length === 0 ? (
          <p className="text-muted" style={{ textAlign: "center",fontSize: "1rem" }}>
            Please enter a prompt with your preferences or just click <span className="fw-bold">Generate!</span> to see AI magic happen! ✨
          </p>
        ) : (
          recommendations.map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <div style={styles.userMessage}>{item.user}</div>
              <div style={styles.aiMessage}>
                <ReactMarkdown>{item.ai}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prompt Input */}
      <textarea
        ref={promptRef}
        style={styles.textarea}
        rows="3"
        placeholder="Tell AI your preferences..."
      />

      {/* Generate Button with Hover Effect */}
      <Button
        style={styles.generateButton}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.generateButton.backgroundColor)}
        onClick={generateRecommendations}
      >
       Generate!
      </Button>
    </div>
  );
}

export default AiRecommendations;
