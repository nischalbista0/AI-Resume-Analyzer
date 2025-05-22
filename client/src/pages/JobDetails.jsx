import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getSingleJob, saveJob } from "../actions/JobActions";
import { BiBriefcase, BiBuildings, BiRupee } from "react-icons/bi";
import { AiOutlineSave } from "react-icons/ai";
import { HiStatusOnline } from "react-icons/hi";
import {
  BsPersonWorkspace,
  BsSend,
  BsCalendar,
  BsGeoAlt,
  BsCashStack,
} from "react-icons/bs";
import { TbLoader2 } from "react-icons/tb";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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

export const JobDetails = () => {
  const dispatch = useDispatch();
  const { jobDetails, loading, saveJobLoading } = useSelector(
    (state) => state.job
  );
  const { me, isLogin } = useSelector((state) => state.user);
  const job = jobDetails;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getSingleJob(id));
  }, [dispatch, id]);

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

  const saveJobHandler = async () => {
    try {
      await dispatch(saveJob(id));
      // Show success message
      toast.success(
        me.savedJobs && me.savedJobs.includes(id)
          ? "Job removed from saved jobs"
          : "Job saved successfully"
      );
    } catch (error) {
      toast.error(error.message || "Failed to save job");
    }
  };

  const notLoginHandler = (str) => {
    if (!isLogin) {
      toast.info(`Please login to ${str} job`);
      navigate("/login");
    }
  };

  // Check if job is saved
  const isJobSaved = me?.savedJobs?.includes(id);

  return (
    <>
      <MetaData title="Job Details" />
      <div className="min-h-screen bg-gray-50 pt-6">
        {loading ? (
          <Loader />
        ) : (
          jobDetails && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                      <img
                        src={getFileUrl(jobDetails.companyLogo)}
                        alt={jobDetails.companyName}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/96?text=No+Logo";
                        }}
                      />
                    </div>
                  </div>

                  {/* Job Title and Company Info */}
                  <div className="flex-grow">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {jobDetails.title}
                    </h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                      <BiBuildings className="text-blue-500" />
                      <span>{jobDetails.companyName}</span>
                    </div>

                    {/* Job Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <BsPersonWorkspace className="text-blue-500" />
                        <span className="capitalize">
                          {jobDetails.employmentType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BsGeoAlt className="text-blue-500" />
                        <span>{jobDetails.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <BsCashStack className="text-blue-500" />
                        <span>${jobDetails.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiStatusOnline className="text-blue-500" />
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            jobDetails.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {jobDetails.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Job Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Job Description
                    </h2>
                    <div className="prose prose-gray max-w-none">
                      {jobDetails.description
                        .split("\n")
                        .map((paragraph, index) => (
                          <p key={index} className="text-gray-600 mb-4">
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Skills Required
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Job Info & Actions */}
                <div className="space-y-6">
                  {/* Job Info Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Job Information
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <BsCalendar className="text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Posted Date</p>
                          <p className="text-gray-900">
                            {convertDateFormat(
                              jobDetails.createdAt.substr(0, 10)
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BsPersonWorkspace className="text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="text-gray-900">
                            {jobDetails.experience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BiRupee className="text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500">Salary</p>
                          <p className="text-gray-900">${jobDetails.salary}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          isLogin
                            ? me.appliedJobs &&
                              me.appliedJobs.includes(jobDetails._id)
                              ? toast.error("You have already applied!")
                              : navigate(`/Application/${jobDetails._id}`)
                            : notLoginHandler("apply");
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <BsSend />
                        {me.appliedJobs &&
                        me.appliedJobs.includes(jobDetails._id)
                          ? "Applied"
                          : "Apply Now"}
                      </button>

                      <button
                        onClick={() => {
                          if (isLogin) {
                            saveJobHandler();
                          } else {
                            notLoginHandler("save");
                          }
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        {saveJobLoading ? (
                          <span className="animate-spin">
                            <TbLoader2 size={20} />
                          </span>
                        ) : (
                          <>
                            <AiOutlineSave />
                            {isJobSaved ? "Unsave" : "Save Job"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};
