import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { MdEditDocument, MdOutlineInsertDriveFile } from "react-icons/md";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile } from "../actions/UserActions"; // Assuming updateProfile action exists
import { updateProfileImage } from "../actions/UserActions"; // Add this import

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  // Remove any absolute path and normalize slashes
  const normalizedPath = filePath
    .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/") // Keep only the part after 'uploads/'
    .replace(/\\/g, "/"); // Replace backslashes with forward slashes
  return `http://localhost:3000/${normalizedPath}`;
};

export const MyProfile = () => {
  const { loading, me, isLogin, error } = useSelector((state) => state.user);
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [
    imageConfirmOpened,
    { open: openImageConfirm, close: closeImageConfirm },
  ] = useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  // State for profile information
  const [firstName, setFirstName] = useState(me?.name?.split(" ")[0] || "");
  const [lastName, setLastName] = useState(me?.name?.split(" ")[1] || "");
  const [username, setUsername] = useState(me?.username || "");
  const [nickname, setNickname] = useState(me?.nickname || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    me?.dateOfBirth ? new Date(me.dateOfBirth).toISOString().split("T")[0] : ""
  );
  const [nationality, setNationality] = useState(me?.nationality || "");
  const [bio, setBio] = useState(me?.bio || "");

  // State for contact information
  const [phone, setPhone] = useState(me?.phone || "");
  const [address, setAddress] = useState(me?.address || "");
  const [email, setEmail] = useState(me?.email || "");

  useEffect(() => {
    // Update state when user data (me) changes
    setFirstName(me?.name?.split(" ")[0] || "");
    setLastName(me?.name?.split(" ")[1] || "");
    setUsername(me?.username || "");
    setNickname(me?.nickname || "");
    setDateOfBirth(
      me?.dateOfBirth
        ? new Date(me.dateOfBirth).toISOString().split("T")[0]
        : ""
    );
    setNationality(me?.nationality || "");
    setBio(me?.bio || "");
    setPhone(me?.phone || "");
    setAddress(me?.address || "");
    setEmail(me?.email || "");
  }, [me]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSave = async () => {
    const updatedData = {
      name: `${firstName} ${lastName}`.trim(),
      username,
      nickname,
      dateOfBirth,
      nationality,
      bio,
      phone,
      address,
      email,
    };

    try {
      await dispatch(updateProfile(updatedData));
      toast.success("Profile updated successfully!");
      closeConfirm();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleSaveClick = () => {
    openConfirm();
  };

  const handleDiscard = () => {
    // Reset state to current user data
    setFirstName(me?.name?.split(" ")[0] || "");
    setLastName(me?.name?.split(" ")[1] || "");
    setUsername(me?.username || "");
    setNickname(me?.nickname || "");
    setDateOfBirth(
      me?.dateOfBirth
        ? new Date(me.dateOfBirth).toISOString().split("T")[0]
        : ""
    );
    setNationality(me?.nationality || "");
    setBio(me?.bio || "");
    setPhone(me?.phone || "");
    setAddress(me?.address || "");
    setEmail(me?.email || "");
    toast("Changes discarded.", { icon: "👋" });
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    openImageConfirm();
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      await dispatch(updateProfileImage(formData));
      toast.success("Profile image updated successfully!");
      closeImageConfirm();
      setSelectedFile(null);
    } catch (err) {
      toast.error(err.message || "Failed to update profile image");
    }
  };

  // Determine if any changes have been made
  const hasChanges =
    firstName !== (me?.name?.split(" ")[0] || "") ||
    lastName !== (me?.name?.split(" ")[1] || "") ||
    username !== (me?.username || "") ||
    nickname !== (me?.nickname || "") ||
    dateOfBirth !==
      (me?.dateOfBirth
        ? new Date(me.dateOfBirth).toISOString().split("T")[0]
        : "") ||
    nationality !== (me?.nationality || "") ||
    bio !== (me?.bio || "") ||
    phone !== (me?.phone || "") ||
    address !== (me?.address || "") ||
    email !== (me?.email || "");

  return (
    <>
      <MetaData title="My Profile" />
      {loading && !me ? ( // Show initial loader if me data is not yet loaded
        <Loader />
      ) : (
        <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              User Profile
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={handleSaveClick}
                disabled={loading || !hasChanges}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={handleDiscard}
                disabled={loading || !hasChanges}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Discard
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
                {me?.avatar ? (
                  <img
                    src={getFileUrl(me?.avatar)}
                    className="w-full max-w-[250px] rounded-md object-cover mb-4 aspect-square"
                    alt="Profile"
                  />
                ) : (
                  <FaUserCircle className="w-full max-w-[250px] h-auto text-gray-300 mb-4" />
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Upload image
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                  Manage Passwords
                </h3>
                <div className="space-y-4">
                  {/* Current and New Password fields remain disabled as password change is via a separate page */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="**********"
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="**********"
                      disabled
                    />
                  </div>
                  <Link
                    to="/changePassword"
                    className="block text-center mt-4 text-blue-600 hover:underline text-sm"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nickname"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nickname
                    </label>
                    <input
                      type="text"
                      id="nickname"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nationality
                    </label>
                    <input
                      type="text"
                      id="nationality"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                  Profile Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <Link
                    to="/applied"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/saved"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    Saved Jobs
                  </Link>
                  <button
                    onClick={open}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                  >
                    View My Resume
                  </button>
                  <Link
                    to="/deleteAccount"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Delete Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Modal opened={opened} onClose={close} title="Resume" size="lg">
            <div>
              {me?.resume ? (
                <iframe
                  src={getFileUrl(me.resume)}
                  className="w-full h-[600px]"
                  title="Resume"
                />
              ) : (
                <p>No resume uploaded</p>
              )}
            </div>
          </Modal>

          <Modal
            opened={confirmOpened}
            onClose={closeConfirm}
            title="Confirm Changes"
            centered
            size="md"
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaSave className="text-blue-500 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Save Profile Changes
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to save these changes to your profile?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={closeConfirm}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            opened={imageConfirmOpened}
            onClose={closeImageConfirm}
            title="Confirm Image Upload"
            centered
            size="md"
          >
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaUserCircle className="text-blue-500 text-2xl" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Update Profile Picture
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Are you sure you want to update your profile picture?
              </p>
              {selectedFile && (
                <div className="mb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-4">
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500 ring-opacity-50"></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    closeImageConfirm();
                    setSelectedFile(null);
                  }}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpload}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
                >
                  Update Picture
                </button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};
