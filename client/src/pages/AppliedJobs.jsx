import React, { useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { getAppliedJob } from "../actions/ApplicationActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { AppliedJobCard } from "../components/AppliedJobCard";
import { Link } from "react-router-dom";
import { MdWorkOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

export const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { appliedJobs, loading } = useSelector((state) => state.application);

  useEffect(() => {
    dispatch(getAppliedJob());
  }, [dispatch]);

  return (
    <>
      <MetaData title="Applied Jobs" />
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
                      Applied Jobs
                    </h1>
                  </div>
                  <div className="grid gap-6">
                    {appliedJobs
                      .slice()
                      .reverse()
                      .map((application) => (
                        <AppliedJobCard
                          key={application._id}
                          id={application._id}
                          job={application.job}
                          time={application.createdAt}
                          status={application.status}
                        />
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
                        alt="No applied jobs"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                      No Applied Jobs
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                      You haven't applied to any jobs yet. Start exploring and
                      apply to jobs that interest you!
                    </p>
                    <div className="text-center">
                      <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
                      >
                        Browse Jobs
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
