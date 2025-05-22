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
