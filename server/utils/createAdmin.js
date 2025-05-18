const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@gmail.com" });

    if (!adminExists) {
      // Create default admin
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        skills: ["Administration", "Management"],
        avatar: "",
        resume: "",
      });

      console.log("Default admin user created successfully");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

module.exports = createDefaultAdmin;
