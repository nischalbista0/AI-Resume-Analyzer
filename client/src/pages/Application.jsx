import React, { useState, useEffect } from "react";
import { TbLoader2 } from "react-icons/tb";
import { Loader } from "../components/Loader";
import { useParams } from "react-router";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getSingleJob } from "../actions/JobActions";
import { createApplication } from "../actions/ApplicationActions";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import {
  BsBuilding,
  BsGeoAlt,
  BsPersonWorkspace,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `http://localhost:3000/${filePath
    .replace("public\\", "")
    .replace(/\\/g, "/")}`;
};

export const Application = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { jobDetails, loading: jobLoading } = useSelector((state) => state.job);
  const { me } = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.application);
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    dispatch(getSingleJob(id));
  }, [dispatch, id]);

  const makeApplication = (e) => {
    e.preventDefault();

    if (!me.resume) {
      toast.error("Please upload your resume before applying");
      return;
    }

    if (!confirm) {
      toast.error("Please confirm the application details");
      return;
    }

    dispatch(createApplication(id))
      .then(() => {
        toast.success("Application submitted successfully!");
        navigate(`/details/${id}`);
      })
      .catch((error) => {
        toast.error(error || "Failed to submit application");
      });
  };

  if (jobLoading) {
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
      <MetaData title="Job Application" />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Apply to {jobDetails.companyName}
            </h1>
            <p className="text-gray-600">Job ID: {id}</p>
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
                      {jobDetails.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsGeoAlt className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900 font-medium">
                      {jobDetails.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsPersonWorkspace className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-900 font-medium">
                      {jobDetails.experience}
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
                    <p className="text-gray-900 font-medium">{me.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BsFileEarmarkText className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{me.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HiOutlineDocumentText className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    {me.resume ? (
                      <a
                        href={getFileUrl(me.resume)}
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
                    ) : (
                      <span className="text-red-500">No resume uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="confirm"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="confirm" className="text-gray-600 text-sm">
                I confirm that all the information provided in this application
                is accurate and complete to the best of my knowledge. I
                understand that any false statements or omissions may result in
                disqualification from consideration or termination of
                application.
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate(`/details/${id}`)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={makeApplication}
                disabled={!confirm || loading}
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  confirm && !loading
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
