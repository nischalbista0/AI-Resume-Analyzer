import React, { useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getAppliedJob } from "../actions/ApplicationActions";
import { Loader } from "../components/Loader";
import { AppliedJobCard } from "../components/AppliedJobCard";
import { Link } from "react-router-dom";
import { MdWorkOutline } from "react-icons/md";

export const AppliedJobs = () => {
  const { loading, appliedJobs } = useSelector((state) => state.application);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAppliedJob());
  }, []);

  return (
    <>
      <MetaData title="Applied Jobs" />
      <div className="bg-gray-100 min-h-screen pt-14 md:px-20 px-3">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="pt-8 md:px-28 px-4 pb-32">
              {appliedJobs.length !== 0 ? (
                <>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MdWorkOutline className="text-blue-500 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                      Applied Jobs
                    </h1>
                  </div>
                  <div className="flex flex-col gap-4">
                    {appliedJobs
                      .slice()
                      .reverse()
                      .map((app, i) => (
                        <AppliedJobCard
                          key={i}
                          id={app._id}
                          time={app.createdAt}
                          job={app.job}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className="pt-10 text-center flex flex-col justify-center items-center">
                  <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
                    <div className="mb-6">
                      <img
                        src="/images/jobEmpty.svg"
                        className="w-52 h-52 mx-auto"
                        alt="No applications"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                      No Applications Yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      You haven't applied to any jobs yet. Start your job search
                      journey now!
                    </p>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
