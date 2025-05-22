import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { toast } from "react-toastify";
import { getUserData, updateUser } from "../actions/AdminActions";
import { FaUserEdit } from "react-icons/fa";

export const EditUserAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, userData } = useSelector((state) => state.admin);
  const [role, setRole] = useState("not");

  useEffect(() => {
    dispatch(getUserData(id));
  }, [dispatch, id]);

  const updateRoleHandler = () => {
    if (role === "not") {
      toast.info("Please select a role!");
      return;
    }

    dispatch(updateUser(id, { role }));
    setRole("not");
    navigate("/admin/allUsers");
  };

  if (loading || !userData) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="Edit User Role" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaUserEdit className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Edit User Role
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Update user role and permissions
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                {/* User Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1 text-gray-900">{userData.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 text-gray-900">{userData.email}</div>
                  </div>
                </div>

                {/* Current Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Role
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        userData.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {userData.role}
                    </span>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="not">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="applicant">Applicant</option>
                  </select>
                </div>

                {/* Update Button */}
                <div className="flex justify-end">
                  <button
                    onClick={updateRoleHandler}
                    disabled={loading || role === "not"}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      role === "not"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    {loading ? "Updating..." : "Update Role"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
