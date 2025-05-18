import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useIsMobile from "../hooks/useIsMobile";
import { MdLocationOn, MdWorkOutline, MdAccessTime } from "react-icons/md";

export const AppliedJobCard = ({ id, job, time }) => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

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
    <div className="bg-white hover:bg-gray-50 transition duration-300 rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex gap-4 relative">
        <div className="flex-shrink-0">
          <img
            src={job.companyLogo.url}
            className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover border border-gray-200"
            alt={job.companyName}
          />
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
              {job.title}
            </h3>

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MdWorkOutline className="text-blue-500" />
              <span>{job.companyName}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MdLocationOn className="text-blue-500" />
              <span>{job.exp}</span>
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
        </div>

        <div className="flex-shrink-0 md:ml-4">
          <Link
            to={`/Application/Details/${id}`}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-300 text-sm font-medium"
          >
            View Application
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
        <MdAccessTime className="text-blue-500" />
        <span>Applied on {convertDateFormat(time.substr(0, 10))}</span>
      </div>
    </div>
  );
};
