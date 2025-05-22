import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader } from "../components/Loader";
import { MetaData } from "../components/MetaData";
import { formatDate } from "../utils/formatDate";
import { MdWorkOutline, MdPerson, MdEmail, MdFilterList } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TbLoader2 } from "react-icons/tb";
import {
  BsLightning,
  BsCheckCircle,
  BsExclamationCircle,
} from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If filePath is an object with url property
  if (typeof filePath === "object" && filePath.url) {
    // Handle Windows-style backslashes and normalize the path
    const normalizedPath = filePath.url
      .replace(/^.*[\\\/]public[\\\/]/, "") // Remove everything before public/
      .replace(/\\/g, "/") // Replace backslashes with forward slashes
      .replace(/^public\//, ""); // Remove leading public/ if present
    return `http://localhost:3000/${normalizedPath}`;
  }

  // If filePath is a string
  if (typeof filePath === "string") {
    return filePath;
  }

  return null;
};

export const JobApplications = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("companyToken");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `http://localhost:3000/api/v1/company/jobs/${id}/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(data.applications);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const token = localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/v1/company/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      // Update the local state
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message || "Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredApplications = applications.filter((app) =>
    statusFilter === "all" ? true : app.status === statusFilter
  );

  const getStatusCount = (status) => {
    return applications.filter((app) => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaData title="Job Applications" />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <MdWorkOutline className="text-blue-500 text-2xl" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Job Applications
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MdFilterList className="text-xl" />
                <span className="font-medium">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    statusFilter === "all"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    statusFilter === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pending ({getStatusCount("pending")})
                </button>
                <button
                  onClick={() => setStatusFilter("accepted")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    statusFilter === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Accepted ({getStatusCount("accepted")})
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    statusFilter === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Rejected ({getStatusCount("rejected")})
                </button>
              </div>
            </div>
          </div>

          {filteredApplications && filteredApplications.length > 0 ? (
            <div className="grid gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Job Details */}
                    <div className="flex-grow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                            <img
                              src={
                                getFileUrl(application.job.companyLogo) ||
                                "https://via.placeholder.com/64?text=Company"
                              }
                              alt={application.job.companyName}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/64?text=Company";
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {application.job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <MdWorkOutline className="text-blue-500" />
                            <span className="text-sm font-medium">
                              {application.job.companyName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Applicant Details */}
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdPerson className="text-blue-500" />
                          <span className="text-sm">
                            {application.applicant.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MdEmail className="text-blue-500" />
                          <span className="text-sm">
                            {application.applicant.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <HiOutlineDocumentText className="text-blue-500" />
                          <a
                            href={getFileUrl(application.applicantResume)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Resume
                          </a>
                        </div>
                      </div>

                      {/* Resume Analysis Section */}
                      {application.applicant.resumeAnalysis && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <BsLightning className="text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">
                                Resume Score
                              </span>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                application.applicant.resumeAnalysis.score >= 70
                                  ? "bg-green-100 text-green-700"
                                  : application.applicant.resumeAnalysis
                                      .score >= 50
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {application.applicant.resumeAnalysis.score}%
                            </span>
                          </div>

                          {/* Skill Gaps */}
                          {application.applicant.resumeAnalysis.skill_gaps &&
                            application.applicant.resumeAnalysis.skill_gaps
                              .length > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <BsExclamationCircle className="text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Skill Gaps
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {application.applicant.resumeAnalysis.skill_gaps
                                    .slice(0, 2)
                                    .map((gap, index) => (
                                      <p
                                        key={index}
                                        className="text-sm text-gray-600"
                                      >
                                        • {gap}
                                      </p>
                                    ))}
                                  {application.applicant.resumeAnalysis
                                    .skill_gaps.length > 2 && (
                                    <p className="text-sm text-blue-600">
                                      +
                                      {application.applicant.resumeAnalysis
                                        .skill_gaps.length - 2}{" "}
                                      more
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* ATS Tips */}
                          {application.applicant.resumeAnalysis.ats_tips &&
                            application.applicant.resumeAnalysis.ats_tips
                              .length > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <BsCheckCircle className="text-green-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    ATS Optimization
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {application.applicant.resumeAnalysis.ats_tips
                                    .slice(0, 2)
                                    .map((tip, index) => (
                                      <p
                                        key={index}
                                        className="text-sm text-gray-600"
                                      >
                                        • {tip}
                                      </p>
                                    ))}
                                  {application.applicant.resumeAnalysis.ats_tips
                                    .length > 2 && (
                                    <p className="text-sm text-blue-600">
                                      +
                                      {application.applicant.resumeAnalysis
                                        .ats_tips.length - 2}{" "}
                                      more
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Status and Actions */}
                    <div className="flex-shrink-0 flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status.charAt(0).toUpperCase() +
                            application.status.slice(1)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Applied on {formatDate(application.createdAt)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {application.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(application._id, "accepted")
                              }
                              disabled={updatingId === application._id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === application._id ? (
                                <>
                                  <TbLoader2 className="animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Accept"
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(application._id, "rejected")
                              }
                              disabled={updatingId === application._id}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === application._id ? (
                                <>
                                  <TbLoader2 className="animate-spin" />
                                  Updating...
                                </>
                              ) : (
                                "Reject"
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
                <div className="mb-6">
                  <img
                    src="/images/jobEmpty.svg"
                    className="w-52 h-52 mx-auto"
                    alt="No applications"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                  {statusFilter === "all"
                    ? "No Applications Yet"
                    : `No ${
                        statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)
                      } Applications`}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  {statusFilter === "all"
                    ? "No applications have been received for this job posting yet."
                    : `No ${statusFilter} applications found. Try changing the filter.`}
                </p>
                <div className="text-center">
                  <Link
                    to="/company/jobs"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
                  >
                    Back to Jobs
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
