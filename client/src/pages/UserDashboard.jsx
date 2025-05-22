import React, { useState, useEffect, useRef } from "react";
// import { Sidebar } from "../components/Sidebar"; // Remove Sidebar import
import { Link, useNavigate } from "react-router-dom";
import {
  MdEditDocument,
  MdOutlineInsertDriveFile,
  MdWorkOutline,
  MdLocationOn,
  MdAttachMoney,
  MdWork,
} from "react-icons/md"; // Icons for View/Edit resume
import { IoCheckmarkCircle } from "react-icons/io5"; // Icon for applied jobs checkmark
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import toast from "react-hot-toast";
import { updateResume } from "../actions/UserActions"; // Add this import
import { getAppliedJob } from "../actions/ApplicationActions";
import { BsBriefcase } from "react-icons/bs";
import { MetaData } from "../components/MetaData";
import { getAllJobs } from "../actions/JobActions";
import {
  FaBriefcase as FaBriefcaseIcon,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
import axios from "axios";

// Use hardcoded API URL as requested
const API_URL = "http://localhost:3000/api/v1";

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  // Remove any absolute path and normalize slashes
  const normalizedPath = filePath
    .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/") // Keep only the part after 'uploads/'
    .replace(/\\/g, "/"); // Replace backslashes with forward slashes
  return `http://localhost:3000/${normalizedPath}`;
};

const getCleanFileName = (filePath) => {
  if (!filePath) return null;
  // Get just the filename without any modifications
  return filePath.split(/[\\\/]/).pop(); // Get last part of path
};

export const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, me, error } = useSelector((state) => state.user);
  const { appliedJobs, loading: applicationsLoading } = useSelector(
    (state) => state.application
  );
  const { jobs = [], loading: jobsLoading } = useSelector(
    (state) => state.jobs || {}
  );
  const [userResume, setUserResume] = useState(null);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [youtubeCourses, setYoutubeCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [jobPostings, setJobPostings] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);
  const [currentJobPage, setCurrentJobPage] = useState(1);
  const [hasMoreJobs, setHasMoreJobs] = useState(true);
  const [internalJobs, setInternalJobs] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (me?.resume) {
      setUserResume(me.resume);
    }
  }, [me?.resume]);

  useEffect(() => {
    dispatch(getAppliedJob());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  useEffect(() => {
    if (me?.resumeAnalysis) {
      console.log("Full resume analysis data:", me.resumeAnalysis);
      const analysisData = me.resumeAnalysis;

      // Fetch both internal and external jobs in parallel
      Promise.all([
        fetchInternalJobs(analysisData.jobMatches || []),
        fetchJobPostings(analysisData.jobMatches || [], 1),
      ]).catch((error) => {
        console.error("Error fetching jobs:", error);
      });

      // Fetch YouTube courses using professionalDevelopment array
      if (analysisData.professionalDevelopment) {
        fetchYoutubeCourses(analysisData.professionalDevelopment, 1);
      } else {
        console.log("No professional development data found in:", analysisData);
      }
    }
  }, [me?.resumeAnalysis]);

  const handleViewResume = () => {
    if (!userResume) {
      toast.error("No resume found. Please upload a resume first.");
      return;
    }
    openView();
  };

  const handleEditResume = () => {
    if (!userResume) {
      toast.error("No resume found. Please upload a resume first.");
      return;
    }
    openEdit();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleResumeUpdate = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const result = await dispatch(updateResume(formData));
      if (result?.payload?.resume) {
        toast.success("Resume updated successfully!");
        closeEdit();
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Reload the page after successful upload
        window.location.reload();
      } else {
        toast.error("Failed to update resume");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update resume");
    } finally {
      setUploadLoading(false);
    }
  };

  // Get resume analysis data
  const getResumeAnalysisData = () => {
    if (!me?.resumeAnalysis) return null;
    return me.resumeAnalysis;
  };

  // Function to fetch internal jobs
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

  // Function to fetch YouTube courses
  const fetchYoutubeCourses = async (recommendations, page = 1) => {
    console.log("recommendations", recommendations);
    if (!recommendations || recommendations.length === 0) return;

    if (page === 1) {
      setLoadingCourses(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let allVideos = [];

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
            limit: page === 1 ? "8" : "8",
          },
          headers: {
            "x-rapidapi-key":
              "7318af8020msh13b0e4ec2d7b8b7p134e91jsn5ae19029597d",
            "x-rapidapi-host": "youtube-v2.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        if (response.data && response.data.videos) {
          const videosWithCategory = response.data.videos.map((video) => ({
            ...video,
            category: recommendation,
          }));
          allVideos = [...allVideos, ...videosWithCategory];
        }
      }

      const uniqueVideos = Array.from(
        new Map(allVideos.map((video) => [video.video_id, video])).values()
      );

      const sortedVideos = uniqueVideos.sort((a, b) => b.views - a.views);
      const limitedVideos =
        page === 1 ? sortedVideos.slice(0, 8) : sortedVideos;

      if (page === 1) {
        setYoutubeCourses(limitedVideos);
      } else {
        setYoutubeCourses((prev) => [...prev, ...limitedVideos]);
      }

      setHasMore(sortedVideos.length > 0);
    } catch (error) {
      console.error("Error fetching YouTube courses:", error);
      toast.error("Failed to fetch recommended courses");
    } finally {
      setLoadingCourses(false);
      setLoadingMore(false);
    }
  };

  // Function to fetch Job Postings
  const fetchJobPostings = async (jobMatches, page = 1) => {
    if (!jobMatches || jobMatches.length === 0) return;

    if (page === 1) {
      setLoadingJobs(true);
    } else {
      setLoadingMoreJobs(true);
    }

    try {
      const searchQuery = jobMatches.join(" OR ");

      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: searchQuery,
          page: page.toString(),
          num_pages: "1",
          date_posted: "all",
          limit: "20",
        },
        headers: {
          "x-rapidapi-key":
            "7318af8020msh13b0e4ec2d7b8b7p134e91jsn5ae19029597d",
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      if (response.data && response.data.data) {
        const categorizedJobs = response.data.data.map((job) => {
          const bestMatch = jobMatches.find(
            (match) =>
              job.job_title.toLowerCase().includes(match.toLowerCase()) ||
              job.job_description.toLowerCase().includes(match.toLowerCase())
          );

          return {
            ...job,
            category: bestMatch || jobMatches[0],
          };
        });

        const uniqueJobs = Array.from(
          new Map(categorizedJobs.map((job) => [job.job_id, job])).values()
        );

        const limitedJobs = page === 1 ? uniqueJobs.slice(0, 8) : uniqueJobs;

        if (page === 1) {
          setJobPostings(limitedJobs);
        } else {
          setJobPostings((prev) => [...prev, ...limitedJobs]);
        }

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

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const analysisData = me.resumeAnalysis;
    if (analysisData.professionalDevelopment) {
      fetchYoutubeCourses(analysisData.professionalDevelopment, nextPage);
    }
  };

  const handleLoadMoreJobs = () => {
    const nextPage = currentJobPage + 1;
    setCurrentJobPage(nextPage);
    fetchJobPostings(me.resumeAnalysis.jobMatches, nextPage);
  };

  if (loading || jobsLoading || !me) {
    return <Loader />;
  }

  const resumeAnalysis = getResumeAnalysisData();

  // Filter jobs to only show those that are not expired
  const activeJobs = (jobs || []).filter((job) => {
    if (!job?.expiryDate) return false;
    const expiryDate = new Date(job.expiryDate);
    const today = new Date();
    return expiryDate > today;
  });

  console.log(youtubeCourses);

  return (
    <>
      <MetaData title="User Dashboard" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUser className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {me?.name}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage your resume and profile
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Management Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MdEditDocument className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resume Management
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleViewResume}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                    >
                      View Resume
                    </button>
                    <button
                      onClick={handleEditResume}
                      className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                    >
                      Edit Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Analysis Section */}
            {resumeAnalysis && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Resume Analysis
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Last analyzed:{" "}
                        {new Date(
                          resumeAnalysis.lastAnalyzed
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Score
                      </span>
                      <div className="bg-white px-3 py-1 rounded-full shadow-sm">
                        <span className="text-lg font-bold text-blue-600">
                          {resumeAnalysis.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {/* Overall Score */}
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-lg text-white">
                      <h3 className="text-md font-medium mb-2">
                        Resume Strength
                      </h3>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${resumeAnalysis.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {resumeAnalysis.recommendations &&
                    resumeAnalysis.recommendations.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Recommendations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeAnalysis.recommendations.map(
                            (recommendation, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
                              >
                                <p className="text-sm text-gray-600">
                                  {recommendation}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Skill Gaps */}
                  {resumeAnalysis.skillGaps &&
                    resumeAnalysis.skillGaps.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          Skill Gaps
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeAnalysis.skillGaps.map((skill, index) => (
                            <div
                              key={index}
                              className="bg-orange-50 p-4 rounded-lg border border-orange-100"
                            >
                              <p className="text-sm text-orange-700">{skill}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* ATS Tips */}
                  {resumeAnalysis.atsTips &&
                    resumeAnalysis.atsTips.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          ATS Optimization Tips
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeAnalysis.atsTips.map((tip, index) => (
                            <div
                              key={index}
                              className="bg-green-50 p-4 rounded-lg border border-green-100"
                            >
                              <p className="text-sm text-green-700">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Job Matches */}
                  {resumeAnalysis.jobMatches &&
                    resumeAnalysis.jobMatches.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Recommended Job Roles
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {resumeAnalysis.jobMatches.map((job, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                            >
                              {job}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Professional Development */}
                  {resumeAnalysis.professionalDevelopment &&
                    resumeAnalysis.professionalDevelopment.length > 0 && (
                      <div>
                        <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          Professional Development Suggestions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resumeAnalysis.professionalDevelopment.map(
                            (suggestion, index) => (
                              <div
                                key={index}
                                className="bg-indigo-50 p-4 rounded-lg border border-indigo-100"
                              >
                                <p className="text-sm text-indigo-700">
                                  {suggestion}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Internal Jobs Section */}
            {internalJobs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Direct Job Applications
                  </h2>
                  <p className="text-gray-600 mb-8">
                    These are jobs where you can apply directly through our
                    platform. Your resume has been matched with these positions
                    based on your skills and experience.
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    External Job Opportunities
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Here are some additional job opportunities from external
                    sources that match your profile. Click on the links to apply
                    directly on their websites.
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

                  {hasMoreJobs && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleLoadMoreJobs}
                        disabled={loadingMoreJobs}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300 font-semibold shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMoreJobs ? (
                          <span className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Loading...
                          </span>
                        ) : (
                          "Load More Jobs"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommended Courses Section */}
            {youtubeCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Recommended Learning Resources
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
                  ) : (
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Resume Modal */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="View Resume"
        size="lg"
      >
        <div className="p-4">
          {userResume ? (
            <iframe
              src={getFileUrl(userResume)}
              className="w-full h-[600px]"
              title="Resume"
            />
          ) : (
            <p className="text-center text-gray-600">No resume available</p>
          )}
        </div>
      </Modal>

      {/* Edit Resume Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Resume"
        size="lg"
      >
        <div className="p-4">
          {userResume ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Current Resume:</p>
                <a
                  href={getFileUrl(userResume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Current Resume
                </a>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Upload New Resume</p>
                <div className="flex flex-col items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resumeUpload"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="resumeUpload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-300"
                  >
                    <MdOutlineInsertDriveFile className="mr-2" size={20} />
                    Choose File
                  </label>
                  {selectedFile && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600">
                        Selected file: {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    closeEdit();
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResumeUpdate}
                  disabled={!selectedFile || uploadLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 ${
                    (!selectedFile || uploadLoading) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {uploadLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Resume"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No resume available</p>
          )}
        </div>
      </Modal>
    </>
  );
};
