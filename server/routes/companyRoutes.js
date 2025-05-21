const express = require("express");
const router = express.Router();
const multer = require("multer");
const { isCompanyAuthenticated } = require("../middlewares/companyAuth");
const upload = require("../config/multer");
const {
  register,
  login,
  getProfile,
  updateProfile,
  postJob,
  getPostedJobs,
  getJobApplications,
  updateApplicationStatus,
  uploadFile,
} = require("../controllers/CompanyControllers");

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next(err);
};

// File upload route
router.route("/upload").post(
  (req, res, next) => {
    console.log("Upload route hit:", {
      body: req.body,
      files: req.files,
      file: req.file,
    });
    next();
  },
  isCompanyAuthenticated,
  upload.fields([
    { name: "logo", maxCount: 1 }
  ]),
  handleMulterError,
  uploadFile
);

// Authentication routes
router.post("/register", upload.fields([{ name: "logo", maxCount: 1 }]), register);
router.post("/login", login);

// Protected routes (require company authentication)
router.get("/me", isCompanyAuthenticated, getProfile);
router.put(
  "/update",
  isCompanyAuthenticated,
  upload.fields([{ name: "logo", maxCount: 1 }]),
  updateProfile
);

// Job management routes
router.post("/jobs", isCompanyAuthenticated, postJob);
router.get("/jobs", isCompanyAuthenticated, getPostedJobs);
router.get(
  "/jobs/:jobId/applications",
  isCompanyAuthenticated,
  getJobApplications
);
router.put(
  "/applications/:applicationId/status",
  isCompanyAuthenticated,
  updateApplicationStatus
);

module.exports = router; 