import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { FaBuilding, FaLock, FaUserCircle } from "react-icons/fa";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import toast from "react-hot-toast";
import axios from "axios";
import { TbLoader2 } from "react-icons/tb";

export const CompanyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [eyeTog, setEyeTog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const companyToken = localStorage.getItem("companyToken");
    if (companyToken) {
      navigate("/company/profile");
    }
  }, [navigate]);

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/v1/company/login",
        { email, password },
        config
      );

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem("companyToken", data.token);

        // Set default authorization header for future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        // Verify token by making a request to get company profile
        try {
          const verifyResponse = await axios.get(
            "http://localhost:3000/api/v1/company/me"
          );

          if (verifyResponse.data.success) {
            toast.success("Login successful!");
            // Force a page reload to ensure axios defaults are properly set
            window.location.href = "/company/profile";
          } else {
            throw new Error("Token verification failed");
          }
        } catch (verifyError) {
          // If verification fails, clear everything and show error
          localStorage.removeItem("companyToken");
          delete axios.defaults.headers.common["Authorization"];
          toast.error("Login verification failed. Please try again.");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      // Clear any existing token on error
      localStorage.removeItem("companyToken");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaData title="Company Login" />
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
              Welcome Back!
            </h1>
            <p className="text-center max-w-md text-lg">
              Sign in to your company account and manage your job postings.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 bg-white flex flex-col items-center p-8 overflow-y-auto">
          <div className="w-full max-w-md">
            <img
              src={`/logo.png`}
              alt="Logo"
              className="w-40 h-40 object-contain mb-6 mx-auto"
            />
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-2xl font-semibold">Company Login</h2>
              <p className="text-center text-sm text-gray-600">
                Sign in to access your company dashboard
              </p>
            </div>

            <form onSubmit={loginHandler} className="w-full">
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
                    type="email"
                    id="email"
                    required
                    placeholder="Enter your company email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" size={20} />
                  </div>
                  <input
                    type={eyeTog ? "text" : "password"}
                    id="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Are you a job seeker?
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  <FaUserCircle size={16} />
                  Switch to User Login
                </Link>
              </div>
            </form>

            <p className="mt-6 text-sm text-gray-600">
              Don't have a company account?{" "}
              <Link
                to="/company/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Register Your Company
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
