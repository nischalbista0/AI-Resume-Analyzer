import React, { useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { getSavedJobs } from "../actions/JobActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { SaveJobCard } from "../components/SaveJobCard";
import { Link } from "react-router-dom";
import { MdBookmarkBorder } from "react-icons/md";

export const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, saveJobLoading, loading } = useSelector(
    (state) => state.job
  );

  useEffect(() => {
    dispatch(getSavedJobs());
  }, [saveJobLoading]);

  return (
    <>
      <MetaData title="Saved Jobs" />
      <div className="bg-gray-100 min-h-screen pt-14 md:px-20 px-3">
        {loading ? (
          <Loader />
        ) : (
          <div className="pt-8 md:px-28 px-4 pb-32">
            {savedJobs.length !== 0 ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MdBookmarkBorder className="text-blue-500 text-2xl" />
                  </div>
                  <h1 className="text-3xl font-semibold text-gray-800">
                    Saved Jobs
                  </h1>
                </div>
                <div className="flex flex-col gap-4">
                  {savedJobs
                    .slice()
                    .reverse()
                    .map((job, i) => (
                      <SaveJobCard key={i} job={job} />
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
                      alt="No saved jobs"
                    />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    No Saved Jobs
                  </h2>
                  <p className="text-gray-600 mb-6">
                    You haven't saved any jobs yet. Start exploring and save
                    jobs that interest you!
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
        )}
      </div>
    </>
  );
};
