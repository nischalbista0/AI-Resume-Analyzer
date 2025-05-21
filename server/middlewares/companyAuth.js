const jwt = require("jsonwebtoken");
const Company = require("../models/CompanyModel");

exports.createCompanyToken = (id, email) => {
  const token = jwt.sign(
    {
      id,
      email,
      type: "company" // Add type to distinguish between user and company tokens
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    }
  );

  return token;
};

exports.isCompanyAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        isLogin: false,
        message: "Missing Token",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          isLogin: false,
          message: err.message,
        });
      }

      // Check if token is a company token
      if (!decoded.type || decoded.type !== "company") {
        return res.status(403).json({
          success: false,
          message: "Invalid token type. Company authentication required.",
        });
      }

      const company = await Company.findById(decoded.id);
      if (!company) {
        return res.status(401).json({
          success: false,
          message: "Company not found",
        });
      }

      req.company = company;
      next();
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}; 