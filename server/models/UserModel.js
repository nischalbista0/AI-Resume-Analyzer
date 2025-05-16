const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
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

  avatar: {
    type: String,
  },

  role: {
    type: String,
    enum: ["applicant", "admin"],
    default: "applicant",
  },

  skills: [
    {
      type: String,
    },
  ],

  resume: {
    type: String,
    required: false,
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  appliedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
