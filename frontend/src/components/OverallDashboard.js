import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Grid2, Paper, Typography, Avatar, Box, Card } from "@mui/material";
import "chart.js/auto";
import { useSelector } from "react-redux";

// Reusable Chart Component
const ChartCard = ({ title, children }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: 3,
      maxWidth: 350,
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    }}
  >
    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

function OverallDashboard() {
  const { currentUser } = useSelector((state) => state.userReducer);
  const [pieData, setPieChartData] = useState({});
  const [labe, setLabe] = useState([]);
  const [caldata, setCaldata] = useState({});
  const [sugarlabels, setSugarLabels] = useState([]);
  const [fastingsugar, setFastingSugar] = useState([]);
  const [premealsugar, setPreMealSugar] = useState([]);
  const [postmealsugar, setPostMealSugar] = useState([]);
  const [proteinValues, setProteinValues] = useState([]);
  const [sugarValues, setSugarValues] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.foodLogs || currentUser.foodLogs.length === 0) {
      console.warn("No food log data available.");
      return;
    }

    const foodLogs = currentUser.foodLogs;
    const dates = [...new Set(foodLogs.map((log) => log.dateLogged.split("T")[0]))].sort();
    setLabe(dates);

    // Daily Calories Aggregation
    const dailyCalories = {};
    dates.forEach((date) => {
      dailyCalories[date] = 0;
    });
    foodLogs.forEach((log) => {
      const date = log.dateLogged.split("T")[0];
      dailyCalories[date] += log.totalCalories || 0;
    });
    setCaldata(dailyCalories);

    // Macro Nutrients for the Latest Date (Pie Chart Data)
    const latestDate = dates[dates.length - 1];
    const pieChartData = { totalProtein: 0, totalCarbs: 0, totalFats: 0, totalFiber: 0 };
    foodLogs.forEach((log) => {
      if (log.dateLogged.split("T")[0] === latestDate) {
        pieChartData.totalProtein += log.totalProtein || 0;
        pieChartData.totalCarbs += log.totalCarbs || 0;
        pieChartData.totalFats += log.totalFats || 0;
        pieChartData.totalFiber += log.totalFiber || 0;
      }
    });
    setPieChartData(pieChartData);

    // Protein Aggregation per Date (Protein Bar Chart)
    const proteinsByDate = dates.map((date) =>
      foodLogs.reduce((sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalProtein || 0 : 0), 0)
    );
    setProteinValues(proteinsByDate);

    // Sugar Levels Processing
    if (currentUser.sugarLevels && currentUser.sugarLevels.length > 0) {
      const sugarLevels = currentUser.sugarLevels;
      const sugarDates = [...new Set(sugarLevels.map((entry) => entry.date.split("T")[0]))].sort();
      setSugarLabels(sugarDates);

      const fastingSugarArr = [];
      const preMealSugarArr = [];
      const postMealSugarArr = [];
      sugarDates.forEach((date) => {
        const entry = sugarLevels.find((e) => e.date.split("T")[0] === date);
        fastingSugarArr.push(entry.fastingSugarLevel);
        preMealSugarArr.push(entry.preMealSugarLevel);
        postMealSugarArr.push(entry.postMealSugarLevel);
      });
      setFastingSugar(fastingSugarArr);
      setPreMealSugar(preMealSugarArr);
      setPostMealSugar(postMealSugarArr);
    }

    // Sugar Intake Aggregation
    const sugarsByDate = dates.map((date) =>
      foodLogs.reduce((sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalSugars || 0 : 0), 0)
    );
    setSugarValues(sugarsByDate);
  }, [currentUser]);

  if (!currentUser) return <Typography>Loading...</Typography>;

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: "bottom" } },
    scales: { x: { display: true }, y: { display: true } },
  };

  // Sugar Levels Line Chart
  const sugarData = {
    labels: sugarlabels,
    datasets: [
      { label: "Fasting Sugar Level", data: fastingsugar, borderColor: "#FF6384", backgroundColor: "rgba(255, 99, 132, 0.2)", tension: 0.4 },
      { label: "Pre-Meal Sugar Level", data: premealsugar, borderColor: "#36A2EB", backgroundColor: "rgba(54, 162, 235, 0.2)", tension: 0.4 },
      { label: "Post-Meal Sugar Level", data: postmealsugar, borderColor: "#FFCE56", backgroundColor: "rgba(255, 206, 86, 0.2)", tension: 0.4 },
    ],
  };

  // Calories Bar Chart
  const foodLogData = {
    labels: labe,
    datasets: [
      {
        label: "Total Calories per Day",
        data: labe.map((date) => caldata[date]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Protein Bar Chart
  const proteinData = {
    labels: labe,
    datasets: [{ label: "Protein (g)", data: proteinValues, backgroundColor: "#36A2EB" }],
  };

  // Sugar Intake Line Chart
  const sugarIntakeData = {
    labels: labe,
    datasets: [
      { label: "Sugar Intake (g)", data: sugarValues, borderColor: "#F44336", backgroundColor: "#F4433633", fill: true, tension: 0.4 },
    ],
  };

  // Macro Nutrients Pie Chart
  const macroData = {
    labels: ["Protein", "Carbs", "Fats", "Fibers"],
    datasets: [
      {
        data: [pieData.totalProtein, pieData.totalCarbs, pieData.totalFats, pieData.totalFiber],
        backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#673AB7"],
      },
    ],
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "'Poppins', sans-serif" }}>
      {/* User Overview Section */}
      <div
        style={{
          width: "90%",
          maxWidth: "800px",
          margin: "auto",
          marginBottom: "2rem",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
          background: "linear-gradient(135deg, #eef7ff, #ffffff)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            borderBottom: "1px solid #cfd8dc",
            paddingBottom: "1rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#1976d2",
              color: "white",
              borderRadius: "50%",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ margin: 0, color: "#1a237e", fontWeight: "bold" }}>
              {currentUser.name}
            </h2>
            <p style={{ margin: 0, color: "#455a64" }}>{currentUser.email}</p>
          </div>
        </div>
  
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div style={{ flex: "1 1 250px" }}>
            <p>
              <strong>Age:</strong> {currentUser.age} years
            </p>
            <p>
              <strong>Height:</strong> {currentUser.height} cm
            </p>
            <p>
              <strong>Weight:</strong> {currentUser.weight} kg
            </p>
            <p>
              <strong>Diabetes Type:</strong> {currentUser.diabetesType}
            </p>
          </div>
          <div style={{ flex: "1 1 250px" }}>
            <p>
              <strong>Activity Level:</strong> {currentUser.activityLevel}
            </p>
            <p>
              <strong>Dietary Preference:</strong> {currentUser.dietaryPreference}
            </p>
            <p>
              <strong>Meal Type Preference:</strong>{" "}
              {currentUser.mealTypePreference}
            </p>
            <p>
              <strong>Food Allergies:</strong>{" "}
              {currentUser.foodAllergies.join(", ")}
            </p>
          </div>
        </div>
      </div>
  
      {/* Charts Section */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {[...Array(5)].map((_, index) => {
          const chartData = [
            sugarData,
            macroData,
            foodLogData,
            proteinData,
            sugarIntakeData,
          ][index];
          const titles = [
            "Sugar Levels",
            "Macro Distribution",
            "Daily Calories",
            "Protein Intake",
            "Sugar Intake",
          ];
          const ChartType = [Line, Pie, Bar, Bar, Line][index];
  
          return (
            <div
              key={index}
              style={{
                flex: "1 1 300px",
                maxWidth: "300px",
                backgroundColor: "#ffffff",
                borderRadius: "1rem",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#1a237e" }}>
                {titles[index]}
              </h3>
              <div style={{ height: "200px", width: "100%", margin: "auto" }}>
                <ChartType data={chartData} options={chartOptions} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  
}

export default OverallDashboard;
