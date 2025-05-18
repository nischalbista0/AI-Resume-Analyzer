import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@mantine/core";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineBusinessCenter, MdOutlineDashboard } from "react-icons/md";
import { Menu } from "@mantine/core";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { MdDoneAll } from "react-icons/md";
import { RiLogoutBoxFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { logOrNot } from "../actions/UserActions";
import { useNavigate } from "react-router-dom";
import { logoutClearState } from "../slices/UserSlice";
import { motion } from "framer-motion";
import useIsMobile from "../hooks/useIsMobile";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  return `http://localhost:3000/${avatarPath
    .replace("public\\", "")
    .replace(/\\/g, "/")}`;
};

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { isLogin, me } = useSelector((state) => state.user);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const LogOut = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    dispatch(logOrNot());
    navigate("/");
    toast.success("Logout Successful !");
    dispatch(logoutClearState());
  };

  return (
    <nav className="bg-white shadow-md py-3 px-6 flex justify-between items-center z-20 fixed top-0 w-full">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="mr-4 p-1 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            {isSidebarOpen ? (
              <RxCross1 size={24} />
            ) : (
              <HiOutlineMenuAlt2 size={24} />
            )}
          </button>
        )}
        <Link
          to={isLogin ? "/main" : "/"}
          className="flex items-center text-gray-800 text-xl font-bold"
        >
          <IoDocumentTextOutline size={24} className="mr-2 text-blue-600" /> AI
          Resume Analyzer
        </Link>
      </div>

      {!isMobile && (
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-6 text-gray-600 font-medium">
            {me?.role === "admin" ? (
              <Link to="/admin/postJob" className="hover:text-blue-600">
                Post Job
              </Link>
            ) : (
              <Link to="/jobs" className="hover:text-blue-600">
                Jobs
              </Link>
            )}
          </div>

          {isLogin ? (
            <div className="flex items-center space-x-6 text-gray-600 font-medium">
              <Link to="/analytics" className="hover:text-blue-600">
                Analytics
              </Link>
              {/* <Link to="/settings" className="hover:text-blue-600">
                Settings
              </Link> */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Avatar
                    className="cursor-pointer"
                    radius="xl"
                    size="md"
                    src={getAvatarUrl(me?.avatar)}
                    alt="Profile"
                  />
                </Menu.Target>

                <Menu.Dropdown>
                  <Link to="/profile">
                    <Menu.Item icon={<FaUserCircle size={14} />}>
                      My Profile
                    </Menu.Item>
                  </Link>
                  <Link to="/applied">
                    <Menu.Item icon={<MdDoneAll size={14} />}>
                      Applied Jobs
                    </Menu.Item>
                  </Link>
                  <Link to="/saved">
                    <Menu.Item icon={<FaSave size={14} />}>
                      Saved Jobs
                    </Menu.Item>
                  </Link>
                  {me?.role === "admin" && (
                    <Link to="/admin/postJob">
                      <Menu.Item icon={<MdOutlineDashboard size={14} />}>
                        Post Job
                      </Menu.Item>
                    </Link>
                  )}
                  <Menu.Divider />
                  <Menu.Item
                    onClick={LogOut}
                    color="red"
                    icon={<RiLogoutBoxFill size={14} />}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <span className="flex gap-3">
              <Link
                className="cursor-pointer text-sm px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="cursor-pointer text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                to="/register"
              >
                Register
              </Link>
            </span>
          )}
        </div>
      )}

      {isMobile && (
        <div className="flex items-center">
          {isLogin ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar
                  size="md"
                  className="cursor-pointer mr-4"
                  radius="xl"
                  src={getAvatarUrl(me?.avatar)}
                  alt="Profile"
                />
              </Menu.Target>

              <Menu.Dropdown>
                <Link to="/profile">
                  <Menu.Item icon={<FaUserCircle size={14} />}>
                    My Profile
                  </Menu.Item>
                </Link>
                {me?.role === "admin" && (
                  <Link to="/admin/dashboard">
                    <Menu.Item icon={<MdOutlineDashboard size={14} />}>
                      Admin Dashboard
                    </Menu.Item>
                  </Link>
                )}
                <Link to="/applied">
                  <Menu.Item icon={<MdDoneAll size={14} />}>
                    Applied Jobs
                  </Menu.Item>
                </Link>
                <Link to="/saved">
                  <Menu.Item icon={<FaSave size={14} />}>Saved Jobs</Menu.Item>
                </Link>
                {me?.role === "admin" && (
                  <Link to="/admin/postJob">
                    <Menu.Item icon={<MdOutlineDashboard size={14} />}>
                      Post Job
                    </Menu.Item>
                  </Link>
                )}
                <Menu.Divider />
                <Menu.Item
                  onClick={LogOut}
                  color="red"
                  icon={<RiLogoutBoxFill size={14} />}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <span className="flex gap-3 mr-4">
              <Link
                className="cursor-pointer text-sm px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition duration-300"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="cursor-pointer text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                to="/register"
              >
                Register
              </Link>
            </span>
          )}

          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            {isMobileNavOpen ? <RxCross1 size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      )}

      {isMobile && isMobileNavOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-10">
          <ul className="flex flex-col items-center py-4 space-y-4 text-gray-700 font-medium">
            <Link
              onClick={() => setIsMobileNavOpen(false)}
              to="/jobs"
              className="hover:text-blue-600"
            >
              Jobs
            </Link>
            {isLogin && (
              <>
                <Link
                  onClick={() => setIsMobileNavOpen(false)}
                  to="/dashboard"
                  className="hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  onClick={() => setIsMobileNavOpen(false)}
                  to="/analytics"
                  className="hover:text-blue-600"
                >
                  Analytics
                </Link>
                {/* <Link
                  onClick={() => setIsMobileNavOpen(false)}
                  to="/settings"
                  className="hover:text-blue-600"
                >
                  Settings
                </Link> */}
                {me?.role === "admin" && (
                  <Link
                    onClick={() => setIsMobileNavOpen(false)}
                    to="/admin/postJob"
                    className="hover:text-blue-600"
                  >
                    Post Job
                  </Link>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
