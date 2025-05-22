import React from "react";
import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import {
  MdLocationOn,
  MdWorkOutline,
  MdAccessTime,
  MdAttachMoney,
} from "react-icons/md";

const getFileUrl = (filePath) => {
  if (!filePath) return null;

  // If filePath is an object with url property
  if (typeof filePath === "object" && filePath.url) {
    const normalizedPath = filePath.url
      .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")
      .replace(/\\/g, "/");
    return `http://localhost:3000/${normalizedPath}`;
  }

  // If filePath is a string (direct path)
  if (typeof filePath === "string") {
    // If it's already a full URL, return it
    if (filePath.startsWith("http")) {
      return filePath;
    }
    // Otherwise, process it as a local file path
    const normalizedPath = filePath
      .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")
      .replace(/\\/g, "/");
    return `http://localhost:3000/${normalizedPath}`;
  }

  return null;
};

export const JobCard = ({ job, onClick }) => {
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

  const isMobile = useIsMobile();

  return (
    <div className="bg-white hover:shadow-xl transition-all duration-300 rounded-xl p-6 border border-gray-100 cursor-pointer group">
      <div className="flex gap-6">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-blue-100 transition-colors duration-300">
            <img
              src={getFileUrl(job.companyLogo)}
              alt={job.companyName}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=No+Logo";
              }}
            />
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-grow min-w-0">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MdWorkOutline className="text-blue-500" />
                <span className="text-sm font-medium">{job.companyName}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MdLocationOn className="text-blue-500" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MdAttachMoney className="text-blue-500" />
                <span className="text-sm">{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MdWorkOutline className="text-blue-500" />
                <span className="text-sm">{job.experience}</span>
              </div>
            </div>

            {!isMobile && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {job.description}
              </p>
            )}
            {isMobile && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                {job.description}
              </p>
            )}
          </div>

          {/* Job Meta */}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-blue-500" />
              <span>{convertDateFormat(job.createdAt.substr(0, 10))}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
              {job.employmentType}
            </span>
            <span className="text-gray-300">•</span>
            <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
              {job.category}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <div className="flex-shrink-0">
          <Link
            to={`/details/${job._id}`}
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            Apply
          </Link>
        </div>
      </div>
    </div>
  );
};
