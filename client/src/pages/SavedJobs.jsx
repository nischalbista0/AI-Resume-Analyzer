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
  }, [dispatch, saveJobLoading]);

  return (
    <>
      <MetaData title="Saved Jobs" />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <div>
              {savedJobs && savedJobs.length > 0 ? (
                <>
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <MdBookmarkBorder className="text-blue-500 text-2xl" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-800">
                      Saved Jobs
                    </h1>
                  </div>
                  <div className="grid gap-6">
                    {savedJobs
                      .slice()
                      .reverse()
                      .map((job) => (
                        <SaveJobCard key={job._id} job={job} />
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
                        alt="No saved jobs"
                      />
                    </div>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                      No Saved Jobs
                    </h2>
                    <p className="text-gray-600 mb-6 text-center">
                      You haven't saved any jobs yet. Start exploring and save
                      jobs that interest you!
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
