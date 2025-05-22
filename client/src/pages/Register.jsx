import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import {
  AiOutlineMail,
  AiOutlineUnlock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineClose,
} from "react-icons/ai";
import { MdPermIdentity, MdOutlineFeaturedPlayList } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { commonSkills } from "../constants/skills";
import { BsBuilding } from "react-icons/bs";

export const Register = () => {
  const { loading, isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [eyeTog, setEyeTog] = useState(false);
  const [confirmEyeTog, setConfirmEyeTog] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarName, setAvatarName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState(commonSkills);

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

  const handleSkillInput = (e) => {
    const value = e.target.value;
    setCurrentSkill(value);

    if (value.trim()) {
      const filtered = commonSkills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
      setShowSkillsDropdown(true);
    } else {
      setFilteredSkills(commonSkills);
      setShowSkillsDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && currentSkill.trim()) {
      e.preventDefault();
      if (skills.includes(currentSkill.trim())) {
        toast.error("This skill is already added");
        return;
      }
      if (skills.length >= 10) {
        toast.error("Maximum 10 skills allowed");
        return;
      }
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
      setShowSkillsDropdown(false);
    }
  };

  const handleClickOutside = (e) => {
    // Check if click is outside the skills container
    if (!e.target.closest(".skills-container")) {
      setShowSkillsDropdown(false);

      // Only add skill if there's text in the input
      if (currentSkill.trim()) {
        if (skills.includes(currentSkill.trim())) {
          toast.error("This skill is already added");
        } else if (skills.length >= 10) {
          toast.error("Maximum 10 skills allowed");
        } else {
          setSkills([...skills, currentSkill.trim()]);
        }
        setCurrentSkill("");
      }
    }
  };

  const selectSkill = (skill) => {
    if (skills.includes(skill)) {
      toast.error("This skill is already added");
      return;
    }
    if (skills.length >= 10) {
      toast.error("Maximum 10 skills allowed");
      return;
    }
    setSkills([...skills, skill]);
    setCurrentSkill("");
    setShowSkillsDropdown(false);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const registerHandler = async (e) => {
    e.preventDefault();

    // Validate name
    if (name.trim().length < 2) {
      toast.error("Name should be at least 2 characters long");
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

    // Validate skills
    if (skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("skills", skills.join(","));

      if (avatar) {
        formData.append("avatar", avatar);
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
        setConfirmPassword("");
        setSkills([]);
        setCurrentSkill("");
        setAvatar(null);
        setAvatarName("");

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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [currentSkill, skills]);

  return (
    <>
      <MetaData title="Register" />

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
              Join Us Today!
            </h1>
            <p className="text-center max-w-md text-lg">
              Create your account and start your journey towards better career
              opportunities.
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
              <h2 className="text-2xl font-semibold">Create Account</h2>
              <p className="text-center text-sm text-gray-600">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={registerHandler} className="w-full">
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
                  <div className="flex items-center">
                    <label
                      htmlFor="avatar"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md cursor-pointer flex items-center text-gray-500 hover:border-blue-500"
                    >
                      {avatarName || "Select Profile Picture"}
                    </label>
                    <input
                      id="avatar"
                      name="avatar"
                      onChange={avatarChange}
                      accept="image/*"
                      type="file"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4 skills-container">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <MdOutlineFeaturedPlayList
                      className="text-gray-400"
                      size={20}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentSkill}
                      onChange={handleSkillInput}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSkillsDropdown(true)}
                      placeholder="Search or type a skill"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {showSkillsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredSkills.length > 0 ? (
                          <>
                            {filteredSkills.map((skill, index) => (
                              <div
                                key={index}
                                onClick={() => selectSkill(skill)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                              >
                                {skill}
                              </div>
                            ))}
                            {currentSkill.trim() &&
                              !filteredSkills.includes(currentSkill.trim()) && (
                                <div
                                  onClick={() =>
                                    selectSkill(currentSkill.trim())
                                  }
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-t border-gray-200 bg-gray-50"
                                >
                                  <span className="text-blue-600">+</span> Add "
                                  {currentSkill.trim()}"
                                </div>
                              )}
                          </>
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No matching skills found. Press Enter to add as
                            custom skill.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <AiOutlineClose size={16} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                          {skills.length}{" "}
                          {skills.length === 1 ? "skill" : "skills"} added
                        </span>
                      </div>
                    </div>
                  )}
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

              {/* Confirm Password */}
              <div className="mb-6">
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setConfirmEyeTog(!confirmEyeTog)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {confirmEyeTog ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {uploading ? (
                  <>
                    <TbLoader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Are you a company?</p>
                <Link
                  to="/company/register"
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  <BsBuilding size={16} />
                  Switch to Company Registration
                </Link>
              </div>

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
      </div>
    </>
  );
};
