import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { MdCloudUpload } from "react-icons/md";
import { FaRegFileWord } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If filePath is an object with url property
  if (typeof filePath === "object" && filePath.url) {
    const normalizedPath = filePath.url
      .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")
      .replace(/\\/g, "/");
    return `http://localhost:3000/${normalizedPath}`;
  }

  return null;
};

// Use hardcoded API URL as requested
const API_URL = "http://localhost:3000/api/v1";

export const ResumeAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempResumeId, setTempResumeId] = useState(null); // State to store temporary resume ID
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [youtubeCourses, setYoutubeCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false); // New state for tracking complete analysis

  // New state for Job Postings
  const [jobPostings, setJobPostings] = useState([]);
  const [internalJobs, setInternalJobs] = useState([]); // New state for internal jobs
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);

  // Data from backend analysisResult
  // Access data directly from the root of analysisResult.analysis
  const analysisData = analysisResult?.analysis;

  const resumeScore = analysisData?.score || 0;
  const areasForImprovement = analysisData?.recommendations || [];
  const skillGaps = analysisData?.skill_gaps || [];
  const atsTips = analysisData?.ats_tips || [];
  const jobMatches = analysisData?.job_matches || [];
  const professionalDevelopment = analysisData?.professional_development || [];

  const navigate = useNavigate();

  // Function to fetch YouTube courses based on professional development recommendations
  const fetchYoutubeCourses = async (recommendations, page = 1) => {
    if (!recommendations || recommendations.length === 0) return;

    if (page === 1) {
      setLoadingCourses(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Create an array to store all video results
      let allVideos = [];

      // Search for each recommendation
      for (const recommendation of recommendations) {
        const options = {
          method: "GET",
          url: "https://youtube-v2.p.rapidapi.com/search/",
          params: {
            query: recommendation,
            lang: "en",
            order_by: "this_month",
            country: "us",
            page: page,
            limit: page === 1 ? "8" : "8", // Show 8 courses initially and per page
          },
          headers: {
            "x-rapidapi-key":
              "7318af8020msh13b0e4ec2d7b8b7p134e91jsn5ae19029597d",
            "x-rapidapi-host": "youtube-v2.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        if (response.data && response.data.videos) {
          // Add the recommendation as a category to each video
          const videosWithCategory = response.data.videos.map((video) => ({
            ...video,
            category: recommendation,
          }));
          allVideos = [...allVideos, ...videosWithCategory];
        }
      }

      // Remove duplicates based on video_id
      const uniqueVideos = Array.from(
        new Map(allVideos.map((video) => [video.video_id, video])).values()
      );

      // Sort by relevance
      const sortedVideos = uniqueVideos.sort((a, b) => b.views - a.views);

      // Limit to 8 videos for initial load
      const limitedVideos =
        page === 1 ? sortedVideos.slice(0, 8) : sortedVideos;

      if (page === 1) {
        setYoutubeCourses(limitedVideos);
      } else {
        setYoutubeCourses((prev) => [...prev, ...limitedVideos]);
      }

      // Check if we have more videos to load
      setHasMore(sortedVideos.length > 0);
    } catch (error) {
      console.error("Error fetching YouTube courses:", error);
      toast.error("Failed to fetch recommended courses");
    } finally {
      setLoadingCourses(false);
      setLoadingMore(false);
    }
  };

  // Function to fetch Job Postings based on job matches
  const fetchJobPostings = async (jobMatches, page = 1) => {
    if (!jobMatches || jobMatches.length === 0) return;

    if (page === 1) {
      setLoadingJobs(true);
    } else {
      setLoadingMoreJobs(true);
    }

    try {
      // Create a single search query from all job matches
      const searchQuery = jobMatches.join(" OR ");

      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: searchQuery,
          page: page.toString(),
          num_pages: "1",
          date_posted: "all",
          limit: "20", // Increased limit to get more results in one call
        },
        headers: {
          "x-rapidapi-key":
            "7318af8020msh13b0e4ec2d7b8b7p134e91jsn5ae19029597d",
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      if (response.data && response.data.data) {
        // Filter and categorize jobs based on matches
        const categorizedJobs = response.data.data.map((job) => {
          // Find the best matching category
          const bestMatch = jobMatches.find(
            (match) =>
              job.job_title.toLowerCase().includes(match.toLowerCase()) ||
              job.job_description.toLowerCase().includes(match.toLowerCase())
          );

          return {
            ...job,
            category: bestMatch || jobMatches[0], // Fallback to first category if no match
          };
        });

        // Remove duplicates based on job_id
        const uniqueJobs = Array.from(
          new Map(categorizedJobs.map((job) => [job.job_id, job])).values()
        );

        // Limit to 8 jobs for initial load
        const limitedJobs = page === 1 ? uniqueJobs.slice(0, 8) : uniqueJobs;

        if (page === 1) {
          setJobPostings(limitedJobs);
        } else {
          setJobPostings((prev) => [...prev, ...limitedJobs]);
        }

        // Check if we have more jobs to load
        setHasMoreJobs(uniqueJobs.length > 0);
      }
    } catch (error) {
      console.error("Error fetching job postings:", error);
      toast.error("Failed to fetch recommended job postings");
    } finally {
      setLoadingJobs(false);
      setLoadingMoreJobs(false);
    }
  };

  // Function to fetch internal jobs based on job matches
  const fetchInternalJobs = async (jobMatches) => {
    if (!jobMatches || jobMatches.length === 0) return;

    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        toast.error("You must be logged in to view job recommendations");
        return;
      }

      const response = await axios.get(`${API_URL}/jobs`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });

      if (response.data.success && response.data.Jobs) {
        // Create a single regex pattern for all job matches
        const matchPattern = new RegExp(
          jobMatches.map((match) => match.toLowerCase()).join("|"),
          "i"
        );

        // Filter jobs based on the combined pattern
        const matchedJobs = response.data.Jobs.filter(
          (job) =>
            matchPattern.test(job.title.toLowerCase()) ||
            matchPattern.test(job.description.toLowerCase())
        );

        setInternalJobs(matchedJobs);
      }
    } catch (error) {
      console.error("Error fetching internal jobs:", error);
      toast.error("Failed to fetch internal job recommendations");
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchYoutubeCourses(analysisData.professional_development, nextPage);
  };

  const handleLoadMoreJobs = () => {
    const nextPage = currentJobPage + 1;
    setCurrentJobPage(nextPage);
    fetchJobPostings(analysisData.job_matches, nextPage);
  };

  // Effect to fetch courses when analysis is complete
  useEffect(() => {
    if (analysisResult?.success && analysisData?.professional_development) {
      setCurrentPage(1);
      setHasMore(true);
      fetchYoutubeCourses(analysisData.professional_development, 1);
    }
  }, [analysisResult]);

  // Update the useEffect to fetch both internal and external jobs in parallel
  useEffect(() => {
    if (analysisResult?.success && analysisData?.job_matches) {
      setCurrentJobPage(1);
      setHasMoreJobs(true);

      // Fetch both internal and external jobs in parallel
      Promise.all([
        fetchInternalJobs(analysisData.job_matches),
        fetchJobPostings(analysisData.job_matches, 1),
      ]).catch((error) => {
        console.error("Error fetching jobs:", error);
      });
    }
  }, [analysisResult]);

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setTempResumeId(null); // Clear previous temp ID
      setAnalysisResult(null); // Clear previous results
      setError(null); // Clear previous errors
    }
  };

  const handleClearFile = () => {
    // Clear the file input value
    const fileInput = document.getElementById("resumeFileInput");
    if (fileInput) {
      fileInput.value = "";
    }
    // Reset all states
    setSelectedFile(null);
    setTempResumeId(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleFileInputClick = (event) => {
    // Prevent the click from bubbling up to the parent div
    event.stopPropagation();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      toast.error("You must be logged in to analyze resumes.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setTempResumeId(null);
    setIsAnalysisComplete(false); // Reset analysis complete status

    const formData = new FormData();
    formData.append("resume", selectedFile);

    const authConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      },
      withCredentials: true,
    };

    const authGetConfig = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      withCredentials: true,
    };

    try {
      const uploadResponse = await axios.post(
        `${API_URL}/resume/temp-upload`,
        formData,
        authConfig
      );

      const newTempResumeId = uploadResponse.data.tempResumeId;
      setTempResumeId(newTempResumeId);

      toast.loading("Analyzing resume...", { id: "analyzeToast" });
      const analyzeResponse = await axios.get(
        `${API_URL}/resume/temp-analyze/${newTempResumeId}`,
        authGetConfig
      );

      // Set initial analysis result but don't show it yet
      setAnalysisResult(analyzeResponse.data);

      // Fetch both jobs and courses data
      toast.loading("Fetching job recommendations...", { id: "jobsToast" });
      await fetchJobPostings(analyzeResponse.data.analysis.job_matches, 1);
      toast.dismiss("jobsToast");

      toast.loading("Fetching course recommendations...", {
        id: "coursesToast",
      });
      await fetchYoutubeCourses(
        analyzeResponse.data.analysis.professional_development,
        1
      );
      toast.dismiss("coursesToast");

      // Set analysis as complete only after all data is loaded
      setIsAnalysisComplete(true);
      toast.success("Analysis complete!", { id: "analyzeToast" });

      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Error during resume analysis:", err);
      setError("Failed to analyze resume. Please try again.");
      if (err.response?.data?.message) {
        toast.error(`Error: ${err.response.data.message}`);
      } else {
        toast.error("An unexpected error occurred.");
      }
      toast.dismiss("uploadToast");
      toast.dismiss("analyzeToast");
      toast.dismiss("jobsToast");
      toast.dismiss("coursesToast");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    if (!tempResumeId) {
      toast.error("No resume to save.");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      toast.error("You must be logged in to save resumes.");
      return;
    }

    try {
      toast.loading("Saving resume...", { id: "saveToast" });
      const response = await axios.post(
        `${API_URL}/resume/save/${tempResumeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update user data in localStorage
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        userData.resume = response.data.resumePath;
        userData.resumeAnalysis = response.data.analysis;
        localStorage.setItem("userData", JSON.stringify(userData));

        toast.success("Resume saved successfully!", { id: "saveToast" });

        // Reset the form
        setSelectedFile(null);
        setTempResumeId(null);
        setAnalysisResult(null);

        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error saving resume:", err);
      toast.error(err.response?.data?.message || "Failed to save resume.");
      toast.dismiss("saveToast");
    }
  };

  const handleDiscardResume = async () => {
    if (!tempResumeId) {
      toast.error("No resume to discard.");
      return;
    }

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      toast.error("You must be logged in to discard resumes.");
      return;
    }

    try {
      toast.loading("Discarding resume...", { id: "discardToast" });
      await axios.delete(`${API_URL}/resume/discard/${tempResumeId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });

      toast.success("Resume discarded successfully!", { id: "discardToast" });
      // Reset the form
      setSelectedFile(null);
      setTempResumeId(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Error discarding resume:", err);
      toast.error(err.response?.data?.message || "Failed to discard resume.");
      toast.dismiss("discardToast");
    }
  };

  const handleStartAgain = () => {
    setSelectedFile(null);
    setTempResumeId(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <>
      <MetaData title="Resume Analysis" />
      <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
        {!analysisResult || !isAnalysisComplete ? (
          <>
            {/* First Section: Optimize Your Resume (File Selection) */}
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-gray-200 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
              {/* Subtle background element for AI vibe */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-gray-50 opacity-60"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                  Optimize Your Resume in Minutes
                </h2>
                <div
                  className="border-2 border-dashed border-blue-500 rounded-xl p-12 text-center bg-blue-100/50 backdrop-filter backdrop-blur-md cursor-pointer transition-colors duration-300 hover:bg-blue-200/60 transform hover:scale-[1.01]"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("resumeFileInput").click()
                  }
                >
                  <input
                    type="file"
                    id="resumeFileInput"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    onClick={handleFileInputClick}
                    className="hidden"
                  />
                  <MdCloudUpload className="mx-auto text-blue-700 text-7xl mb-5 drop-shadow-lg" />
                  <p className="text-2xl font-semibold text-blue-800 mb-3">
                    Drag & Drop Your Resume Here
                  </p>
                  <p className="text-gray-700 text-base mb-8">
                    Files can be PDF, DOC, or DOCX
                  </p>
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-4 rounded-full transition duration-300 font-semibold shadow-lg transform hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("resumeFileInput").click();
                    }}
                  >
                    Choose File
                  </button>
                </div>
                {selectedFile && (
                  <div className="mt-8 text-center text-gray-800 font-semibold flex items-center justify-center gap-3 text-lg">
                    <FaRegFileWord className="text-blue-600 text-2xl" />
                    Selected file:{" "}
                    <span className="font-bold text-blue-700">
                      {selectedFile.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Second Section: Analyze Resume (Button) */}
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-gray-200 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
              {/* Subtle background element for AI vibe */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30 opacity-60"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                  Analyze Your Resume Using AI
                </h2>
                <div
                  className={`border border-blue-400 rounded-lg p-6 flex items-center gap-4 mb-8 transition-opacity duration-300 ${
                    !selectedFile || loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="bg-gray-100 p-3 rounded-md flex-shrink-0 shadow-inner">
                    <FaRegFileWord className="text-blue-600 text-2xl" />
                  </div>

                  <span className="text-gray-700 font-medium flex-grow truncate">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                  {selectedFile && !loading && (
                    <button
                      className="flex-shrink-0 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                      onClick={handleClearFile}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="text-center">
                  <button
                    className={`bg-blue-700 hover:bg-blue-800 text-white px-12 py-4 rounded-full transition duration-300 font-semibold shadow-lg transform hover:scale-105 ${
                      !selectedFile || loading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={handleAnalyze}
                    disabled={!selectedFile || loading}
                  >
                    {loading ? "ANALYZING..." : "ANALYZE"}
                  </button>
                </div>
                {error && (
                  <div className="mt-6 text-center text-red-600 font-semibold text-base">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-lg font-medium">
                    Analyzing your resume and gathering recommendations...
                  </p>
                  <p className="mt-2 text-gray-500 text-sm">
                    This may take a few moments. Please wait.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Analysis Results Sections */}
            {analysisResult.success && analysisData ? (
              <>
                {/* Summary Overview Section */}
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
                  {/* Subtle background element */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30 opacity-60"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                      Summary <span className="text-blue-700">OverView</span>
                    </h2>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                      {/* Circular Progress Bar */}
                      <div
                        className="w-40 h-40 flex items-center justify-center rounded-full relative shadow-xl border-4 border-blue-600"
                        style={{
                          background: `conic-gradient(#1E40AF ${
                            resumeScore * 3.6
                          }deg, #D1D5DB ${resumeScore * 3.6}deg)`,
                        }}
                      >
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-300">
                          <span className="text-4xl font-bold text-blue-800">
                            {resumeScore}%
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 mt-6 md:mt-0 space-y-4">
                        <h3 className="text-xl font-semibold text-blue-700 mb-4">
                          Analysis Summary
                        </h3>
                        <div className="text-gray-700 space-y-3">
                          <div>
                            <p className="font-semibold text-gray-800 mb-2">
                              Areas for Improvement:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                              {areasForImprovement.length > 0 ? (
                                areasForImprovement.map((item, index) => (
                                  <li
                                    key={index}
                                    className="text-gray-700 text-sm"
                                  >
                                    {item}
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-700 text-sm">
                                  No specific areas for improvement found.
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section-wise Analysis */}
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
                  {/* Subtle background element */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50/30 opacity-60"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                      Section-wise{" "}
                      <span className="text-blue-700">Analysis</span>
                    </h2>
                    <div className="divide-y divide-gray-200 space-y-6">
                      {/* Recommendations */}
                      {areasForImprovement.length > 0 && (
                        <div className="py-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            Recommendations
                          </h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                            {areasForImprovement.map((item, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skill Gaps */}
                      {skillGaps.length > 0 && (
                        <div className="py-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            Skill Gaps
                          </h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                            {skillGaps.map((item, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* ATS Tips */}
                      {atsTips.length > 0 && (
                        <div className="py-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            ATS Tips
                          </h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                            {atsTips.map((item, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Job Matches */}
                      {jobMatches.length > 0 && (
                        <div className="py-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            Suitable Job Roles
                          </h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                            {jobMatches.map((item, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Professional Development */}
                      {professionalDevelopment.length > 0 && (
                        <div className="py-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                            Professional Development
                          </h3>
                          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 mt-2">
                            {professionalDevelopment.map((item, index) => (
                              <li key={index} className="text-gray-700 text-sm">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fallback if no sections have content */}
                      {areasForImprovement.length === 0 &&
                        skillGaps.length === 0 &&
                        atsTips.length === 0 &&
                        jobMatches.length === 0 &&
                        professionalDevelopment.length === 0 && (
                          <p className="text-gray-700 text-center py-4 font-medium">
                            No detailed analysis available.
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Internal Jobs Section */}
                {internalJobs.length > 0 && (
                  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        Direct{" "}
                        <span className="text-blue-700">Job Applications</span>
                      </h2>
                      <p className="text-gray-600 mb-8">
                        These are jobs where you can apply directly through our
                        platform. Your resume has been matched with these
                        positions based on your skills and experience.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {internalJobs.map((job, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-white p-1">
                                <img
                                  src={
                                    getFileUrl(job.companyLogo) ||
                                    "https://via.placeholder.com/48?text=No+Logo"
                                  }
                                  alt={`${job.companyName} logo`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/48?text=No+Logo";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                                  {job.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                  {job.companyName} - {job.location}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                  {job.employmentType}
                                </p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {job.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {job.experience} years
                                </span>
                                <span className="text-sm text-gray-500">
                                  ${job.salary}
                                </span>
                              </div>
                              <Link
                                to={`/details/${job._id}`}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Apply Now →
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* External Jobs Section */}
                {jobPostings.length > 0 && (
                  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        External{" "}
                        <span className="text-blue-700">Job Opportunities</span>
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Here are some additional job opportunities from external
                        sources that match your profile. Click on the links to
                        apply directly on their websites.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobPostings.map((job, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {job.employer_logo && (
                                <img
                                  src={job.employer_logo}
                                  alt={`${job.employer_name} logo`}
                                  className="w-12 h-12 object-contain rounded-md bg-white p-1"
                                />
                              )}
                              <div className="flex-1">
                                <div className="mb-2">
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {job.category}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                                  {job.job_title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                  {job.employer_name} - {job.job_city},{" "}
                                  {job.job_state}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                  Posted by {job.job_publisher}
                                </p>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm text-gray-700 line-clamp-3">
                                {job.job_description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {job.job_employment_type}
                                </span>
                                {job.employer_website && (
                                  <a
                                    href={job.employer_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    Company Website
                                  </a>
                                )}
                              </div>
                              {job.job_apply_link && (
                                <a
                                  href={job.job_apply_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  Apply Now →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* YouTube Courses Section - Show Second for Strong Resumes */}
                {analysisResult.success && analysisData && (
                  <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200 relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        Recommended{" "}
                        <span className="text-blue-700">
                          Learning Resources
                        </span>
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Keep your skills sharp with these recommended courses to
                        stay ahead in your career.
                      </p>

                      {loadingCourses ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
                          <p className="mt-4 text-gray-600">
                            Loading recommended resources...
                          </p>
                        </div>
                      ) : youtubeCourses.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {youtubeCourses.map((course, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                              >
                                <div className="aspect-video mb-4 bg-gray-200 rounded-lg overflow-hidden">
                                  <img
                                    src={course.thumbnails[0].url}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="mb-2">
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {course.category}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {course.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">
                                    {course.channel_name}
                                  </span>
                                  <a
                                    href={`https://www.youtube.com/watch?v=${course.video_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    Watch Video →
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>

                          {hasMore && (
                            <div className="mt-8 text-center">
                              <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loadingMore ? (
                                  <span className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Loading...
                                  </span>
                                ) : (
                                  "Load More Videos"
                                )}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-600">
                          No recommended learning resources available at the
                          moment.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl mb-10 border border-blue-200">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={handleSaveResume}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105 flex-1 sm:flex-none"
                    >
                      Save Resume Permanently
                    </button>
                    <button
                      onClick={handleDiscardResume}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105 flex-1 sm:flex-none"
                    >
                      Discard Resume
                    </button>
                    <button
                      onClick={handleStartAgain}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105 flex-1 sm:flex-none"
                    >
                      Start New Analysis
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl text-center text-red-600 font-semibold border border-red-200">
                Error displaying analysis results:{" "}
                {analysisResult.message || "An unknown error occurred."}
                <button
                  onClick={handleStartAgain}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105"
                >
                  Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
