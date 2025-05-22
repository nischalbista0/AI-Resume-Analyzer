const User = require("../models/UserModel");
const TempResume = require("../models/TempResumeModel");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");

// Initialize OpenAI API client
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Helper function to ensure directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Created directory: ${directory}`);
  }
};

// Create temporary directory for uploads
const tempUploadDir = path.join(__dirname, "../public/uploads/temp");
ensureDirectoryExists(tempUploadDir);

// Upload resume controller (temporary storage)
exports.uploadTempResume = async (req, res) => {
  try {
    // Check if resume file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Resume must be a PDF or DOC file",
      });
    }

    // Move file to temporary directory with unique name
    const fileExt = path.extname(req.file.originalname);
    const tempFileName = `temp-${req.user._id}-${Date.now()}${fileExt}`;
    const tempFilePath = path.join(tempUploadDir, tempFileName);

    // Create a read stream from the uploaded file
    const readStream = fs.createReadStream(req.file.path);
    // Create a write stream to the temporary location
    const writeStream = fs.createWriteStream(tempFilePath);

    // Pipe the read stream to the write stream
    readStream.pipe(writeStream);

    // When the copying is done
    writeStream.on("finish", async () => {
      // Delete the original uploaded file
      fs.unlinkSync(req.file.path);

      // Create temporary resume entry in database
      const tempResume = await TempResume.create({
        userId: req.user._id,
        filePath: tempFilePath,
      });

      res.status(200).json({
        success: true,
        message: "Resume uploaded temporarily",
        tempResumeId: tempResume._id,
        filePath: tempFilePath,
      });
    });

    // Handle errors during the copying process
    writeStream.on("error", (err) => {
      console.error("Error copying file:", err);
      // Cleanup original file
      fs.unlinkSync(req.file.path);
      return res.status(500).json({
        success: false,
        message: "Error saving temporary file",
        error: err.message,
      });
    });
  } catch (err) {
    // Delete the uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Analyze temporary resume using OpenAI API
exports.analyzeTempResume = async (req, res) => {
  try {
    const { tempResumeId } = req.params;

    // Find the temporary resume
    const tempResume = await TempResume.findById(tempResumeId);

    if (
      !tempResume ||
      tempResume.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(404).json({
        success: false,
        message: "Temporary resume not found or not authorized",
      });
    }

    // Check if resume is a PDF file
    if (!tempResume.filePath.endsWith(".pdf")) {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes can be analyzed at this time.",
      });
    }

    // Extract text from the PDF
    let resumeBuffer;
    try {
      resumeBuffer = fs.readFileSync(tempResume.filePath);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to read the resume file.",
        error: error.message,
      });
    }

    // Parse PDF into text
    let resumeText;
    try {
      const pdfData = await pdfParse(resumeBuffer);
      resumeText = pdfData.text;
      console.log(resumeText);

      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from the resume. The PDF might be scanned or protected.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse the PDF file.",
        error: error.message,
      });
    }

    // Prepare prompt for OpenAI
    const prompt = `
You are a professional career coach and resume analyst. Analyze the following resume text and provide feedback in JSON format.

Resume Text:
"""${resumeText}"""

Output JSON format:
{
  "score": (number 0-100),
  "recommendations": [/* array of improvement suggestions */],
  "skill_gaps": [/* array of missing or weak skills */],
  "ats_tips": [/* array of ATS optimization tips */],
  "job_matches": [/* array of suitable job roles */],
  "professional_development": [/* array of relevant courses or training */]
}

Be concise and use bullet points or short phrases in each array. Only output valid JSON.
`;

    // Call OpenAI API
    try {
      // Track start time for performance monitoring
      const startTime = Date.now();

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume analyst that provides feedback in valid JSON format only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      // Calculate elapsed time
      const elapsedTime = (Date.now() - startTime) / 1000;

      // Extract the response content
      const responseContent = completion.choices[0].message.content.trim();

      // Get token usage from the response
      const tokenUsage = completion.usage;

      // Calculate cost based on current OpenAI pricing (as of knowledge cutoff)
      // gpt-3.5-turbo pricing: ~$0.0015 per 1K input tokens, ~$0.002 per 1K output tokens
      const inputTokensCost = (tokenUsage.prompt_tokens / 1000) * 0.0015;
      const outputTokensCost = (tokenUsage.completion_tokens / 1000) * 0.002;
      const totalCost = inputTokensCost + outputTokensCost;

      // Log token usage and cost information
      console.log("OpenAI API Usage Stats:");
      console.log(`Model: gpt-3.5-turbo`);
      console.log(`Response time: ${elapsedTime.toFixed(2)} seconds`);
      console.log(
        `Input tokens: ${
          tokenUsage.prompt_tokens
        } (Cost: $${inputTokensCost.toFixed(6)})`
      );
      console.log(
        `Output tokens: ${
          tokenUsage.completion_tokens
        } (Cost: $${outputTokensCost.toFixed(6)})`
      );
      console.log(`Total tokens: ${tokenUsage.total_tokens}`);
      console.log(`Estimated cost: $${totalCost.toFixed(6)}`);

      // Update user's API usage statistics
      const user = await User.findById(req.user._id);
      if (!user.apiUsage) {
        user.apiUsage = {
          totalTokens: 0,
          totalCost: 0,
          analysisHistory: [],
        };
      }

      // Increment total usage
      user.apiUsage.totalTokens += tokenUsage.total_tokens;
      user.apiUsage.totalCost += totalCost;
      user.apiUsage.lastAnalysisDate = new Date();

      // Add to analysis history
      user.apiUsage.analysisHistory.push({
        date: new Date(),
        inputTokens: tokenUsage.prompt_tokens,
        outputTokens: tokenUsage.completion_tokens,
        totalTokens: tokenUsage.total_tokens,
        cost: totalCost,
      });

      // Save user with updated usage stats
      await user.save();

      // Try to parse the JSON response
      let analysisResult;
      try {
        analysisResult = JSON.parse(responseContent);
      } catch (jsonError) {
        console.error("OpenAI response is not valid JSON:", responseContent);
        // Try to extract JSON from the response if it contains text before or after the JSON
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
          } catch {
            return res.status(500).json({
              success: false,
              message: "Failed to parse the analysis result.",
              error:
                "The AI response could not be correctly formatted as JSON.",
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to parse the analysis result.",
            error: "The AI response could not be correctly formatted as JSON.",
          });
        }
      }

      // Save analysis to temp resume
      tempResume.analysis = analysisResult;
      await tempResume.save();

      // Return analysis results with usage information
      return res.status(200).json({
        success: true,
        message: "Resume analyzed successfully",
        tempResumeId: tempResume._id,
        analysis: analysisResult,
        usage: {
          input_tokens: tokenUsage.prompt_tokens,
          output_tokens: tokenUsage.completion_tokens,
          total_tokens: tokenUsage.total_tokens,
          estimated_cost_usd: totalCost,
          response_time_seconds: elapsedTime,
        },
        total_usage: {
          total_tokens: user.apiUsage.totalTokens,
          total_cost_usd: user.apiUsage.totalCost,
          analysis_count: user.apiUsage.analysisHistory.length,
        },
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to analyze the resume with AI.",
        error: error.message,
      });
    }
  } catch (err) {
    console.error("Resume analysis error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Permanently save the temporary resume
exports.saveResume = async (req, res) => {
  try {
    const { tempResumeId } = req.params;

    // Find the temporary resume
    const tempResume = await TempResume.findById(tempResumeId);

    if (
      !tempResume ||
      tempResume.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(404).json({
        success: false,
        message: "Temporary resume not found or not authorized",
      });
    }

    // Get the user
    const user = await User.findById(req.user._id);

    // Delete old resume if it exists
    if (user.resume) {
      try {
        // Check if file exists before attempting to delete
        if (fs.existsSync(user.resume)) {
          fs.unlinkSync(user.resume);
          console.log(`Successfully deleted old resume: ${user.resume}`);
        } else {
          console.warn(`Old resume file not found: ${user.resume}`);
        }
      } catch (err) {
        console.error("Error deleting old resume:", err);
        // Continue with the save process even if deletion fails
      }
    }

    // Create the permanent resume path
    const resumesDir = path.join(__dirname, "../public/uploads/resumes");
    ensureDirectoryExists(resumesDir);

    const fileExt = path.extname(tempResume.filePath);
    const resumeFileName = `resume-${user._id}-${Date.now()}${fileExt}`;
    const resumeFilePath = path.join(resumesDir, resumeFileName);

    // Copy from temp to permanent location
    fs.copyFileSync(tempResume.filePath, resumeFilePath);

    // Store relative path with backslashes
    const relativePath = path.join(
      "public",
      "uploads",
      "resumes",
      resumeFileName
    );

    // Update the user's resume data with structured analysis
    user.resume = relativePath;
    user.resumeAnalysis = {
      score: tempResume.analysis.score || 0,
      recommendations: tempResume.analysis.recommendations || [],
      skillGaps: tempResume.analysis.skill_gaps || [],
      atsTips: tempResume.analysis.ats_tips || [],
      jobMatches: tempResume.analysis.job_matches || [],
      professionalDevelopment:
        tempResume.analysis.professional_development || [],
      lastAnalyzed: new Date(),
    };
    await user.save();

    // Delete temporary file
    fs.unlinkSync(tempResume.filePath);

    // Delete temporary resume entry
    await TempResume.findByIdAndDelete(tempResumeId);

    return res.status(200).json({
      success: true,
      message: "Resume saved permanently",
      resumePath: resumeFilePath,
      analysis: user.resumeAnalysis,
    });
  } catch (err) {
    console.error("Error saving resume:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Discard temporary resume
exports.discardResume = async (req, res) => {
  try {
    const { tempResumeId } = req.params;

    // Find the temporary resume
    const tempResume = await TempResume.findById(tempResumeId);

    if (
      !tempResume ||
      tempResume.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(404).json({
        success: false,
        message: "Temporary resume not found or not authorized",
      });
    }

    // Delete the file
    try {
      fs.unlinkSync(tempResume.filePath);
    } catch (err) {
      console.error("Error deleting temporary file:", err);
    }

    // Delete from database
    await TempResume.findByIdAndDelete(tempResumeId);

    return res.status(200).json({
      success: true,
      message: "Temporary resume discarded successfully",
    });
  } catch (err) {
    console.error("Error discarding resume:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get user resume
exports.getUserResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user",
      });
    }

    res.status(200).json({
      success: true,
      resumePath: user.resume,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete user resume
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user",
      });
    }

    // Delete the file
    try {
      fs.unlinkSync(user.resume);
    } catch (err) {
      console.error("Error deleting resume file:", err);
    }

    // Remove resume path from user
    user.resume = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Analyze resume using OpenAI API
exports.analyzeResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found for this user. Please upload a resume first.",
      });
    }

    // Check if resume is a PDF file
    if (!user.resume.endsWith(".pdf")) {
      return res.status(400).json({
        success: false,
        message: "Only PDF resumes can be analyzed at this time.",
      });
    }

    // Extract text from the PDF
    let resumeBuffer;
    try {
      resumeBuffer = fs.readFileSync(user.resume);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to read the resume file.",
        error: error.message,
      });
    }

    // Parse PDF into text
    let resumeText;
    try {
      const pdfData = await pdfParse(resumeBuffer);
      resumeText = pdfData.text;
      console.log(resumeText);

      if (!resumeText || resumeText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "Could not extract text from the resume. The PDF might be scanned or protected.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse the PDF file.",
        error: error.message,
      });
    }

    // Prepare prompt for OpenAI
    const prompt = `
You are a professional career coach and resume analyst. Analyze the following resume text and provide feedback in JSON format.

Resume Text:
"""${resumeText}"""

Output JSON format:
{
  "score": (number 0-100),
  "recommendations": [/* array of improvement suggestions */],
  "skill_gaps": [/* array of missing or weak skills */],
  "ats_tips": [/* array of ATS optimization tips */],
  "job_matches": [/* array of suitable job roles */],
  "professional_development": [/* array of relevant courses or training */]
}

Be concise and use bullet points or short phrases in each array. Only output valid JSON.
`;

    // Call OpenAI API
    try {
      // Track start time for performance monitoring
      const startTime = Date.now();

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional resume analyst that provides feedback in valid JSON format only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      // Calculate elapsed time
      const elapsedTime = (Date.now() - startTime) / 1000;

      // Extract the response content
      const responseContent = completion.choices[0].message.content.trim();

      // Get token usage from the response
      const tokenUsage = completion.usage;

      // Calculate cost based on current OpenAI pricing (as of knowledge cutoff)
      // gpt-3.5-turbo pricing: ~$0.0015 per 1K input tokens, ~$0.002 per 1K output tokens
      const inputTokensCost = (tokenUsage.prompt_tokens / 1000) * 0.0015;
      const outputTokensCost = (tokenUsage.completion_tokens / 1000) * 0.002;
      const totalCost = inputTokensCost + outputTokensCost;

      // Log token usage and cost information
      console.log("OpenAI API Usage Stats:");
      console.log(`Model: gpt-3.5-turbo`);
      console.log(`Response time: ${elapsedTime.toFixed(2)} seconds`);
      console.log(
        `Input tokens: ${
          tokenUsage.prompt_tokens
        } (Cost: $${inputTokensCost.toFixed(6)})`
      );
      console.log(
        `Output tokens: ${
          tokenUsage.completion_tokens
        } (Cost: $${outputTokensCost.toFixed(6)})`
      );
      console.log(`Total tokens: ${tokenUsage.total_tokens}`);
      console.log(`Estimated cost: $${totalCost.toFixed(6)}`);

      // Update user's API usage statistics
      if (!user.apiUsage) {
        user.apiUsage = {
          totalTokens: 0,
          totalCost: 0,
          analysisHistory: [],
        };
      }

      // Increment total usage
      user.apiUsage.totalTokens += tokenUsage.total_tokens;
      user.apiUsage.totalCost += totalCost;
      user.apiUsage.lastAnalysisDate = new Date();

      // Add to analysis history
      user.apiUsage.analysisHistory.push({
        date: new Date(),
        inputTokens: tokenUsage.prompt_tokens,
        outputTokens: tokenUsage.completion_tokens,
        totalTokens: tokenUsage.total_tokens,
        cost: totalCost,
      });

      // Save user with updated usage stats
      await user.save();

      // Try to parse the JSON response
      let analysisResult;
      try {
        analysisResult = JSON.parse(responseContent);
      } catch (jsonError) {
        console.error("OpenAI response is not valid JSON:", responseContent);
        // Try to extract JSON from the response if it contains text before or after the JSON
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            analysisResult = JSON.parse(jsonMatch[0]);
          } catch {
            return res.status(500).json({
              success: false,
              message: "Failed to parse the analysis result.",
              error:
                "The AI response could not be correctly formatted as JSON.",
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            message: "Failed to parse the analysis result.",
            error: "The AI response could not be correctly formatted as JSON.",
          });
        }
      }

      // Return analysis results with usage information
      return res.status(200).json({
        success: true,
        message: "Resume analyzed successfully",
        analysis: analysisResult,
        usage: {
          input_tokens: tokenUsage.prompt_tokens,
          output_tokens: tokenUsage.completion_tokens,
          total_tokens: tokenUsage.total_tokens,
          estimated_cost_usd: totalCost,
          response_time_seconds: elapsedTime,
        },
        total_usage: {
          total_tokens: user.apiUsage.totalTokens,
          total_cost_usd: user.apiUsage.totalCost,
          analysis_count: user.apiUsage.analysisHistory.length,
        },
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to analyze the resume with AI.",
        error: error.message,
      });
    }
  } catch (err) {
    console.error("Resume analysis error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get API usage stats
exports.getApiUsageStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.apiUsage) {
      return res.status(200).json({
        success: true,
        message: "No API usage statistics found for this user.",
        apiUsage: {
          totalTokens: 0,
          totalCost: 0,
          analysisCount: 0,
          lastAnalysisDate: null,
          history: [],
        },
      });
    }

    // Prepare a summary of usage history by month
    const monthlySummary = {};
    if (
      user.apiUsage.analysisHistory &&
      user.apiUsage.analysisHistory.length > 0
    ) {
      user.apiUsage.analysisHistory.forEach((record) => {
        const date = new Date(record.date);
        const monthYear = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (!monthlySummary[monthYear]) {
          monthlySummary[monthYear] = {
            totalTokens: 0,
            totalCost: 0,
            analysisCount: 0,
          };
        }

        monthlySummary[monthYear].totalTokens += record.totalTokens;
        monthlySummary[monthYear].totalCost += record.cost;
        monthlySummary[monthYear].analysisCount += 1;
      });
    }

    // Return detailed API usage statistics
    return res.status(200).json({
      success: true,
      apiUsage: {
        totalTokens: user.apiUsage.totalTokens || 0,
        totalCost: parseFloat((user.apiUsage.totalCost || 0).toFixed(6)),
        analysisCount: user.apiUsage.analysisHistory
          ? user.apiUsage.analysisHistory.length
          : 0,
        lastAnalysisDate: user.apiUsage.lastAnalysisDate,
        monthlySummary: Object.entries(monthlySummary)
          .map(([month, stats]) => ({
            month,
            totalTokens: stats.totalTokens,
            totalCost: parseFloat(stats.totalCost.toFixed(6)),
            analysisCount: stats.analysisCount,
          }))
          .sort((a, b) => b.month.localeCompare(a.month)), // Sort by most recent month
        // Last 5 analyses for reference
        recentHistory: user.apiUsage.analysisHistory
          ? user.apiUsage.analysisHistory
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((record) => ({
                date: record.date,
                inputTokens: record.inputTokens,
                outputTokens: record.outputTokens,
                totalTokens: record.totalTokens,
                cost: parseFloat(record.cost.toFixed(6)),
              }))
          : [],
      },
    });
  } catch (err) {
    console.error("Error fetching API usage stats:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
