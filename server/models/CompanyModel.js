const mongoose = require("mongoose");
const validator = require("validator");

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter company name"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please Enter valid email address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  phone: {
    type: String,
    required: [true, "Please enter company phone number"],
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  postedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", CompanySchema);
module.exports = Company; 