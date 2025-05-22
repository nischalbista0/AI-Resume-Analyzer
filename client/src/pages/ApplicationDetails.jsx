import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { MetaData } from "../components/MetaData";
import {
  getSingleApplication,
  deleteApplication,
} from "../actions/ApplicationActions";
import { Link } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import {
  BsBuilding,
  BsGeoAlt,
  BsPersonWorkspace,
  BsFileEarmarkText,
  BsCalendar,
  BsClock,
  BsCheckCircle,
  BsExclamationCircle,
  BsLightning,
} from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `http://localhost:3000/${filePath
    .replace("public\\", "")
    .replace(/\\/g, "/")}`;
};

export const ApplicationDetails = () => {
  const { applicationDetails, loading } = useSelector(
    (state) => state.application
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(getSingleApplication(id));
  }, [dispatch, id]);

  const deleteApplicationHandler = () => {
    setIsDeleting(true);
    dispatch(deleteApplication(id))
      .then(() => {
        toast.success("Application deleted successfully");
        navigate("/applied");
      })
      .catch((error) => {
        toast.error(error || "Failed to delete application");
        setIsDeleting(false);
      });
  };

  const toUpperFirst = (str = "") => {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
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

  const extractTime = (inputString) => {
    const dateTimeObj = new Date(inputString);
    const hours = dateTimeObj.getHours();
    const minutes = dateTimeObj.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
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
      <MetaData title="Application Details" />
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Application #{id}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      applicationDetails.status
                    )}`}
                  >
                    {toUpperFirst(applicationDetails.status)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Applied on{" "}
                    {convertDateFormat(
                      applicationDetails.createdAt.substr(0, 10)
                    )}{" "}
                    at {extractTime(applicationDetails.createdAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={deleteApplicationHandler}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    Deleting...
                  </>
                ) : (
                  "Delete Application"
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BsBuilding className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.job.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsBuilding className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.job.companyName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsGeoAlt className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.job.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsPersonWorkspace className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.job.experience}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applicant Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BsPersonWorkspace className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.applicant.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsFileEarmarkText className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">
                      {applicationDetails.applicant.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineDocumentText className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    <a
                      href={getFileUrl(applicationDetails.applicantResume.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      View Resume
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Analysis Section */}
            {applicationDetails.applicant.resumeAnalysis && (
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resume Analysis
                </h2>
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <BsLightning className="text-blue-600 text-xl" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Overall Score</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {applicationDetails.applicant.resumeAnalysis.score}%
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        applicationDetails.applicant.resumeAnalysis.score >= 70
                          ? "bg-green-100 text-green-700"
                          : applicationDetails.applicant.resumeAnalysis.score >=
                            50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {applicationDetails.applicant.resumeAnalysis.score >= 70
                        ? "Strong Match"
                        : applicationDetails.applicant.resumeAnalysis.score >=
                          50
                        ? "Moderate Match"
                        : "Needs Improvement"}
                    </div>
                  </div>

                  {/* Skill Matches */}
                  {applicationDetails.applicant.resumeAnalysis.skill_gaps && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Skill Analysis
                      </h3>
                      <div className="space-y-3">
                        {applicationDetails.applicant.resumeAnalysis.skill_gaps.map(
                          (gap, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <BsExclamationCircle className="text-yellow-500 mt-1" />
                              <p className="text-gray-700">{gap}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* ATS Tips */}
                  {applicationDetails.applicant.resumeAnalysis.ats_tips && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        ATS Optimization
                      </h3>
                      <div className="space-y-3">
                        {applicationDetails.applicant.resumeAnalysis.ats_tips.map(
                          (tip, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <BsCheckCircle className="text-green-500 mt-1" />
                              <p className="text-gray-700">{tip}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Professional Development */}
                  {applicationDetails.applicant.resumeAnalysis
                    .professional_development && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        Professional Development
                      </h3>
                      <div className="space-y-3">
                        {applicationDetails.applicant.resumeAnalysis.professional_development.map(
                          (item, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <BsCheckCircle className="text-blue-500 mt-1" />
                              <p className="text-gray-700">{item}</p>
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
    </>
  );
};
