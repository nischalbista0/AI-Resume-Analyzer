import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Loader } from "../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaStar,
  FaBriefcase,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";

export const CompanyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [jobStats, setJobStats] = useState([]);
  const [applicationStats, setApplicationStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const companyToken = localStorage.getItem("companyToken");

      if (!companyToken) {
        toast.error("Please login to access the dashboard");
        navigate("/company/login");
        return;
      }

      try {
        setLoading(true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${companyToken}`;

        // Fetch company's jobs
        const jobsResponse = await axios.get(
          "http://localhost:3000/api/v1/company/jobs"
        );
        const jobs = jobsResponse.data.jobs;

        // Fetch all applications for company's jobs
        const applications = [];
        for (const job of jobs) {
          const appResponse = await axios.get(
            `http://localhost:3000/api/v1/company/jobs/${job._id}/applications`
          );
          applications.push(...appResponse.data.applications);
        }

        // Calculate statistics
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter((job) => job.status === "active").length;
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(
          (app) => app.status === "pending"
        ).length;
        const acceptedApplications = applications.filter(
          (app) => app.status === "accepted"
        ).length;
        const rejectedApplications = applications.filter(
          (app) => app.status === "rejected"
        ).length;

        // Get recent applications (last 5)
        const recentApps = applications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((app) => ({
            id: app._id,
            candidateName: app.applicant.name,
            candidateEmail: app.applicant.email,
            role: app.job.title,
            status: app.status,
            createdAt: new Date(app.createdAt).toLocaleDateString(),
          }));

        // Calculate job statistics
        const jobStats = jobs.map((job) => ({
          title: job.title,
          applications: applications.filter((app) => app.job._id === job._id)
            .length,
          status: job.status,
        }));

        // Calculate application statistics by status
        const applicationStats = [
          { status: "Pending", count: pendingApplications, color: "yellow" },
          { status: "Accepted", count: acceptedApplications, color: "green" },
          { status: "Rejected", count: rejectedApplications, color: "red" },
        ];

        setStats({
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          acceptedApplications,
          rejectedApplications,
        });
        setRecentApplications(recentApps);
        setJobStats(jobStats);
        setApplicationStats(applicationStats);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard data"
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("companyToken");
          delete axios.defaults.headers.common["Authorization"];
          toast.error("Session expired. Please login again.");
          window.location.href = "/company/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title="Company Dashboard" />
      <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {stats.totalJobs}
              </h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBriefcase className="text-blue-500 text-xl" />
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {stats.activeJobs}
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaChartLine className="text-green-500 text-xl" />
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {stats.totalApplications}
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaUsers className="text-purple-500 text-xl" />
            </div>
          </div>

          {/* Pending Applications */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Review</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {stats.pendingApplications}
              </h2>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaHourglassHalf className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              Recent Applications
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                              {app.candidateName ? app.candidateName[0] : "?"}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {app.candidateName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.candidateEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            app.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                    >
                      No recent applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Job and Application Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Job Statistics
            </h3>
            {jobStats.length > 0 ? (
              <div className="space-y-4">
                {jobStats.map((job, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700">
                        {job.title}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            (job.applications / stats.totalApplications) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-1">
                      {job.applications} applications
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No job statistics available.
              </p>
            )}
          </div>

          {/* Application Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Application Status
            </h3>
            {applicationStats.length > 0 ? (
              <div className="space-y-4">
                {applicationStats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-gray-700">
                        {stat.status}
                      </p>
                      <span className="text-sm text-gray-600">
                        {stat.count} applications
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          stat.color === "green"
                            ? "bg-green-500"
                            : stat.color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            (stat.count / stats.totalApplications) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-1">
                      {((stat.count / stats.totalApplications) * 100).toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No application statistics available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
