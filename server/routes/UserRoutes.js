const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  isLogin,
  me,
  changePassword,
  updateProfile,
  deleteAccount,
  uploadFile,
} = require("../controllers/UserControllers");
const { isAuthenticated } = require("../middlewares/auth");
const {
  registerValidator,
  validateHandler,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
  deleteAccountValidator,
} = require("../middlewares/validators");
const upload = require("../config/multer");
const router = express.Router();

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
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  handleMulterError,
  uploadFile
);

router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    registerValidator(),
    validateHandler,
    register
  );

router.route("/login").post(loginValidator(), validateHandler, login);
router.route("/isLogin").get(isAuthenticated, isLogin);
router.route("/me").get(isAuthenticated, me);
router
  .route("/changePassword")
  .put(
    isAuthenticated,
    changePasswordValidator(),
    validateHandler,
    changePassword
  );

router
  .route("/updateProfile")
  .put(
    isAuthenticated,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateProfileValidator(),
    validateHandler,
    updateProfile
  );

router
  .route("/deleteAccount")
  .put(
    isAuthenticated,
    deleteAccountValidator(),
    validateHandler,
    deleteAccount
  );

// Add resume update route
router
  .route("/updateResume")
  .put(
    isAuthenticated,
    upload.fields([{ name: "resume", maxCount: 1 }]),
    updateProfile
  );

module.exports = router;
