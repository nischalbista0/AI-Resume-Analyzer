import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobsAdmin, deleteJobData } from "../actions/AdminActions";
import { Loader } from "../components/Loader";
import { RxCross1 } from "react-icons/rx";
import { FaBriefcase } from "react-icons/fa";
import DeleteModal from "../components/DeleteModal";

export const ViewAllJobAdmin = () => {
  const dispatch = useDispatch();
  const { loading, allJobs } = useSelector((state) => state.admin);
  const [sideTog, setSideTog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllJobsAdmin());
  }, []);

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

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      dispatch(deleteJobData(jobToDelete._id));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  return (
    <>
      <MetaData title="All Jobs" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <Loader />
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBriefcase className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      All Jobs
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Manage and monitor all job postings
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-gray-50 text-gray-600">
                      <tr>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Job ID
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Job Title
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Posted On
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allJobs &&
                        allJobs
                          .filter((job) => job._id)
                          .sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            return dateB - dateA;
                          })
                          .map((job, i) => (
                            <tr
                              key={job._id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {job._id}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {job.title}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {job.companyName}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {job.location}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {convertDateFormat(job.createdAt.substr(0, 10))}
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  onClick={() => handleDeleteClick(job)}
                                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                  title="Delete Job"
                                >
                                  <AiOutlineDelete size={20} />
                                </button>
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setJobToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Job"
        message={`Are you sure you want to delete the job "${jobToDelete?.title}"? This action cannot be undone.`}
      />
    </>
  );
};
