const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const upload = require("../config/multer");
const multer = require("multer");
const router = express.Router();
const {
  uploadTempResume,
  analyzeTempResume,
  saveResume,
  discardResume,
  getUserResume,
  deleteResume,
  analyzeResume,
  getApiUsageStats,
} = require("../controllers/ResumeControllers");

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

// Routes for temporary workflow (upload → analyze → save/discard)
// Upload resume temporarily
router
  .route("/temp-upload")
  .post(
    isAuthenticated,
    upload.single("resume"),
    handleMulterError,
    uploadTempResume
  );

// Analyze temporary resume
router
  .route("/temp-analyze/:tempResumeId")
  .get(isAuthenticated, analyzeTempResume);

// Save temporary resume permanently
router.route("/save/:tempResumeId").post(isAuthenticated, saveResume);

// Discard temporary resume
router.route("/discard/:tempResumeId").delete(isAuthenticated, discardResume);

// Legacy routes - still support direct upload and analysis
// Upload resume directly (skips temp workflow)
// router.route("/upload").post(
//   isAuthenticated,
//   upload.single("resume"),
//   handleMulterError,
//   saveResume
// );

// Analyze user's permanent resume
router.route("/analyze").get(isAuthenticated, analyzeResume);

// Get API usage statistics
router.route("/usage-stats").get(isAuthenticated, getApiUsageStats);

// Get user resume
router.route("/").get(isAuthenticated, getUserResume);

// Delete resume
router.route("/").delete(isAuthenticated, deleteResume);

module.exports = router;
