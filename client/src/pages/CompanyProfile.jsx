import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { FaBuilding, FaSave } from "react-icons/fa";
import { BsGlobe, BsTelephone, BsGeoAlt } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";

const getFileUrl = (filePath) => {
  if (!filePath) return null;
  const normalizedPath = filePath
    .replace(/^.*[\\\/]uploads[\\\/]/, "uploads/")
    .replace(/\\/g, "/");
  return `http://localhost:3000/${normalizedPath}`;
};

export const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] =
    useDisclosure(false);
  const [
    imageConfirmOpened,
    { open: openImageConfirm, close: closeImageConfirm },
  ] = useDisclosure(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  // State for company information
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const verifyAndLoadCompany = async () => {
      const companyToken = localStorage.getItem("companyToken");

      if (!companyToken) {
        toast.error("Please login to access company profile");
        navigate("/company/login");
        return;
      }

      try {
        setLoading(true);
        // Set the authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${companyToken}`;

        const { data } = await axios.get(
          "http://localhost:3000/api/v1/company/me"
        );

        if (data.success) {
          setCompany(data.company);
          setName(data.company.name || "");
          setEmail(data.company.email || "");
          setPhone(data.company.phone || "");
          setWebsite(data.company.website || "");
          setLocation(data.company.location || "");
          setDescription(data.company.description || "");
        } else {
          throw new Error("Failed to load company data");
        }
      } catch (error) {
        console.error("Error loading company:", error);
        setError(
          error.response?.data?.message || "Failed to load company data"
        );

        // If token is invalid or expired
        if (
          error.response?.status === 401 ||
          error.response?.data?.message?.includes("jwt") ||
          error.response?.data?.message?.includes("token")
        ) {
          localStorage.removeItem("companyToken");
          delete axios.defaults.headers.common["Authorization"];
          toast.error("Session expired. Please login again.");
          window.location.href = "/company/login";
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoadCompany();
  }, []); // Remove navigate from dependencies to prevent unnecessary re-renders

  const handleSave = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
        },
      };

      const updatedData = {
        name,
        email,
        phone,
        website,
        location,
        description,
      };

      const { data } = await axios.put(
        "http://localhost:3000/api/v1/company/update",
        updatedData,
        config
      );

      if (data.success) {
        setCompany(data.company);
        toast.success("Profile updated successfully!");
        closeConfirm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      if (error.response?.status === 401) {
        localStorage.removeItem("companyToken");
        navigate("/company/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    openConfirm();
  };

  const handleDiscard = () => {
    // Reset state to current company data
    setName(company?.name || "");
    setEmail(company?.email || "");
    setPhone(company?.phone || "");
    setWebsite(company?.website || "");
    setLocation(company?.location || "");
    setDescription(company?.description || "");
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

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("logo", selectedFile);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:3000/api/v1/company/update/logo",
        formData,
        config
      );

      if (data.success) {
        setCompany(data.company);
        toast.success("Logo updated successfully!");
        closeImageConfirm();
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update logo");
    } finally {
      setLoading(false);
    }
  };

  // Determine if any changes have been made
  const hasChanges =
    name !== (company?.name || "") ||
    email !== (company?.email || "") ||
    phone !== (company?.phone || "") ||
    website !== (company?.website || "") ||
    location !== (company?.location || "") ||
    description !== (company?.description || "");

  if (loading && !company) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="Company Profile" />
      <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Company Profile
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
              {company?.logo ? (
                <img
                  src={getFileUrl(company?.logo)}
                  className="w-full max-w-[250px] rounded-md object-fill mb-4 aspect-square"
                  alt="Company Logo"
                />
              ) : (
                <FaBuilding className="w-full max-w-[250px] h-auto text-gray-300 mb-4" />
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
                Upload Logo
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                Company Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posted Jobs</span>
                  <span className="font-semibold">
                    {company?.postedJobs?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Applications</span>
                  <span className="font-semibold">
                    {company?.applications?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-semibold">
                    {company?.postedJobs?.filter(
                      (job) => job.status === "active"
                    )?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
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
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Description
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">
                Company Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Link
                  to="/company/post-job"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Post New Job
                </Link>
                <Link
                  to="/company/jobs"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  View Posted Jobs
                </Link>
                <Link
                  to="/company/applications"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
                >
                  View Applications
                </Link>
                <Link
                  to="/company/delete"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete Company Account
                </Link>
              </div>
            </div>
          </div>
        </div>

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
              Save Company Profile Changes
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to save these changes to your company
              profile?
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
          title="Confirm Logo Upload"
          centered
          size="md"
        >
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaBuilding className="text-blue-500 text-2xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
              Update Company Logo
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Are you sure you want to update your company logo?
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
                Update Logo
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
