import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { createJobPost } from "../actions/JobActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { TbLoader2 } from "react-icons/tb";
import {
  MdOutlineWorkOutline,
  MdOutlineLocationOn,
  MdOutlineFeaturedPlayList,
  MdWorkspacesOutline,
  MdAttachMoney,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { commonSkills } from "../constants/skills";

export const CreateJob = () => {
  const { loading } = useSelector((state) => state.job);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState(commonSkills);
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [category, setCategory] = useState("");
  const [employmentType, setEmploymentType] = useState("");

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
    if (!e.target.closest(".skills-container")) {
      setShowSkillsDropdown(false);

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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [currentSkill, skills]);

  const postHandler = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      location,
      skillsRequired: skills,
      experience,
      salary,
      category,
      employmentType,
    };

    try {
      const response = await dispatch(createJobPost(data));
      if (response.success) {
        toast.success("Job posted successfully!");
        navigate("/company/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <>
      <MetaData title="Post Job" />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Post a New Job
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details below to create a new job posting.
              </p>
            </div>

            <form onSubmit={postHandler} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Job Title */}
                <div className="col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineWorkOutline
                        className="text-gray-400"
                        size={20}
                      />
                    </div>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineLocationOn
                        className="text-gray-400"
                        size={20}
                      />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., New York, NY"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Experience Required
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdOutlineReceiptLong
                        className="text-gray-400"
                        size={20}
                      />
                    </div>
                    <input
                      type="text"
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2-5 years"
                    />
                  </div>
                </div>

                {/* Salary */}
                <div>
                  <label
                    htmlFor="salary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Salary Range
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdAttachMoney className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      id="salary"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $80,000 - $100,000"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                {/* Employment Type */}
                <div>
                  <label
                    htmlFor="employmentType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employment Type
                  </label>
                  <select
                    id="employmentType"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Job Description */}
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Description
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3">
                      <MdOutlineFeaturedPlayList
                        className="text-gray-400"
                        size={20}
                      />
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="4"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Provide a detailed description of the job role and responsibilities..."
                    />
                  </div>
                </div>

                {/* Skills Required */}
                <div className="col-span-2 skills-container">
                  <label
                    htmlFor="skillsRequired"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Required Skills
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute top-3 left-3 z-10">
                      <MdWorkspacesOutline
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
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                !filteredSkills.includes(
                                  currentSkill.trim()
                                ) && (
                                  <div
                                    onClick={() =>
                                      selectSkill(currentSkill.trim())
                                    }
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-t border-gray-200 bg-gray-50"
                                  >
                                    <span className="text-blue-600">+</span> Add
                                    "{currentSkill.trim()}"
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
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/company/dashboard")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <TbLoader2 className="animate-spin" size={20} />
                      <span>Posting...</span>
                    </>
                  ) : (
                    "Post Job"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
