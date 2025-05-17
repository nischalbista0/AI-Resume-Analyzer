const mongoose = require("mongoose");

const TempResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  analysis: {
    type: Object,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Automatically delete after 1 hour if not saved
  }
});

const TempResume = mongoose.model("TempResume", TempResumeSchema);
module.exports = TempResume; 