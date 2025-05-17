const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/auth");
const fs = require("fs");
const path = require("path");

exports.register = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists. Please use a different email or try logging in.",
      });
    }

    // Validate required files
    if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar image",
      });
    }

    // Validate file types
    const avatarFile = req.files.avatar[0];
    if (!avatarFile.mimetype.startsWith("image/")) {
      // Delete the uploaded file
      fs.unlinkSync(avatarFile.path);
      return res.status(400).json({
        success: false,
        message: "Avatar must be an image file",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPass,
      avatar: avatarFile.path,
      skills: skills.split(","),
    });

    const token = createToken(user._id, user.email);

    res.status(201).json({
      success: true,
      message: "User Created",
      user,
      token,
    });
  } catch (err) {
    // If there's an error, delete any uploaded files
    if (req.files && req.files.avatar) {
      fs.unlinkSync(req.files.avatar[0].path);
    }

    // Handle specific error types
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists. Please use a different email or try logging in.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = createToken(user._id, user.email);

    res.status(200).json({
      success: true,
      message: "User logged In Successfully",
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isLogin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        isLogin: true,
      });
    } else {
      return res.status(200).json({
        success: true,
        isLogin: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);

    const userPassword = user.password;

    const isMatch = await bcrypt.compare(oldPassword, userPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is wrong",
      });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({
        success: false,
        message: "New password is same as old Password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "New Pasword and Confirm Password are not matching",
      });
    }

    const hashPass = await bcrypt.hash(newPassword, 10);

    user.password = hashPass;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User password changed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { newName, newEmail, newSkills } = req.body;
    const user = await User.findById(req.user._id);

    // Delete old files if new ones are uploaded
    if (req.files) {
      if (req.files.avatar) {
        if (user.avatar) {
          fs.unlinkSync(user.avatar);
        }
        user.avatar = req.files.avatar[0].path;
      }
    }

    user.name = newName;
    user.email = newEmail;
    user.skills = newSkills;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (err) {
    // If there's an error, delete any newly uploaded files
    if (req.files && req.files.avatar) {
      fs.unlinkSync(req.files.avatar[0].path);
    }
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (isMatch) {
      // Delete user's files
      if (user.avatar) {
        fs.unlinkSync(user.avatar);
      }

      await User.findByIdAndRemove(req.user._id);
    } else {
      return res.status(200).json({
        success: false,
        message: "Password does not match !",
      });
    }

    res.status(200).json({
      success: true,
      message: "Account Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    console.log("Upload controller received:", {
      files: req.files,
      body: req.body,
    });

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Get the first file (avatar only now)
    const fileType = Object.keys(req.files)[0];
    const file = req.files[fileType][0];

    console.log("Processing file:", {
      type: fileType,
      file: file,
    });

    res.status(200).json({
      success: true,
      data: file.path,
    });
  } catch (err) {
    console.error("Upload error details:", {
      message: err.message,
      stack: err.stack,
      code: err.code,
    });
    res.status(500).json({
      success: false,
      message: err.message || "Error uploading file",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
