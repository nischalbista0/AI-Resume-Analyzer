import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineUnlock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineWarning,
  AiOutlineClose,
} from "react-icons/ai";
import { TbLoader2 } from "react-icons/tb";
import { deleteAccount } from "../actions/UserActions";
import { Checkbox } from "@mantine/core";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const DeleteAccount = () => {
  const { loading, isLogin, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [eyeTog, setEyeTog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    if (!confirm) {
      toast.error("Please confirm that you want to delete your account");
      return;
    }

    setShowModal(true);
  };

  const deleteHandler = () => {
    const data = {
      password,
    };

    dispatch(deleteAccount(data));
    setPassword("");
    setShowModal(false);
  };

  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, [isLogin]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <MetaData title="Delete Account" />
      <div className="flex p-8 items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-red-100">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AiOutlineWarning className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900">
            Delete Account
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Before you proceed, please note:
            </h3>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>All your profile data will be permanently deleted</li>
              <li>Your job applications will be removed</li>
              <li>Your resume and analysis results will be deleted</li>
              <li>This action cannot be reversed</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your password to confirm:
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUnlock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  type={eyeTog ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setEyeTog(!eyeTog)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition duration-150"
                  >
                    {eyeTog ? (
                      <AiOutlineEye className="h-5 w-5" />
                    ) : (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <Checkbox
                  className="cursor-pointer"
                  onClick={() => setConfirm(!confirm)}
                  checked={confirm}
                />
              </div>
              <label className="text-sm text-gray-700">
                I understand that this action is permanent and cannot be undone.
                I confirm that I want to delete my account and all associated
                data.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !confirm}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin mr-2" size={20} />
                    Deleting Account...
                  </>
                ) : (
                  "Delete My Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>

            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AiOutlineWarning className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-center mb-2">
              Confirm Account Deletion
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteHandler}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin mr-2" size={20} />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
