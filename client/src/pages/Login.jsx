import React, { useEffect, useState } from "react";
import { MetaData } from "../components/MetaData";
import {
  AiOutlineMail,
  AiOutlineUnlock,
  AiOutlineEyeInvisible,
  AiOutlineEye,
} from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { TbLoader2 } from "react-icons/tb";
import { loginUser } from "../actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { BsBuilding } from "react-icons/bs";

export const Login = () => {
  const { loading, isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [eyeTog, setEyeTog] = useState(false);

  const loginHandler = (e) => {
    e.preventDefault();

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

    const data = {
      email,
      password,
    };
    dispatch(loginUser(data));
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (isLogin) {
      navigate("/main");
    }
  }, [isLogin, navigate]);

  return (
    <>
      <MetaData title="Login" />

      <div className="flex min-h-screen">
        {/* Left Side - Image and Welcome Text */}
        <div
          className="hidden md:flex flex-1 bg-cover bg-center text-white justify-center items-center flex-col p-8 relative"
          style={{
            backgroundImage: `url(/hero-bg.jpg)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-center">
              Welcome Back!
            </h1>
            <p className="text-center max-w-md text-lg">
              Manage your resume and increase your chances of getting hired with
              our AI.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 bg-white flex flex-col justify-center items-center p-8">
          <img
            src={`/logo.png`}
            alt="Logo"
            className="w-40 h-40 object-contain mb-6"
          />
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold">Login</h2>
            <p className="text-center text-sm">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={loginHandler} className="w-full max-w-md">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

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
                  type={eyeTog ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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

            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-base hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <TbLoader2 className="animate-spin" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Are you a company?</p>
              <Link
                to="/company/login"
                className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                <BsBuilding size={16} />
                Switch to Company Login
              </Link>
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Don't have an account yet?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
