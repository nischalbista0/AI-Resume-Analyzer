import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { getAllAppAdmin, deleteApp } from "../actions/AdminActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { Link } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa";
import DeleteModal from "../components/DeleteModal";

export const ViewAllAppli = () => {
  const dispatch = useDispatch();
  const { loading, allApplications } = useSelector((state) => state.admin);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllAppAdmin());
  }, [dispatch]);

  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (applicationToDelete) {
      dispatch(deleteApp(applicationToDelete._id));
      setDeleteModalOpen(false);
      setApplicationToDelete(null);
    }
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading || !allApplications) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="All Applications" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaFileAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    All Applications
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Manage and monitor all job applications
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
                        Application ID
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Job Name
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Applicant
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Created On
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allApplications
                      .filter((app) => app._id)
                      .sort((a, b) => {
                        const dateA = new Date(a.createdAt);
                        const dateB = new Date(b.createdAt);
                        return dateB - dateA;
                      })
                      .map((application) => (
                        <tr
                          key={application._id}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {application._id}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {application.job?.title}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {application.applicant?.name}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {convertDateFormat(
                              application.createdAt.substr(0, 10)
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleDeleteClick(application)}
                                className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                title="Delete Application"
                              >
                                <AiOutlineDelete size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setApplicationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Application"
        message={`Are you sure you want to delete this application? This action cannot be undone.`}
      />
    </>
  );
};
