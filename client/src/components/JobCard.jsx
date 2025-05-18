import React from "react";
import { Link } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";

export const JobCard = ({ job }) => {
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
    <Link
      to={`/details/${job._id}`}
      className="bg-white hover:shadow-md transition-shadow duration-300 flex flex-col gap-2 border border-gray-200 md:px-4 px-3 w-full py-3 rounded-lg"
    >
      <div className="flex gap-5 relative">
        <div className="flex justify-center items-center">
          <img src={job.companyLogo.url} className="w-[4rem]" alt="" />
        </div>
        <div className="flex flex-col">
          <div>
            <p className="md:text-xl text-lg font-medium text-gray-800">
              {job.title}
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-600">{job.companyName}</p>
              <p className="text-sm text-gray-600">{job.exp}</p>
              {!isMobile && (
                <p className="text-sm text-gray-600">
                  {job.description.slice(0, 64)}...
                </p>
              )}
              <p className="text-sm text-gray-600 flex md:hidden">
                {job.description.slice(0, 39)}...
              </p>
            </div>
            <div className="absolute md:right-3 right-0 md:pt-0 top-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-300 md:text-sm text-xs px-4 py-1.5 rounded-md">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:gap-8 gap-3 md:text-sm text-xs text-gray-500">
        <span>{convertDateFormat(job.createdAt.substr(0, 10))}</span>
        <span>{job.employmentType}</span>
        <span>{job.location}</span>
      </div>
    </Link>
  );
};
