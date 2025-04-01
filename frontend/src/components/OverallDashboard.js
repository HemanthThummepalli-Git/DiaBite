import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Grid, Paper, Typography } from '@mui/material';
import 'chart.js/auto';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Reusable Chart Component
const ChartCard = ({ title, children }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 3,
      boxShadow: 3,
      maxWidth: 350,
      background: 'linear-gradient(135deg, #ffffff, #f2f2f2)',
      border: '1px solid #ddd',
    }}
  >
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

function OverallDashboard() {
  const { current } = useSelector((state) => state.userReducer);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for chart data
  const [labe, setLabe] = useState([]);
  const [caldata, setCaldata] = useState({});
  const [pieData, setPieChartData] = useState({});
  const [sugarlabels, setSugarLabels] = useState([]);
  const [fastingsugar, setFastingSugar] = useState([]);
  const [premealsugar, setPreMealSugar] = useState([]);
  const [postmealsugar, setPostMealSugar] = useState([]);
  const [proteinValues, setProteinValues] = useState([]);
  const [sugarValues, setSugarValues] = useState([]);

  // Fetch current user data from backend
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user must log in.");
        setLoading(false);
        return;
      }
      if (!current || !current._id) {
        console.error("User ID is not available in userReducer.");
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/dash/updated-dashboard/${current._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Fetched user data:", response.data);
      setCurrentUser(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching history:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [current]);

  // Process food logs and sugar levels only after currentUser is available
  useEffect(() => {
    if (!currentUser) return; // Wait until currentUser is set

    // Process Food Logs
    if (currentUser.foodLogs && currentUser.foodLogs.length > 0) {
      const foodLogs = currentUser.foodLogs;
      // Extract unique dates (YYYY-MM-DD) and sort them
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
  
      // Protein Aggregation per Date (for the Protein Bar Chart)
      const proteinsByDate = dates.map((date) =>
        foodLogs.reduce(
          (sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalProtein || 0 : 0),
          0
        )
      );
      setProteinValues(proteinsByDate);
  
      // Sugar intake from food logs per date
      const sugarsByDate = dates.map((date) =>
        foodLogs.reduce(
          (sum, log) => sum + (log.dateLogged.split("T")[0] === date ? log.totalSugars || 0 : 0),
          0
        )
      );
      setSugarValues(sugarsByDate);
    }
  
    // Process Sugar Levels
    if (currentUser.sugarLevels && currentUser.sugarLevels.length > 0) {
      const sugarLevels = currentUser.sugarLevels;
      // Extract unique sugar dates and sort them
      const sugarDates = [...new Set(sugarLevels.map((entry) => entry.date.split("T")[0]))].sort();
      setSugarLabels(sugarDates);
  
      // For each date, take the first sugar entry (or adjust to average if needed)
      const fastingSugarArr = [];
      const preMealSugarArr = [];
      const postMealSugarArr = [];
      sugarDates.forEach((date) => {
        const entry = sugarLevels.find((e) => e.date.split("T")[0] === date);
        if (entry) {
          fastingSugarArr.push(entry.fastingSugarLevel);
          preMealSugarArr.push(entry.preMealSugarLevel);
          postMealSugarArr.push(entry.postMealSugarLevel);
        }
      });
      setFastingSugar(fastingSugarArr);
      setPreMealSugar(preMealSugarArr);
      setPostMealSugar(postMealSugarArr);
    }
  
  }, [currentUser]);

  // ---------------------- Chart Configurations ----------------------
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom' } },
    scales: { x: { display: true }, y: { display: true } },
  };
  
  // Sugar Levels Line Chart
  const sugarData = {
    labels: sugarlabels,
    datasets: [
      {
        label: "Fasting Sugar Level",
        data: fastingsugar,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
      {
        label: "Pre-Meal Sugar Level",
        data: premealsugar,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
      {
        label: "Post-Meal Sugar Level",
        data: postmealsugar,
        borderColor: "#FFCE56",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        tension: 0.4,
      },
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
    datasets: [
      {
        label: "Protein (g)",
        data: proteinValues,
        backgroundColor: "#36A2EB",
      },
    ],
  };
  
  // Sugar Intake Line Chart
  const sugarIntakeData = {
    labels: labe,
    datasets: [
      {
        label: "Sugar Intake (g)",
        data: sugarValues,
        borderColor: "#F44336",
        backgroundColor: "#F4433633",
        fill: true,
        tension: 0.4,
      },
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
    <div style={styles.dashboardContainer}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Sugar Levels">
            <div style={{ height: 250, width: '100%' }}>
              <Line data={sugarData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Macro Distribution">
            <div style={{ height: 250, width: '100%' }}>
              <Pie data={macroData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Daily Calories">
            <div style={{ height: 250, width: '100%' }}>
              <Bar data={foodLogData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Protein Intake">
            <div style={{ height: 250, width: '100%' }}>
              <Bar data={proteinData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ChartCard title="Sugar Intake">
            <div style={{ height: 250, width: '100%' }}>
              <Line data={sugarIntakeData} options={chartOptions} />
            </div>
          </ChartCard>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    padding: '2rem',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default OverallDashboard;