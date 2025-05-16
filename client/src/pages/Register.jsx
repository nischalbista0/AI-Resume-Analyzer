import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import {
  AiOutlineMail,
  AiOutlineUnlock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { MdPermIdentity, MdOutlineFeaturedPlayList } from "react-icons/md";
import { BsFileEarmarkText } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { registerUser } from "../actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

export const Register = () => {
  const { loading, isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [eyeTog, setEyeTog] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarName, setAvatarName] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [uploading, setUploading] = useState(false);

  const avatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Avatar file size should be less than 10MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setAvatar(file);
      setAvatarName(file.name);
    }
  };

  const resumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("Resume file size should be less than 10MB");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or DOC file");
        return;
      }
      setResume(file);
      setResumeName(file.name);
    }
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("skills", skills);

      if (avatar) {
        formData.append("avatar", avatar);
      }
      if (resume) {
        formData.append("resume", resume);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/register",
        formData,
        config
      );

      if (response.data.success) {
        toast.success("Registration successful! Please login to continue.");

        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setSkills("");
        setAvatar(null);
        setAvatarName("");
        setResume(null);
        setResumeName("");

        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <MetaData title="Register" />
      <div className="flex min-h-screen">
        {/* Left Side - Image and Welcome Text */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center text-white justify-center items-center flex-col p-8 relative"
          style={{
            backgroundImage: `url(/hero-bg.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-center">
              Join Us Today!
            </h1>
            <p className="text-center max-w-md text-lg">
              Create your account and start your journey towards better career
              opportunities.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 bg-white flex flex-col justify-center items-center p-8">
          <img
            src={`/logo.png`}
            alt="Logo"
            className="w-40 h-40 object-contain mb-6"
          />
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-center text-sm text-gray-600">
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={registerHandler} className="w-full max-w-md">
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdPermIdentity className="text-gray-400" size={20} />
                </div>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
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
                Email Address
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
                  placeholder="Enter your email"
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
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setEyeTog(!eyeTog)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {eyeTog ? (
                      <AiOutlineEye size={20} />
                    ) : (
                      <AiOutlineEyeInvisible size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="mb-4">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CgProfile className="text-gray-400" size={20} />
                </div>
                <label
                  htmlFor="avatar"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md cursor-pointer flex items-center text-gray-500 hover:border-blue-500"
                >
                  {avatarName || "Select Profile Picture..."}
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  required
                  onChange={avatarChange}
                  accept="image/*"
                  type="file"
                  className="hidden"
                />
              </div>
            </div>

            {/* Resume */}
            <div className="mb-4">
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resume
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BsFileEarmarkText className="text-gray-400" size={20} />
                </div>
                <label
                  htmlFor="resume"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md cursor-pointer flex items-center text-gray-500 hover:border-blue-500"
                >
                  {resumeName || "Select Resume..."}
                </label>
                <input
                  id="resume"
                  name="resume"
                  onChange={resumeChange}
                  accept=".pdf,.doc,.docx"
                  type="file"
                  className="hidden"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skills (comma separated)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <MdOutlineFeaturedPlayList
                    className="text-gray-400"
                    size={20}
                  />
                </div>
                <textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter your skills (e.g., JavaScript, React, Node.js)"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <TbLoader2 className="animate-spin" size={24} />
              ) : (
                "Create Account"
              )}
            </button>

            <p className="mt-6 text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
