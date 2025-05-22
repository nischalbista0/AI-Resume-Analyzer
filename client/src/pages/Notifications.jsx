import React, { useState, useEffect } from "react";
import { MetaData } from "../components/MetaData";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  MdDoneAll,
  MdNotifications,
  MdNotificationsActive,
} from "react-icons/md";
import {
  BsBriefcase,
  BsCheckCircle,
  BsXCircle,
  BsHourglassSplit,
} from "react-icons/bs";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
};

const getNotificationIcon = (type, title) => {
  // Check for application status in the title
  if (title?.toLowerCase().includes("rejected")) {
    return <FaUserTimes className="text-red-500" size={24} />;
  }
  if (title?.toLowerCase().includes("accepted")) {
    return <FaUserCheck className="text-green-500" size={24} />;
  }
  if (title?.toLowerCase().includes("pending")) {
    return <BsHourglassSplit className="text-yellow-500" size={24} />;
  }

  // Check for notification type
  switch (type) {
    case "application_status":
      return <BsCheckCircle className="text-blue-500" size={24} />;
    case "job_alert":
      return <BsBriefcase className="text-purple-500" size={24} />;
    case "application_rejected":
      return <FaUserTimes className="text-red-500" size={24} />;
    case "application_accepted":
      return <FaUserCheck className="text-green-500" size={24} />;
    case "application_pending":
      return <BsHourglassSplit className="text-yellow-500" size={24} />;
    default:
      return <MdNotifications className="text-gray-500" size={24} />;
  }
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        "http://localhost:3000/api/v1/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(
        `http://localhost:3000/api/v1/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
        toast.success("Notification marked as read");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return;

      const unreadNotifications = notifications.filter((n) => !n.read);
      const promises = unreadNotifications.map((n) =>
        fetch(`http://localhost:3000/api/v1/notifications/${n._id}/read`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
      );

      await Promise.all(promises);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <MetaData title="Notifications" />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <MdNotificationsActive className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Notifications
            </h1>
          </div>
          {notifications.some((n) => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <MdDoneAll className="mr-2" size={20} />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <MdNotifications className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500">
              We'll notify you when something important happens
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                  notification.read ? "border-gray-200" : "border-blue-200"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type, notification.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-gray-600">
                          {notification.message}
                        </p>
                        {notification.job && (
                          <Link
                            to={`/details/${notification.job._id}`}
                            className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            <BsBriefcase className="mr-1" />
                            View Job Details
                          </Link>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <BsCheckCircle className="mr-1" />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
