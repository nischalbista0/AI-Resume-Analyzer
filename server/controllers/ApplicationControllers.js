const Job = require("../models/JobModel");
const User = require("../models/UserModel");
const Application = require("../models/AppModel");

const mongoose = require("mongoose");

// Creates a new application
exports.createApplication = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const user = await User.findById(req.user._id);

    // Check if user has uploaded a resume
    if (!user.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume before applying",
      });
    }

    if (user.appliedJobs.includes(job._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    // Create application with the resume path
    const application = await Application.create({
      job: job._id,
      applicant: user._id,
      applicantResume: {
        public_id: `resume_${user._id}`, // Generate a unique ID
        url: user.resume, // Use the resume path directly
      },
    });

    // Store the application ID instead of job ID
    user.appliedJobs.push(application._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Application created successfully",
      application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get a single application
exports.getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: "job",
        select:
          "title companyName location experience salary description status",
      })
      .populate({
        path: "applicant",
        select: "name email resume resumeAnalysis",
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

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

// Gets all applications of an user
exports.getUsersAllApplications = async (req, res) => {
  try {
    const allApplications = await Application.find({ applicant: req.user._id })
      .populate("job")
      .populate("applicant");

    res.status(200).json({
      success: true,
      allApplications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const applicationId = req.params.id;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Application already deleted",
      });
    }

    const applicationToDelete = await Application.findByIdAndRemove(
      applicationId
    );

    const jobId = application.job;
    const MongooseObjectId = new mongoose.Types.ObjectId(jobId);

    const newAppliedJobs = user.appliedJobs.filter(
      (e) => e.toString() !== MongooseObjectId.toString()
    );

    user.appliedJobs = newAppliedJobs;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Application deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Gets all applications for a company's jobs
exports.getCompanyApplications = async (req, res) => {
  try {
    // First get all jobs posted by the company
    const companyJobs = await Job.find({ company: req.user._id });
    const jobIds = companyJobs.map((job) => job._id);

    // Then get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("applicant");

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

// Gets all applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.id })
      .populate("job")
      .populate("applicant");

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
