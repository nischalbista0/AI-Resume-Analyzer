const fs = require('fs');
const path = require('path');
const TempResume = require('../models/TempResumeModel');

/**
 * Utility function to clean up orphaned temporary resume files
 * This can be scheduled to run periodically using a cron job
 * @param {boolean} isStartup - Whether this is being called during server startup
 */
const cleanupTempResumes = async (isStartup = false) => {
  try {
    console.log(`Starting temporary resume cleanup... ${isStartup ? '(SERVER STARTUP)' : ''}`);
    
    // Reference to temp directory
    const tempDir = path.join(__dirname, '../public/uploads/temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log(`Created temp directory: ${tempDir}`);
      return; // Nothing to clean if directory was just created
    }
    
    // During startup, clean all temporary files regardless of age
    if (isStartup) {
      console.log('Server startup: Performing complete temp directory cleanup');
      
      try {
        // Get all files in temp directory
        const files = fs.readdirSync(tempDir);
        console.log(`Found ${files.length} files in temp directory to clean up`);
        
        // Delete all files in temp directory
        for (const file of files) {
          try {
            const filePath = path.join(tempDir, file);
            fs.unlinkSync(filePath);
            console.log(`Deleted temp file at startup: ${filePath}`);
          } catch (err) {
            console.error(`Error deleting temp file at startup ${file}:`, err);
          }
        }
        
        // Remove all temp resume records from database
        const result = await TempResume.deleteMany({});
        console.log(`Deleted ${result.deletedCount} temporary resume records from database`);
      } catch (err) {
        console.error('Error during startup cleanup of temp directory:', err);
      }
    } else {
      // Standard periodic cleanup for when the server is running
      
      // Find all temp resumes older than 2 hours (MongoDB TTL might not have caught them yet)
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const oldTempResumes = await TempResume.find({
        createdAt: { $lt: twoHoursAgo }
      });
      
      console.log(`Found ${oldTempResumes.length} old temporary resumes to clean up`);
      
      // Delete files and records
      for (const tempResume of oldTempResumes) {
        try {
          // Check if file exists before attempting to delete
          if (fs.existsSync(tempResume.filePath)) {
            fs.unlinkSync(tempResume.filePath);
            console.log(`Deleted file: ${tempResume.filePath}`);
          } else {
            console.log(`File not found (already deleted): ${tempResume.filePath}`);
          }
          
          // Delete the record
          await TempResume.findByIdAndDelete(tempResume._id);
          console.log(`Deleted record: ${tempResume._id}`);
        } catch (err) {
          console.error(`Error cleaning up temp resume ${tempResume._id}:`, err);
        }
      }
      
      // Check for orphaned files in the temp directory
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        console.log(`Found ${files.length} files in temp directory`);
        
        // Find files older than 2 hours
        const now = Date.now();
        for (const file of files) {
          const filePath = path.join(tempDir, file);
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          
          // Delete files older than 2 hours (7200000 ms)
          if (fileAge > 7200000) {
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted orphaned file: ${filePath}`);
            } catch (err) {
              console.error(`Error deleting orphaned file ${filePath}:`, err);
            }
          }
        }
      }
    }
    
    console.log('Temporary resume cleanup completed');
  } catch (err) {
    console.error('Error during temporary resume cleanup:', err);
  }
};

module.exports = cleanupTempResumes; 