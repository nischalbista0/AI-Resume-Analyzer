import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { Link } from "react-router-dom";
import { MdWorkOutline, MdPerson } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";
import { TbLoader2 } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import {
  updateApplicationStatus,
  getCompanyApplications,
} from "../actions/ApplicationActions";

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

export const CompanyApplications = () => {
  const dispatch = useDispatch();
  const { appliedJobs, loading } = useSelector((state) => state.application);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(getCompanyApplications());
  }, [dispatch]);

  const handleStatusUpdate = (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    dispatch(updateApplicationStatus(applicationId, newStatus))
      .then(() => {
        toast.success(`Application ${newStatus} successfully`);
      })
      .catch((error) => {
        toast.error(error || "Failed to update application status");
      })
      .finally(() => {
        setUpdatingId(null);
      });
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

  const convertDateFormat = (inputDate) => {
    const parts = inputDate.split("-");
    if (parts.length !== 3) {
      return "Invalid date format";
    }
    const day = parts[2];
    const month = parts[1];
    const year = parts[0];
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <MetaData title="Company Applications" />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <div>
              {appliedJobs && appliedJobs.length > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MdWorkOutline className="text-blue-500 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                      Applications Received
                    </h1>
                  </div>

                  <div className="grid gap-6">
                    {appliedJobs.map((application) => (
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
                                    src={getFileUrl(
                                      application.job.companyLogo
                                    )}
                                    alt={application.job.companyName}
                                    className="w-full h-full object-contain p-2"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src =
                                        "https://via.placeholder.com/64?text=No+Logo";
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
                                <BsBriefcase className="text-blue-500" />
                                <span className="text-sm">
                                  {application.job.experience}
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
                                Applied on{" "}
                                {convertDateFormat(
                                  application.createdAt.substr(0, 10)
                                )}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              {application.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(
                                        application._id,
                                        "accepted"
                                      )
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
                                      handleStatusUpdate(
                                        application._id,
                                        "rejected"
                                      )
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
                </>
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
                      No Applications Yet
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                      You haven't received any applications yet. Keep posting
                      jobs to attract potential candidates!
                    </p>
                    <div className="text-center">
                      <Link
                        to="/company/post-job"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
                      >
                        Post a Job
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
