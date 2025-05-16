const multer = require("multer");
const path = require("path");
const fs = require("fs");
const maxSize = 10 * 1024 * 1024; // 10MB

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    "public/uploads",
    "public/uploads/avatars",
    "public/uploads/resumes",
  ];

  dirs.forEach((dir) => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    } catch (error) {
      console.error(`Error creating directory ${dir}:`, error);
      throw error;
    }
  });
};

try {
  ensureUploadDirs();
} catch (error) {
  console.error("Failed to create upload directories:", error);
  process.exit(1);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let uploadPath = "public/uploads/";
      if (file.fieldname === "avatar") {
        uploadPath += "avatars/";
      } else if (file.fieldname === "resume") {
        uploadPath += "resumes/";
      } else {
        uploadPath += "others/";
      }

      // Ensure the specific directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      console.log("File upload destination:", {
        fieldname: file.fieldname,
        path: uploadPath,
      });

      cb(null, uploadPath);
    } catch (error) {
      console.error("Storage destination error:", error);
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${ext}`;
      console.log("Generated filename:", filename);
      cb(null, filename);
    } catch (error) {
      console.error("Filename generation error:", error);
      cb(error);
    }
  },
});

const fileFilter = (req, file, cb) => {
  try {
    console.log("File filter check:", {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname,
    });

    if (file.fieldname === "avatar") {
      if (file.mimetype.startsWith("image/")) {
        console.log("Avatar file accepted");
        cb(null, true);
      } else {
        console.log("Avatar file rejected - not an image");
        cb(new Error("Only image files are allowed for avatar!"), false);
      }
    } else if (file.fieldname === "resume") {
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        console.log("Resume file accepted");
        cb(null, true);
      } else {
        console.log("Resume file rejected - invalid type");
        cb(new Error("Only PDF and DOC files are allowed for resume!"), false);
      }
    } else {
      console.log("File accepted - unknown type");
      cb(null, true);
    }
  } catch (error) {
    console.error("File filter error:", error);
    cb(error);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload;
