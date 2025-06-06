const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(express.json());

// Configure CORS for the frontend origin and credentials
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend origin
  credentials: true, // Allow cookies/auth headers
  // Optionally allow specific methods and headers if needed
  // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const User = require("./routes/UserRoutes");
const Job = require("./routes/JobRoutes");
const Application = require("./routes/ApplicationRoutes");
const Admin = require("./routes/AdminRoutes");
const Resume = require("./routes/ResumeRoutes");
const Company = require("./routes/companyRoutes");
const { errorMiddleware } = require("./middlewares/error");

app.use("/api/v1", User);
app.use("/api/v1", Job);
app.use("/api/v1", Application);
app.use("/api/v1", Admin);
app.use("/api/v1/resume", Resume);
app.use("/api/v1/company", Company);

app.get("/", (req, res) => {
  res.json("I am working");
});

//for any unwanted error
app.use(errorMiddleware);

module.exports = app;
