const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const { isCompanyAuthenticated } = require("../middlewares/companyAuth");
const {
  createApplication,
  getSingleApplication,
  getUsersAllApplications,
  deleteApplication,
  getCompanyApplications,
  getJobApplications,
} = require("../controllers/ApplicationControllers");
const {
  applicationIdValidator,
  validateHandler,
} = require("../middlewares/validators");
const router = express.Router();

router
  .route("/createApplication/:id")
  .post(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    createApplication
  );

router
  .route("/singleApplication/:id")
  .get(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    getSingleApplication
  );

router
  .route("/getAllApplication")
  .get(isAuthenticated, getUsersAllApplications);

router
  .route("/company/applications")
  .get(isCompanyAuthenticated, getCompanyApplications);

router
  .route("/company/jobs/:id/applications")
  .get(isCompanyAuthenticated, getJobApplications);

router
  .route("/deleteApplication/:id")
  .delete(
    isAuthenticated,
    applicationIdValidator(),
    validateHandler,
    deleteApplication
  );

module.exports = router;
