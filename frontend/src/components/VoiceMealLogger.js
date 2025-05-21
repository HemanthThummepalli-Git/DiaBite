import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { FaMicrophone, FaSyncAlt, FaUtensils, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

const VoiceMealLogger = () => {
    const [userId, setUserId] = useState(null);
    const [mealType, setMealType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);


    // Ensure transcript updates
    useEffect(() => {
        console.log("Transcript updated:", transcript);
    }, [transcript]);

    // Extract user ID from JWT token
    const getUserIdFromToken = (token) => {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id;
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    // Fetch user ID on component mount
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            const extractedUserId = getUserIdFromToken(storedToken);
            if (extractedUserId) setUserId(extractedUserId);
        }
    }, []);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    

    const handlePushToTalkStart = () => {
        if (!isListening) {
            resetTranscript(); // Clear previous transcript
            setIsListening(true);
            SpeechRecognition.startListening({ continuous: true, language: "en-US" });
        }
    };

    const handlePushToTalkEnd = () => {
        if (isListening) {
            SpeechRecognition.stopListening();
            setIsListening(false);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("User not logged in. Please log in first.");
            return;
        }
        if (!mealType || !transcript.trim()) {
            alert("Please select meal type and record your voice input.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/food/log/voice`,
                { mealType, voiceText: transcript },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Meal logged successfully!");
            resetTranscript();
        } catch (error) {
            console.error("Error logging meal:", error);
            alert("Failed to log meal. Try again.");
        }
        setIsSubmitting(false);
    };

    return (
        <div>
  <Row className="justify-content-center">
    {/* Voice-Based Meal Logging Form */}
    <Col lg={6} md={8} sm={12} className="mb-4 w-100">
      <Card className="shadow-sm rounded-3" style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
        <Card.Body>
          <Form>
            {/* Heading */}
            <div className="text-center">
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.5rem" }}>Voice-Based Food Logging</h2>
              <p className="text-muted" style={{ fontSize: "0.9rem" }}>Press & hold to record your meal using voice</p>
            </div>

            {/* Meal Type Selection */}
            <Form.Group controlId="mealType" className="mb-3">
              <Form.Label className="fw-semibold text-dark">
                <FaUtensils className="me-2 text-secondary" />
                Meal Type</Form.Label>
              <Form.Select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="p-2 rounded"
              >
                <option value="">Select Meal Type</option>
                <option value="breakfast">🍳 Breakfast</option>
                <option value="lunch">🥗 Lunch</option>
                <option value="dinner">🍽️ Dinner</option>
              </Form.Select>
            </Form.Group>

            {/* Voice Buttons */}
            <Row className="mb-3 g-3">
              <Col xs={12} sm={6}>
                <Button
                  variant={isListening ? "danger" : "primary"}
                  className="w-100 fw-semibold text-white"
                  onMouseDown={handlePushToTalkStart}
                  onMouseUp={handlePushToTalkEnd}
                  onTouchStart={handlePushToTalkStart}
                  onTouchEnd={handlePushToTalkEnd}
                  style={{ minHeight: "45px" }}
                >
                  {isListening ? (
                    <>
                      <FaMicrophone className="me-2" />
                      Recording...
                    </>
                  ) : (
                    <>
                      <FaMicrophone className="me-2" />
                      Hold to Talk
                    </>
                  )}
                </Button>
              </Col>
              <Col xs={12} sm={6}>
                <Button
                  variant="warning"
                  className="w-100 fw-semibold text-white"
                  onClick={resetTranscript}
                  style={{ minHeight: "45px" }}
                >
                  <FaSyncAlt className="me-2" />
                  Reset
                </Button>
              </Col>
            </Row>

            {/* Transcript Display */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-dark">Recorded Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={1}
                readOnly
                value={transcript || "No input yet"}
                
                style={{ fontSize: "1rem", resize: "vertical" }}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button
              variant="success"
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-100 fw-semibold"
              style={{ padding: "8px" }}
            >
              {isSubmitting ? "⌛ Submitting..." : "Submit Meal"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</div>

);
};

export default VoiceMealLogger;
