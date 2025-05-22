const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");
const cloudinary = require("cloudinary");

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get all applications
exports.getAllApp = async (req, res) => {
  try {
    const applications = await Application.find().populate("job applicant");

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Application Status
exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    application.status = req.body.status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// Get Application
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "job applicant"
    );

    res.status(200).json({
      success: true,
      application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update User Role
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    user.role = req.body.role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User Updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "User Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    // Update job fields
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        skillsRequired: req.body.skillsRequired,
        category: req.body.category,
        employmentType: req.body.employmentType,
        experience: req.body.experience,
        salary: req.body.salary,
        status: req.body.status,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Job Updated",
      job: updatedJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Job
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Single Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
