import React, { useState } from "react";
import { MetaData } from "../components/MetaData";
import {
  AiOutlineMail,
  AiOutlineUnlock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineClose,
} from "react-icons/ai";
import { MdBusiness, MdPhone, MdLanguage, MdLocationOn } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";

export const CompanyRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eyeTog, setEyeTog] = useState(false);
  const [confirmEyeTog, setConfirmEyeTog] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState("");

  const logoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Logo file size should be less than 10MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setLogo(file);
      setLogoName(file.name);
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    // Validate name
    if (name.trim().length < 2) {
      toast.error("Company name should be at least 2 characters long");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate phone
    if (phone && !/^\+?[\d\s-]{10,}$/.test(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Validate website
    if (website && !/^https?:\/\/.+/.test(website)) {
      toast.error("Please enter a valid website URL");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("website", website);
      formData.append("location", location);
      formData.append("description", description);

      if (logo) {
        formData.append("logo", logo);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/company/register",
        formData,
        config
      );

      if (response.data.success) {
        toast.success("Registration successful! Please login to continue.");
        navigate("/company/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Company Registration" />

      <div className="flex min-h-screen">
        {/* Left Side - Image and Welcome Text */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center text-white justify-center items-center flex-col p-8 relative h-screen sticky top-0"
          style={{
            backgroundImage: `url(/hero-bg.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-center">
              Register Your Company
            </h1>
            <p className="text-center max-w-md text-lg">
              Create your company profile and start posting jobs to find the
              best talent.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 bg-white flex flex-col items-center p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <img
              src={`/logo.png`}
              alt="Logo"
              className="w-40 h-40 object-contain mb-6 mx-auto"
            />
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-semibold">Company Registration</h2>
              <p className="text-center text-sm text-gray-600">
                Fill in your company details to get started
              </p>
            </div>

            <form onSubmit={registerHandler} className="w-full">
              {/* Company Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdBusiness className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your company name"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineMail className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your company email"
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineUnlock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    type={eyeTog ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setEyeTog(!eyeTog)}
                  >
                    {eyeTog ? (
                      <AiOutlineEyeInvisible
                        className="text-gray-400"
                        size={20}
                      />
                    ) : (
                      <AiOutlineEye className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineUnlock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    type={confirmEyeTog ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setConfirmEyeTog(!confirmEyeTog)}
                  >
                    {confirmEyeTog ? (
                      <AiOutlineEyeInvisible
                        className="text-gray-400"
                        size={20}
                      />
                    ) : (
                      <AiOutlineEye className="text-gray-400" size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdPhone className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your company phone number"
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="mb-4">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLanguage className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter your company website"
                    type="url"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLocationOn className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your company location"
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description of your company"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Logo Upload */}
              <div className="mb-6">
                <label
                  htmlFor="logo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Company Logo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1">
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={logoChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-gray-600">
                          {logoName || "Choose a logo"}
                        </span>
                      </div>
                    </div>
                  </label>
                  {logoName && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogo(null);
                        setLogoName("");
                      }}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading || !name || !email || !password || !confirmPassword
                }
                className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    <span>Registering...</span>
                  </>
                ) : (
                  "Register Company"
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Are you a job seeker?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  <FaUserCircle size={16} />
                  Switch to User Registration
                </Link>
              </div>
            </form>

            <p className="mt-6 text-sm text-gray-600">
              Already have a company account?{" "}
              <Link
                to="/company/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
