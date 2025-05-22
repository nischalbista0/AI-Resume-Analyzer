import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineDashboardCustomize,
  MdOutlineAccountCircle,
  MdOutlineArticle,
  MdOutlineBusinessCenter,
  MdOutlineWorkOutline,
  MdOutlinePeople,
  MdOutlineAdminPanelSettings,
  MdOutlineListAlt,
  MdOutlinePerson,
} from "react-icons/md";

export const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const isCompany = localStorage.getItem("companyToken");
  const isAdmin = localStorage.getItem("role") === "admin";

  const userSidebarLinks = [
    {
      name: "Dashboard",
      icon: MdOutlineDashboardCustomize,
      path: "/main",
    },
    {
      name: "User Profile",
      icon: MdOutlineAccountCircle,
      path: "/profile",
    },
    {
      name: "Resume Analysis",
      icon: MdOutlineArticle,
      path: "/resume-analysis",
    },
  ];

  const companySidebarLinks = [
    {
      name: "Dashboard",
      icon: MdOutlineDashboardCustomize,
      path: "/company/dashboard",
    },
    {
      name: "Company Profile",
      icon: MdOutlineBusinessCenter,
      path: "/company/profile",
    },
    {
      name: "Posted Jobs",
      icon: MdOutlineWorkOutline,
      path: "/company/jobs",
    },
  ];

  const adminSidebarLinks = [
    {
      name: "Dashboard",
      icon: MdOutlineDashboardCustomize,
      path: "/admin/dashboard",
    },
    {
      name: "All Jobs",
      icon: MdOutlineWorkOutline,
      path: "/admin/allJobs",
    },
    {
      name: "All Users",
      icon: MdOutlinePerson,
      path: "/admin/allUsers",
    },
    {
      name: "All Applications",
      icon: MdOutlineListAlt,
      path: "/admin/allApplications",
    },
  ];

  const sidebarLinks = isAdmin
    ? adminSidebarLinks
    : isCompany
    ? companySidebarLinks
    : userSidebarLinks;

  return (
    <div
      className={`bg-white shadow-md flex flex-col h-screen sticky top-16 ${
        isCollapsed ? "w-20 items-center" : "w-64"
      } transition-all duration-300`}
    >
      <nav className="flex-1 px-2 py-6 space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
              location.pathname === link.path
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <link.icon
              size={isCollapsed ? 28 : 20}
              className={isCollapsed ? "" : "mr-3"}
            />
            {!isCollapsed && link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
