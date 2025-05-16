const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const User = require("./routes/UserRoutes");
const Job = require("./routes/JobRoutes");
const Application = require("./routes/ApplicationRoutes");
const Admin = require("./routes/AdminRoutes");
const { errorMiddleware } = require("./middlewares/error");

app.use("/api/v1", User);
app.use("/api/v1", Job);
app.use("/api/v1", Application);
app.use("/api/v1", Admin);

app.get("/", (req, res) => {
  res.json("I am working");
});

//for any unwanted error
app.use(errorMiddleware);

module.exports = app;
