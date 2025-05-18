import React, { useState, useEffect, useRef } from "react";
// import { Sidebar } from "../components/Sidebar"; // Remove Sidebar import
import { Link, useNavigate } from "react-router-dom";
import { MdEditDocument, MdOutlineInsertDriveFile } from "react-icons/md"; // Icons for View/Edit resume
import { IoCheckmarkCircle } from "react-icons/io5"; // Icon for applied jobs checkmark
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../components/Loader";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import toast from "react-hot-toast";
import { updateResume } from "../actions/UserActions"; // Add this import

// Use hardcoded API URL as requested
const API_URL = "http://localhost:3000/api/v1";

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  // Remove any absolute path and normalize slashes
  const normalizedPath = filePath
    .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/") // Keep only the part after 'uploads/'
    .replace(/\\/g, "/"); // Replace backslashes with forward slashes
  return `http://localhost:3000/${normalizedPath}`;
};

const getCleanFileName = (filePath) => {
  if (!filePath) return null;
  // Get just the filename without any modifications
  return filePath.split(/[\\\/]/).pop(); // Get last part of path
};

export const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, me, error } = useSelector((state) => state.user);
  const [userResume, setUserResume] = useState(null);
  const [viewOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (me?.resume) {
      setUserResume(me.resume);
    }
  }, [me]);

  const handleViewResume = () => {
    if (!userResume) {
      toast.error("No resume found. Please upload a resume first.");
      return;
    }
    openView();
  };

  const handleEditResume = () => {
    if (!userResume) {
      toast.error("No resume found. Please upload a resume first.");
      return;
    }
    openEdit();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));
    if (!allowedTypes.includes(fileExtension)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleResumeUpdate = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      await dispatch(updateResume(formData));
      toast.success("Resume updated successfully!");
      closeEdit();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error(err.message || "Failed to update resume");
    } finally {
      setUploadLoading(false);
    }
  };

  // Placeholder data - replace with actual data fetching later
  const recentActivity = [
    {
      id: 1,
      role: "IT Support Officer",
      company: "Wentworth Institute",
      status: "Applied/Pending",
      time: "2 hours ago",
    },
    {
      id: 2,
      role: "Cyber Security Analyst",
      company: "Wentworth Institute",
      status: "Applied/Pending",
      time: "5 hours ago",
    },
  ];

  const otherRoles = [
    {
      id: 1,
      role: "IT Support",
      company: "Wentworth Institute",
      location: "Surry Hills, NSW",
    },
    {
      id: 2,
      role: "Cyber Security Analyst",
      company: "Wentworth Institute",
      location: "Surry Hills, NSW",
    },
    {
      id: 3,
      role: "Data Analyst",
      company: "Wentworth Institute",
      location: "Surry Hills, NSW",
    },
  ];

  const topSkills = [
    { id: 1, skill: "Python", percentage: 75 },
    { id: 2, skill: "JavaScript", percentage: 66 },
    { id: 3, skill: "React", percentage: 50 },
  ];

  if (loading && !me) {
    return <Loader />;
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* <Sidebar /> */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {me?.name?.split(" ")[0] || "User"}! Here's your
            overview.
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Resume Card */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">My Resume</h3>
              {userResume && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Resume Uploaded
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                    <MdOutlineInsertDriveFile
                      size={32}
                      className="text-blue-600"
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  {userResume ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Current Resume
                      </p>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {getCleanFileName(userResume)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No resume uploaded yet
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleViewResume}
                  disabled={loading || !userResume}
                  className={`flex-1 flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] ${
                    (loading || !userResume) && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <MdOutlineInsertDriveFile size={20} className="mr-2" />
                  View Resume
                </button>
                <button
                  onClick={handleEditResume}
                  disabled={loading || !userResume}
                  className={`flex-1 flex items-center justify-center px-4 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 transform hover:scale-[1.02] ${
                    (loading || !userResume) && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <MdEditDocument size={20} className="mr-2" />
                  Update Resume
                </button>
              </div>
              {!loading && !userResume && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                  <p className="text-sm text-yellow-700">
                    Upload your resume to apply for jobs and track your
                    applications.
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Applied Today Card */}
          <div className="bg-white max-w-[300px] p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Applied Today
              </h3>
              <p className="text-4xl font-bold text-gray-900">0</p>
            </div>
            <IoCheckmarkCircle size={40} className="text-green-500" />
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center">
                    {/* Placeholder for Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.company}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{activity.status}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills in Demand */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Top Skills in Demand
            </h3>
            <div className="space-y-4">
              {topSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{skill.skill}</span>
                    <span>{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Looking for other Roles? (Full width below others on smaller screens) */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Looking for other Roles?
            </h3>
            <Link to="#" className="text-sm text-blue-600 hover:underline">
              See more
            </Link>
          </div>
          <div className="space-y-4">
            {otherRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center">
                  {/* Placeholder for Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-4"></div>
                  <div>
                    <p className="font-medium text-gray-800">{role.role}</p>
                    <p className="text-sm text-gray-500">{role.company}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{role.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Resume Modal */}
      <Modal
        opened={viewOpened}
        onClose={closeView}
        title="View Resume"
        size="lg"
      >
        <div className="p-4">
          {userResume ? (
            <iframe
              src={getFileUrl(userResume)}
              className="w-full h-[600px]"
              title="Resume"
            />
          ) : (
            <p className="text-center text-gray-600">No resume available</p>
          )}
        </div>
      </Modal>

      {/* Edit Resume Modal */}
      <Modal
        opened={editOpened}
        onClose={closeEdit}
        title="Edit Resume"
        size="lg"
      >
        <div className="p-4">
          {userResume ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Current Resume:</p>
                <a
                  href={getFileUrl(userResume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Current Resume
                </a>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">Upload New Resume</p>
                <div className="flex flex-col items-center gap-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resumeUpload"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="resumeUpload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-300"
                  >
                    <MdOutlineInsertDriveFile className="mr-2" size={20} />
                    Choose File
                  </label>
                  {selectedFile && (
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-600">
                        Selected file: {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    closeEdit();
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResumeUpdate}
                  disabled={!selectedFile || uploadLoading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 ${
                    (!selectedFile || uploadLoading) &&
                    "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {uploadLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    "Update Resume"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No resume available</p>
          )}
        </div>
      </Modal>
    </div>
  );
};
