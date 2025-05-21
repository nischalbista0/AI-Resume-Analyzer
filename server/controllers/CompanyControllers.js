const Company = require("../models/CompanyModel");
const Job = require("../models/JobModel");
const Application = require("../models/AppModel");
const bcrypt = require("bcrypt");
const { createCompanyToken } = require("../middlewares/companyAuth");
const fs = require("fs");

// Upload file handler
exports.uploadFile = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "No files were uploaded",
      });
    }

    const uploadedFiles = {};

    // Handle logo upload
    if (req.files.logo) {
      const logoFile = req.files.logo[0];
      if (!logoFile.mimetype.startsWith("image/")) {
        fs.unlinkSync(logoFile.path);
        return res.status(400).json({
          success: false,
          message: "Logo must be an image file",
        });
      }
      uploadedFiles.logo = logoFile.path;
    }

    // Handle other document uploads if needed
    if (req.files.documents) {
      uploadedFiles.documents = req.files.documents.map(file => file.path);
    }

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    // Clean up any uploaded files in case of error
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Register company
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, website, location, description } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with this email already exists",
      });
    }

    // Validate and handle logo upload if provided
    if (req.files && req.files.logo) {
      const logoFile = req.files.logo[0];
      if (!logoFile.mimetype.startsWith("image/")) {
        fs.unlinkSync(logoFile.path);
        return res.status(400).json({
          success: false,
          message: "Logo must be an image file",
        });
      }
    }

    const hashPass = await bcrypt.hash(password, 10);
    const company = await Company.create({
      name,
      email,
      password: hashPass,
      phone,
      website,
      location,
      description,
      logo: req.files?.logo ? req.files.logo[0].path : undefined,
    });

    const token = createCompanyToken(company._id, company.email);

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company,
      token,
    });
  } catch (err) {
    if (req.files?.logo) {
      fs.unlinkSync(req.files.logo[0].path);
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login company
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = createCompanyToken(company._id, company.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get company profile
exports.getProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id).populate("postedJobs");
    res.status(200).json({
      success: true,
      company,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update company profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, website, location, description } = req.body;
    const company = await Company.findById(req.company._id);

    // Handle logo update
    if (req.files?.logo) {
      if (company.logo) {
        fs.unlinkSync(company.logo);
      }
      company.logo = req.files.logo[0].path;
    }

    // Update other fields
    if (name) company.name = name;
    if (phone) company.phone = phone;
    if (website) company.website = website;
    if (location) company.location = location;
    if (description) company.description = description;

    await company.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      company,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Post a new job
exports.postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      skillsRequired,
      category,
      employmentType,
      experience,
      salary,
    } = req.body;

    // Create job with company information
    const job = await Job.create({
      title,
      description,
      companyName: req.company.name,
      companyLogo: {
        public_id: req.company.logo || "default_logo_id",
        url: req.company.logo || "default_logo_url",
      },
      location,
      skillsRequired: skillsRequired || [],
      category,
      employmentType: employmentType || "full-time",
      experience,
      salary,
      postedBy: req.company._id,
      status: "active"
    });

    // Add job to company's postedJobs
    const company = await Company.findById(req.company._id);
    company.postedJobs.push(job._id);
    await company.save();

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get company's posted jobs
exports.getPostedJobs = async (req, res) => {
  try {
    // Find jobs where postedBy matches the company's ID
    const jobs = await Job.find({ postedBy: req.company._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate({
        path: 'postedBy',
        select: 'name email' // Select only necessary fields
      });

    console.log('Company ID:', req.company._id);
    console.log('Found Jobs:', jobs);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error('Error in getPostedJobs:', err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get applications for a specific job
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(jobId);
    console.log(req.company._id);
    const job = await Job.findOne({
      _id: jobId,
      postedBy: req.company._id,
    });
    console.log(job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or unauthorized",
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone resume")
      .populate("job", "title");

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

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify that the company owns this job
    if (application.job.company.toString() !== req.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this application",
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}; 