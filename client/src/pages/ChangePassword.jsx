import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineUnlock,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { MdOutlineVpnKey } from "react-icons/md";
import { TbLoader2 } from "react-icons/tb";
import { changePass } from "../actions/UserActions";
import toast from "react-hot-toast";

export const ChangePassword = () => {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [eyeTog1, setEyeTog1] = useState(false);
  const [eyeTog2, setEyeTog2] = useState(false);
  const [eyeTog3, setEyeTog3] = useState(false);

  const changeHandler = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password should be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const data = { oldPassword, newPassword, confirmPassword };

    try {
      await dispatch(changePass(data));
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <MetaData title="Change Password" />

      <div className="flex p-8 items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Change Password
          </h2>

          <form onSubmit={changeHandler} className="space-y-6">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Old Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineVpnKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="Enter Old Password"
                  type={eyeTog1 ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setEyeTog1(!eyeTog1)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition duration-150"
                  >
                    {eyeTog1 ? (
                      <AiOutlineEye className="h-5 w-5" />
                    ) : (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUnlock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter New Password"
                  type={eyeTog2 ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setEyeTog2(!eyeTog2)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition duration-150"
                  >
                    {eyeTog2 ? (
                      <AiOutlineEye className="h-5 w-5" />
                    ) : (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm New Password"
                  type={eyeTog3 ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setEyeTog3(!eyeTog3)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none transition duration-150"
                  >
                    {eyeTog3 ? (
                      <AiOutlineEye className="h-5 w-5" />
                    ) : (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  loading || !oldPassword || !newPassword || !confirmPassword
                }
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin mr-2" size={20} />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
