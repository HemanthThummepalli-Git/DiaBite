import React, { useState, useEffect, useRef } from "react";
import { Card, Spinner } from "react-bootstrap";
import { 
  FaExclamationTriangle, FaHeartbeat, FaRunning, FaUtensils, FaAngleDoubleRight 
} from "react-icons/fa";

const CGMAnalysis = ({ analysis }) => {
  // State to store fully streamed bullets and the currently streaming bullet text.
  const [streamedBullets, setStreamedBullets] = useState([]);
  const [currentBullet, setCurrentBullet] = useState("");
  // We also keep a ref to the bullet array and current index.
  const bulletsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const intervalRef = useRef(null);

  // Reset streaming state when analysis changes.
  useEffect(() => {
    // Clear any previous interval and reset states.
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStreamedBullets([]);
    setCurrentBullet("");
    currentIndexRef.current = 0;

    if (analysis && typeof analysis.insights === "string") {
      const bullets = analysis.insights
        .split("*")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      bulletsRef.current = bullets;
      if (bullets.length > 0) {
        // Start streaming the first bullet.
        startStreamingBullet();
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [analysis]);

  const startStreamingBullet = () => {
    // Get the current bullet to stream.
    const bullet = bulletsRef.current[currentIndexRef.current];
    let charIndex = 0;
    intervalRef.current = setInterval(() => {
      // Stream letter by letter.
      if (charIndex <= bullet.length) {
        setCurrentBullet(bullet.slice(0, charIndex));
        charIndex++;
      } else {
        // Bullet finished streaming: push it into streamedBullets.
        setStreamedBullets((prev) => [...prev, bullet]);
        setCurrentBullet("");
        clearInterval(intervalRef.current);
        // Move to the next bullet after a short delay.
        currentIndexRef.current++;
        if (currentIndexRef.current < bulletsRef.current.length) {
          setTimeout(() => {
            startStreamingBullet();
          }, 300);
        }
      }
    }, 20);
  };

  const getIcon = (text) => {
    if (!text) return <FaAngleDoubleRight style={styles.defaultIcon} />;
    if (text.includes("Overall Analysis")) return <FaHeartbeat style={{ ...styles.defaultIcon, color: "#dc3545" }} />;
    if (text.includes("Potential Risks")) return <FaExclamationTriangle style={{ ...styles.defaultIcon, color: "#ffc107" }} />;
    if (text.includes("Personalized Insights")) return <FaUtensils style={{ ...styles.defaultIcon, color: "#007bff" }} />;
    if (text.includes("exercise") || text.includes("physical activity")) return <FaRunning style={{ ...styles.defaultIcon, color: "#dc3545" }} />;
    return <FaAngleDoubleRight style={{ ...styles.defaultIcon, color: "#28a745" }} />;
  };

  if (!analysis) {
    return (
      <div style={styles.spinnerContainer}>
        <Spinner animation="border" size="sm" style={styles.spinner} />
        <span style={styles.spinnerText}>Analyzing data...</span>
      </div>
    );
  }

  return (
    <div style={styles.analysisContainer}>
      <h3 style={styles.analysisHeading}>✨ Health Analysis</h3>
      <Card style={styles.analysisCard}>
        <Card.Body style={styles.cardBody}>
          {analysis.error ? (
            <p style={styles.errorText}>{analysis.error}</p>
          ) : (
            <ul style={styles.list}>
              {streamedBullets.map((bullet, idx) => (
                <li key={`bullet-${idx}`} style={bullet.endsWith(":") ? styles.headingItem : styles.subItem}>
                  {getIcon(bullet)} {bullet}
                </li>
              ))}
              {currentBullet && (
                <li key="current-bullet" style={styles.subItem}>
                  {getIcon(currentBullet)} {currentBullet}
                </li>
              )}
            </ul>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

const styles = {
  spinnerContainer: {
    textAlign: "center",
    color: "#6c757d",
    margin: "20px 0"
  },
  spinner: {
    marginRight: "8px"
  },
  spinnerText: {
    fontSize: "14px"
  },
  analysisContainer: {
    marginTop: "20px"
  },
  analysisHeading: {
    color: "#007bff",
    textAlign: "center",
    marginBottom: "10px"
  },
  analysisCard: {
    padding: "0",
    border: "none"
  },
  cardBody: {
    padding: "10px 15px"
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  headingItem: {
    fontWeight: "bold",
    marginTop: "12px",
    fontSize: "15px",
    marginLeft: 0
  },
  subItem: {
    marginLeft: "20px",
    fontSize: "14px",
    marginTop: "6px"
  },
  defaultIcon: {
    marginRight: "8px"
  },
  errorText: {
    color: "#dc3545",
    fontSize: "14px"
  }
};

export default CGMAnalysis;
