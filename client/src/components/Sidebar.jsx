import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdOutlineDashboardCustomize,
  MdOutlineAccountCircle,
  MdOutlineArticle,
} from "react-icons/md";

export const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();

  const sidebarLinks = [
    {
      name: "Dashboard",
      icon: MdOutlineDashboardCustomize,
      path: "/main",
    },
    {
      name: "User Profile",
      icon: MdOutlineAccountCircle,
      path: "/profile", // Assuming the existing profile page will be used
    },
    {
      name: "Resume Analysis",
      icon: MdOutlineArticle,
      path: "/resume-analysis", // Placeholder path
    },
  ];

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
