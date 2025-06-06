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

  username: {
    type: String,
    unique: true,
    sparse: true, // Allow nulls while maintaining uniqueness for non-null values
  },

  nickname: {
    type: String,
  },

  dateOfBirth: {
    type: Date,
  },

  nationality: {
    type: String,
  },

  bio: {
    type: String,
  },

  phone: {
    type: String,
  },

  address: {
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

  resumeAnalysis: {
    score: {
      type: Number,
      default: 0,
    },
    recommendations: [
      {
        type: String,
      },
    ],
    skillGaps: [
      {
        type: String,
      },
    ],
    atsTips: [
      {
        type: String,
      },
    ],
    jobMatches: [
      {
        type: String,
      },
    ],
    professionalDevelopment: [
      {
        type: String,
      },
    ],
    lastAnalyzed: {
      type: Date,
      default: null,
    },
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
  apiUsage: {
    totalTokens: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    lastAnalysisDate: {
      type: Date,
    },
    analysisHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        inputTokens: Number,
        outputTokens: Number,
        totalTokens: Number,
        cost: Number,
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
