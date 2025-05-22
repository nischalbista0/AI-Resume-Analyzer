import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  MdOutlineWorkOutline,
  MdOutlineLocationOn,
  MdOutlineAccessTime,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlinePeople,
  MdFilterList,
} from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import axios from "axios";

export const CompanyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchJobs = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:3000/api/v1/company/jobs",
        config
      );

      setJobs(data.jobs);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
        },
      };

      await axios.delete(
        `http://localhost:3000/api/v1/company/jobs/${jobToDelete}`,
        config
      );

      toast.success("Job deleted successfully!");
      setJobs(jobs.filter((job) => job._id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

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

  const filteredJobs = jobs.filter((job) =>
    statusFilter === "all" ? true : job.status === statusFilter
  );

  const getStatusCount = (status) => {
    return jobs.filter((job) => job.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <TbLoader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <>
      <MetaData title="Posted Jobs" />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Posted Jobs
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Manage your job postings and view applications
              </p>
            </div>
            <Link
              to="/company/post-job"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post New Job
            </Link>
          </div>

          {/* Status Filter */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MdFilterList className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filter by status:
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({jobs.length})
              </button>
              <button
                onClick={() => setStatusFilter("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Active ({getStatusCount("active")})
              </button>
              <button
                onClick={() => setStatusFilter("closed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  statusFilter === "closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Closed ({getStatusCount("closed")})
              </button>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <MdOutlineWorkOutline className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No jobs posted
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by posting your first job.
              </p>
              <div className="mt-6">
                <Link
                  to="/company/post-job"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post New Job
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MdOutlineLocationOn className="mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MdOutlineAccessTime className="mr-1" />
                          {convertDateFormat(job.createdAt.substr(0, 10))}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MdOutlineWorkOutline className="mr-1" />
                          {job.employmentType}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <Link
                        to={`/company/jobs/${job._id}/applications`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <MdOutlinePeople className="mr-1" />
                        View Applications
                      </Link>
                      <div className="flex gap-2">
                        <Link
                          to={`/company/edit-job/${job._id}`}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                        >
                          <MdOutlineEdit />
                        </Link>
                        <button
                          onClick={() => confirmDelete(job._id)}
                          className="inline-flex items-center p-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <FiTrash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setJobToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
