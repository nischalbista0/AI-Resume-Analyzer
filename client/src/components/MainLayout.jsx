import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import useIsMobile from "../hooks/useIsMobile";
import { RxCross1 } from "react-icons/rx";

export const MainLayout = () => {
  const isMobile = useIsMobile();
  // Initialize isSidebarOpen based on screen size
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Effect to update isSidebarOpen when screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 pt-16">
        <Sidebar isCollapsed={isMobile && !isSidebarOpen} />
        <div className={`flex-1 transition-all duration-300`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
