import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import { Sidebar } from "../components/Sidebar";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllJobsAdmin,
  getAllUsersAdmin,
  getAllAppAdmin,
} from "../actions/AdminActions";
import CountUp from "react-countup";
import { BarChart } from "../components/Chart";
import { Loader } from "../components/Loader";
import { FaUsers, FaBriefcase, FaFileAlt } from "react-icons/fa";

export const Dashboard = () => {
  const [sideTog, setSideTog] = useState(false);
  const dispatch = useDispatch();

  const { loading, allJobs, allApplications, allUsers } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAllJobsAdmin());
    dispatch(getAllUsersAdmin());
    dispatch(getAllAppAdmin());
  }, []);

  return (
    <>
      <MetaData title="Admin Dashboard" />
      <div className="bg-gray-50 min-h-screen pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Overview of your platform's performance and statistics
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Users Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">
                        <CountUp start={0} end={allUsers?.length || 0} />
                      </h3>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaUsers className="text-blue-600 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Active job seekers and employers
                    </p>
                  </div>
                </div>

                {/* Jobs Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Jobs
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">
                        <CountUp start={0} end={allJobs?.length || 0} />
                      </h3>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaBriefcase className="text-green-600 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Posted job opportunities
                    </p>
                  </div>
                </div>

                {/* Applications Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Applications
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">
                        <CountUp start={0} end={allApplications?.length || 0} />
                      </h3>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaFileAlt className="text-purple-600 text-xl" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Job applications received
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Platform Overview
                </h2>
                <div className="w-full h-[400px] flex justify-center items-center">
                  <div className="w-[500px] h-[400px]">
                    <BarChart
                      applications={allApplications?.length || 0}
                      users={allUsers?.length || 0}
                      jobs={allJobs?.length || 0}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
