import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../hooks/useIsMobile";
import {
  MdLocationOn,
  MdWorkOutline,
  MdAccessTime,
  MdAttachMoney,
  MdPerson,
} from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If filePath is an object with url property
  if (typeof filePath === "object" && filePath.url) {
    const normalizedPath = filePath.url
      .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")
      .replace(/\\/g, "/");
    return `http://localhost:3000/${normalizedPath}`;
  }

  // If filePath is a string
  if (typeof filePath === "string") {
    return `http://localhost:3000/${filePath
      .replace("public\\", "")
      .replace(/\\/g, "/")}`;
  }

  return null;
};

export const AppliedJobCard = ({ id, job, time, status }) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  if (!job) {
    return null;
  }

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="bg-white hover:shadow-lg transition-all duration-300 rounded-xl p-6 border border-gray-100">
      <div className="flex gap-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
            {job?.companyLogo ? (
              <img
                src={getFileUrl(job.companyLogo)}
                alt={`${job?.companyName || "Company"} logo`}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/80?text=No+Logo";
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xl font-semibold">
                  {job?.companyName?.charAt(0) || "C"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {job?.title || "Job Title Not Available"}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MdWorkOutline className="text-blue-500" />
                <span className="text-sm font-medium">
                  {job?.companyName || "Company Name Not Available"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MdLocationOn className="text-blue-500" />
                <span className="text-sm">
                  {job?.location || "Location Not Available"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MdAttachMoney className="text-blue-500" />
                <span className="text-sm">
                  ${job?.salary || "Salary Not Available"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <BsBriefcase className="text-blue-500" />
                <span className="text-sm">
                  {job?.experience || "Experience Not Available"}
                </span>
              </div>
            </div>

            {!isMobile && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {job?.description || "Description Not Available"}
              </p>
            )}
            {isMobile && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                {job?.description || "Description Not Available"}
              </p>
            )}
          </div>

          {/* Job Meta */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-blue-500" />
              <span>
                Applied on {convertDateFormat(time?.substr(0, 10) || "N/A")}
              </span>
            </div>
            <span className="text-gray-300">•</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                job?.status
              )}`}
            >
              {job?.status?.charAt(0).toUpperCase() + job?.status?.slice(1) ||
                "Pending"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex flex-col gap-3">
          <Link
            to={`/Application/Details/${id}`}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
