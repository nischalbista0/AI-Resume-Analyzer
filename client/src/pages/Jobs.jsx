import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { FiSearch, FiFilter } from "react-icons/fi";
import { Loader } from "../components/Loader";
import { JobCard } from "../components/JobCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllJobs, getSingleJob } from "../actions/JobActions";
import { RxCross2 } from "react-icons/rx";
import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";

export const Jobs = () => {
  const dispatch = useDispatch();
  const { allJobs = [], loading } = useSelector((state) => state.job || {});

  const [baseJobs, setBaseJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const isMobile = useIsMobile();

  // Get unique categories from jobs
  const categories = [
    ...new Set(allJobs.map((job) => job?.category).filter(Boolean)),
  ];

  // Job types
  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ];

  // Experience levels
  const experienceLevels = [
    "Entry Level",
    "Mid Level",
    "Senior Level",
    "Executive",
  ];

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allJobs)) {
      setJobs(allJobs);
      setBaseJobs(allJobs);
    }
  }, [allJobs]);

  useEffect(() => {
    if (Array.isArray(baseJobs)) {
      const searchArr = baseJobs.filter((e) =>
        e?.title?.toLowerCase().includes(search.toLowerCase().trim())
      );

      if (search === "") {
        setJobs(baseJobs);
      } else {
        setJobs(searchArr);
      }
    }
  }, [search, baseJobs]);

  const searchHandler = () => {
    if (!Array.isArray(baseJobs)) return;

    const searchArr = baseJobs.filter((e) =>
      e?.title?.toLowerCase().includes(search.toLowerCase())
    );

    if (search !== "") {
      setJobs(searchArr);
    } else if (searchArr.length === 0) {
      setJobs(baseJobs);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(baseJobs)) return;

    let filteredJobs = [...baseJobs];

    // Apply category filter
    if (category) {
      filteredJobs = filteredJobs.filter(
        (job) => job?.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply job type filter
    if (jobType) {
      filteredJobs = filteredJobs.filter(
        (job) => job?.jobType?.toLowerCase() === jobType.toLowerCase()
      );
    }

    // Apply experience filter
    if (experience) {
      filteredJobs = filteredJobs.filter(
        (job) => job?.experience?.toLowerCase() === experience.toLowerCase()
      );
    }

    setJobs(filteredJobs);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setCategory("");
    setJobType("");
    setExperience("");
    setJobs(baseJobs);
    setCurrentPage(1);
  };

  // Pagination
  const itemsPerPage = 5;
  const totalPageCount = Math.ceil(
    (Array.isArray(jobs) ? jobs.length : 0) / itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPageCount));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedData = Array.isArray(jobs)
    ? jobs.slice(startIndex, endIndex)
    : [];

  const pageButtons = [];
  const maxButtonsToShow = 3;

  let startButton = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endButton = Math.min(totalPageCount, startButton + maxButtonsToShow - 1);

  for (let i = startButton; i <= endButton; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={`mx-1 px-3 py-1 border border-gray-700 rounded transition-all duration-200 ${
          currentPage === i
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <>
      <MetaData title="Jobs" />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover thousands of job opportunities with all the information
                you need
              </p>

              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
                  <div className="flex-1 flex items-center px-4">
                    <FiSearch className="text-gray-400 text-xl" />
                    <input
                      value={search}
                      placeholder="Search jobs by title, company, or keywords"
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      className="ml-3 w-full outline-none text-gray-700"
                    />
                    {search && (
                      <RxCross2
                        onClick={() => setSearch("")}
                        className="text-gray-400 cursor-pointer hover:text-gray-600"
                        size={20}
                      />
                    )}
                  </div>
                  <button
                    onClick={searchHandler}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Section */}
              <div className="lg:w-1/4">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden text-gray-600 hover:text-gray-800"
                    >
                      <FiFilter size={20} />
                    </button>
                  </div>

                  <div
                    className={`${
                      showFilters ? "block" : "hidden"
                    } lg:block space-y-6`}
                  >
                    {/* Categories */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Categories
                      </h3>
                      <div className="space-y-2">
                        {categories.map((cat, i) => (
                          <button
                            key={i}
                            onClick={() => setCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                              category === cat
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Job Type */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Job Type
                      </h3>
                      <div className="space-y-2">
                        {jobTypes.map((type, i) => (
                          <button
                            key={i}
                            onClick={() => setJobType(type)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                              jobType === type
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Experience Level
                      </h3>
                      <div className="space-y-2">
                        {experienceLevels.map((level, i) => (
                          <button
                            key={i}
                            onClick={() => setExperience(level)}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${
                              experience === level
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={applyFilters}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs List */}
              <div className="lg:w-3/4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {jobs.length} Jobs Found
                    </h2>
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPageCount}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Array.isArray(displayedData) &&
                      displayedData
                        .filter((job) => job?._id)
                        .sort((a, b) => {
                          const dateA = new Date(a?.createdAt || 0);
                          const dateB = new Date(b?.createdAt || 0);
                          return dateB - dateA;
                        })
                        .map((job, i) => (
                          <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <JobCard
                              onClick={() => {
                                if (job?._id) {
                                  dispatch(getSingleJob(job._id));
                                }
                              }}
                              job={job}
                            />
                          </motion.div>
                        ))}

                    {(!Array.isArray(jobs) || jobs.length === 0) && (
                      <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">
                          No jobs found matching your criteria
                        </div>
                        <p className="text-gray-400">
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {Array.isArray(jobs) && jobs.length > 0 && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Previous
                      </button>

                      {pageButtons}

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPageCount}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
