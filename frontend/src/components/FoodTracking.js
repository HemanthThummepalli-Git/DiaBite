import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Container, Row, Col, Form, Button, Alert, Card, Table, Spinner, Modal } from "react-bootstrap";
import { FaUtensils, FaCalendarAlt, FaHistory, FaInfoCircle } from "react-icons/fa";
import VoiceMealLogger from "./VoiceMealLogger";

const FoodTracking = () => {
  const [mealType, setMealType] = useState("");
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [foodItems, setFoodItems] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sortBy, setSortBy] = useState("date"); 
  const [filterMeal, setFilterMeal] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // States for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLogId, setUpdateLogId] = useState("");
  const [updateMealType, setUpdateMealType] = useState("");
  const [updateFoodName, setUpdateFoodName] = useState("");
  const [updateQuantity, setUpdateQuantity] = useState(1);
  const [updateFoodItems, setUpdateFoodItems] = useState([]);

  useEffect(() => {
    fetchFoodLogs();
  }, []);

  const fetchFoodLogs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/food/logs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFoodLogs(response.data.foodLogs);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    } finally {
      setLoading(false);
    }
  };

  

  // Add a single food item to the temporary list (for new log)
  const addFoodItemToList = () => {
    if (!foodName || quantity <= 0) {
      setErrorMessage("Please enter a valid food name and quantity.");
      return;
    }
    setErrorMessage("");
    const newItem = { name: foodName, quantity };
    setFoodItems([...foodItems, newItem]);
    setFoodName("");
    setQuantity(1);
  };

  // Submit the new food log
  const addFoodLog = async () => {
    if (!mealType || foodItems.length === 0) {
      setErrorMessage("Select a meal type and add at least one food item.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/food/log`,
        { mealType, foodItems, inputMethod: "text" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setFoodLogs([...foodLogs, response.data.foodLog]);
      setSuccessMessage("Food log added successfully!");
      fetchFoodLogs();
      setMealType("");
      setFoodItems([]);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding food log:", error);
    }
  };

  const deleteFoodLog = async (logId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/food/log/${logId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFoodLogs(foodLogs.filter((log) => log._id !== logId));
    } catch (error) {
      console.error("Error deleting food log:", error);
    }
  };

  // Implement update functionality: Open modal with pre-filled log details
  const modifyFoodLog = (logId) => {
    const logToUpdate = foodLogs.find((log) => log._id === logId);
    if (!logToUpdate) {
      alert("Food log not found");
      return;
    }
    // Pre-fill the update fields
    setUpdateLogId(logId);
    setUpdateMealType(logToUpdate.mealType);
    // Convert existing foodItems to {name, quantity} format
    const items = logToUpdate.foodItems.map(item => ({
      name: item.foodName,
      quantity: item.servingQty
    }));
    setUpdateFoodItems(items);
    setShowUpdateModal(true);
  };

  // Add a food item to the update modal list
  const addFoodItemToUpdateList = () => {
    if (!updateFoodName || updateQuantity <= 0) {
      alert("Enter a valid food name and quantity.");
      return;
    }
    const newItem = { name: updateFoodName, quantity: updateQuantity };
    setUpdateFoodItems([...updateFoodItems, newItem]);
    setUpdateFoodName("");
    setUpdateQuantity(1);
  };

  // Handle the update PUT request
  const handleUpdateFoodLog = async () => {
    if (!updateMealType || updateFoodItems.length === 0) {
      alert("Please select a meal type and add at least one food item.");
      return;
    }
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/food/log/${updateLogId}`,
        { mealType: updateMealType, foodItems: updateFoodItems, inputMethod: "text" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      // Update local foodLogs (or re-fetch)
      setFoodLogs(response.data.foodLogs);
      setShowUpdateModal(false);
      setSuccessMessage("Food log updated successfully!");
    } catch (error) {
      console.error("Error updating food log:", error);
      alert("Error updating food log");
    }
  };

  // Apply filtering by meal type
  let filteredLogs = foodLogs;
  if (filterMeal) {
    filteredLogs = filteredLogs.filter(
      (log) => log.mealType.toLowerCase() === filterMeal.toLowerCase()
    );
  }

  // Group logs by date using the dateLogged field
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    if (!log || !log.dateLogged) return acc;
    const date = moment(log.dateLogged).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  // Sorting logic
  let sortedLogs = Object.entries(groupedLogs);
  if (sortBy === "date") {
    sortedLogs.sort(([a], [b]) => new Date(b) - new Date(a));
  } else if (sortBy === "mealType") {
    sortedLogs.forEach(([date, logs]) => {
      logs.sort((a, b) => a.mealType.localeCompare(b.mealType));
    });
  }

  if (loading) {
    return (
      <div className="mt-5 d-flex flex-column align-items-center">
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px", color: "#333" }} >Loading food tracker...</p>
      </div>
    );
  }

  return (
    <Container style={styles.container} className="w-100">
      <h2 className="text-center fw-bold">Food Tracker</h2>
      <div className="container py-4">
  <Row className="justify-content-center">
    {/* Food Logging Form */}
    <Col lg={6} md={8} sm={12} className="mb-4">
      <Card className="shadow-sm rounded-3" style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
        <Card.Body>
          <Form>
            {/* Heading */}
            <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-1 text-wrap text-center 
              fs-4 fs-md-3 fs-lg-2">
              Text-Based Food Logging
            </h2>
            <p className="text-muted text-center fs-6 fs-md-6 fs-lg-5">
              Manually enter your meals and quantities
            </p>
            </div>

            {/* Meal Type & Date */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="mealType">
                  <Form.Label className="fw-semibold text-dark">
                    <FaUtensils className="me-2 text-secondary" />
                    Meal Type
                  </Form.Label>
                  <Form.Select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="p-2 rounded"
                  >
                    <option value="">Select Meal Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label className="fw-semibold text-dark">
                    <FaCalendarAlt className="me-2 text-secondary" />
                    Date
                  </Form.Label>
                  <Form.Control type="date" name="date" className="p-2 rounded" />
                </Form.Group>
              </Col>
            </Row>

            {/* Food Name & Quantity */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="foodName">
                  <Form.Label className="fw-semibold text-dark">Food Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter food name"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="p-2 rounded"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="quantity">
                  <Form.Label className="fw-semibold text-dark">Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="p-2 rounded"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Success/Error Messages */}
            {successMessage && (
              <Alert variant="success" className="text-center fw-medium">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert variant="danger" className="fw-medium">
                {errorMessage}
              </Alert>
            )}

            {/* Buttons */}
            <Row className="mt-3">
              <Col md={6} className="mb-2">
                <Button
                  variant="info"
                  onClick={addFoodItemToList}
                  className="w-100 text-white fw-semibold"
                >
                  + Add Food Item
                </Button>
              </Col>
              <Col md={6} className="mb-2">
                <Button
                  variant="primary"
                  onClick={addFoodLog}
                  className="w-100 fw-semibold"
                >
                  Add Food Log
                </Button>
              </Col>
            </Row>

            {/* Food Items List */}
            {foodItems.length > 0 && (
              <ul className="list-unstyled mt-4 bg-light p-3 rounded">
                {foodItems.map((item, index) => (
                  <li
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2 bg-white p-2 rounded shadow-sm"
                  >
                    <span className="fw-bold">
                      {item.name} - {item.quantity}
                    </span>
                    <Button
                      variant="link"
                      className="text-danger fs-5 p-0"
                      onClick={() => setFoodItems(foodItems.filter((_, i) => i !== index))}
                    >
                      ✖
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Col>

    {/* Voice Meal Logger */}
    <Col lg={6} md={8} sm={12}>
      <VoiceMealLogger />
    </Col>
  </Row>
</div>

      
      {/* Food Log List */}
      <h3 style={styles.subHeading} className="fw-bold">Food Logs</h3>
      {/* Sorting & Filtering Controls */}
      <div style={styles.controls} className="w-75 mx-auto">
        <Form.Control as="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="date">Sort by Date</option>
          <option value="mealType">Sort by Meal Type</option>
        </Form.Control>
        <Form.Control as="select" value={filterMeal} onChange={(e) => setFilterMeal(e.target.value)} style={styles.select}>
          <option value="">Filter by Meal</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </Form.Control>
      </div>
      {sortedLogs.length === 0 ? (
  <p style={styles.noLogs}>No food logs found.</p>
) : (
  sortedLogs.map(([date, logs]) => (
    <div key={date} style={styles.logContainer} className="container px-2 px-md-4 mb-4">
      <h3 style={styles.dateTitle} className="text-center text-md-start">
        {moment(date).format("MMMM D, YYYY")}
      </h3>
      {logs.map((log) => (
        <Card key={log._id} style={styles.foodLog} className="mb-3">
          <Card.Body>
            <div
              style={styles.logHeader}
              className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
            >
              <h4 style={styles.mealType}>{log.mealType.toUpperCase()}</h4>
              <div style={styles.actionButtons} className="d-flex gap-2">
                <Button
                  variant="warning"
                  onClick={() => modifyFoodLog(log._id)}
                  style={styles.modifyButton}
                >
                  Modify
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteFoodLog(log._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </Button>
              </div>
            </div>

            {log.foodItems.map((item, index) => (
              <div
                key={item.id || index}
                style={styles.foodItem}
                className="d-flex flex-column flex-md-row align-items-start gap-3 mt-3"
              >
                <img
                  src={item.photo}
                  alt={item.foodName}
                  style={styles.foodImage}
                  className="img-fluid"
                />
                <div style={styles.foodDetailsContainer}>
                  <strong style={styles.foodName}>{item.foodName}</strong>
                  <p style={styles.foodDetails}>
                    {item.servingQty} {item.servingUnit} | {item.brandName || "Generic"}
                  </p>
                  <p style={styles.foodNutrients}>
                    <strong>Calories:</strong> {item.calories} cal | <strong>Protein:</strong>{" "}
                    {item.protein}g | <strong>Carbs:</strong> {item.carbs}g | <strong>Fats:</strong>{" "}
                    {item.fats}g
                  </p>
                </div>
              </div>
            ))}

            <div style={styles.summaryContainer}>
              <p style={styles.summary}>
                Total: {log.totalCalories} cal, {log.totalProtein}g Protein, {log.totalCarbs}g
                Carbs, {log.totalFats}g Fats
              </p>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  ))
)}


      {/* Update Modal */}
    <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          borderBottom: "none",
          padding: "1rem 1.5rem",
        }}
      >
        <Modal.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          Update Food Log
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "#f8f9fa", padding: "2rem" }}>
        <Form>
          <Form.Group controlId="updateMealType" className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
              Meal Type
            </Form.Label>
            <Form.Control
              as="select"
              value={updateMealType}
              onChange={(e) => setUpdateMealType(e.target.value)}
              style={{ borderRadius: "5px", border: "1px solid #ccc" }}
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="updateFoodName" className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
              Food Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Food Name"
              value={updateFoodName}
              onChange={(e) => setUpdateFoodName(e.target.value)}
              style={{ borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </Form.Group>
          <Form.Group controlId="updateQuantity" className="mb-3">
            <Form.Label style={{ fontWeight: "bold", color: "#333" }}>
              Quantity
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Quantity"
              value={updateQuantity}
              onChange={(e) => setUpdateQuantity(Number(e.target.value))}
              style={{ borderRadius: "5px", border: "1px solid #ccc" }}
            />
          </Form.Group>
          <Button
            variant="info"
            onClick={addFoodItemToUpdateList}
            style={{
              backgroundColor: "#17a2b8",
              border: "none",
              marginBottom: "10px",
              padding: "10px 15px",
              fontSize: "1rem",
              borderRadius: "5px",
            }}
          >
            + Add Food Item
          </Button>
          {updateFoodItems.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
              {updateFoodItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "#e9ecef",
                    margin: "5px 0",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "15px", color: "#333" }}>
                    {item.name} - {item.quantity}
                  </span>
                  <Button
                    variant="button"
                    onClick={() =>
                      setUpdateFoodItems(updateFoodItems.filter((_, i) => i !== index))
                    }
                    style={{ color: "#dc3545", padding: "0", fontSize: "18px" }}
                  >
                    ✖
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{
          borderTop: "none",
          backgroundColor: "#f1f1f1",
          padding: "1rem 1.5rem",
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setShowUpdateModal(false)}
          style={{
            backgroundColor: "#6c757d",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateFoodLog}
          style={{
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
          }}
        >
          Update Food Log
        </Button>
      </Modal.Footer>
    </Modal>

    </Container>
  );
};

const styles = {
  container: {
    margin: "auto",
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
  },
  formCard: {
    width: "100%",
  },
  label: {
    fontWeight: "bold",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    cursor: "pointer",
    fontSize: "14px",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #aaa",
    fontSize: "14px",
  },
  successText: {
    color: "green",
    fontSize: "14px",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
  },
  subHeading: {
    textAlign: "center",
    color: "#333",
    margin: "20px 0 10px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    justifyContent: "center",
  },
  noLogs: {
    textAlign: "center",
    color: "#777",
  },
  logContainer: {
    marginBottom: "15px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
  dateTitle: {
    textAlign: "center",
    color: "#444",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  foodLog: {
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
  },
  logHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealType: {
    margin: "0",
    color: "#0056b3",
    fontSize: "16px",
    fontWeight: "bold",
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
  },
  modifyButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#ffc107",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    width: "80px",
  },
  deleteButton: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
    fontSize: "12px",
    width: "80px",
  },
  foodItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "5px",
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
  },
  foodImage: {
    width: "50px",
    height: "50px",
    borderRadius: "6px",
    objectFit: "cover",
  },
  foodDetailsContainer: {
    flex: "1",
  },
  foodName: {
    fontSize: "14px",
    color: "#222",
  },
  foodDetails: {
    margin: "3px 0",
    fontSize: "12px",
    color: "#555",
  },
  foodNutrients: {
    fontSize: "12px",
    color: "#777",
  },
  summaryContainer: {
    padding: "10px",
    backgroundColor: "#eef",
    borderRadius: "8px",
  },
  summary: {
    fontSize: "13px",
    color: "#444",
    fontWeight: "bold",
    margin: "8px 0 5px",
  },
};

export default FoodTracking;
