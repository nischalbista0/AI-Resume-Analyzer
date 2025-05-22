import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { getAllUsersAdmin, deleteUser } from "../actions/AdminActions";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import DeleteModal from "../components/DeleteModal";

export const ViewAllUsersAdmin = () => {
  const dispatch = useDispatch();
  const { loading, allUsers } = useSelector((state) => state.admin);
  const [sideTog, setSideTog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllUsersAdmin());
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete._id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
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

  return (
    <>
      <MetaData title="All Users" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <Loader />
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaUsers className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      All Users
                    </h1>
                    <p className="mt-1 text-sm text-gray-600">
                      Manage and monitor all user accounts
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
                          User ID
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-4 font-medium">
                          Role
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
                      {allUsers &&
                        allUsers
                          .filter((user) => user._id)
                          .sort((a, b) => {
                            const dateA = new Date(a.createdAt);
                            const dateB = new Date(b.createdAt);
                            return dateB - dateA;
                          })
                          .map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {user._id}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {user.name}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {user.role}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {convertDateFormat(
                                  user.createdAt.substr(0, 10)
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <Link
                                    to={`/admin/user/role/${user._id}`}
                                    className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                                    title="Edit Role"
                                  >
                                    <MdOutlineModeEditOutline size={20} />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteClick(user)}
                                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                    title="Delete User"
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
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};
