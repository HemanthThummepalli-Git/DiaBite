const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://diabite.onrender.com",  
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));


  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());


// **MongoDB Connection**
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log("✅ Database Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1); // Stop server if DB connection fails
    }
};


// Import user routes
const userRoutes = require("./APIs/userAPI");
app.use("/users", userRoutes);
app.use("/cgm", require("./APIs/cgmAPI"));

const foodRoutes= require("./APIs/foodAPI")
app.use("/food", foodRoutes);
const aiRoutes = require("./APIs/aiAPI");
app.use("/ai-recom",aiRoutes);

const dashboardRoutes= require("./APIs/dashboardAPI")
app.use("/dash", dashboardRoutes);

// Serve Frontend (React Build)
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));


app.get("/", (req, res) => {
    res.send("Diabite API is running successfully!");
  });

// **Start Server only after DB is connected**
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
