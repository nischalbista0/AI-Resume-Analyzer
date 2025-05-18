import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MetaData } from "../components/MetaData.jsx";
import { useSelector } from "react-redux";

export const Landing = () => {
  const { isLogin } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate("/main");
    }
  }, [isLogin]);

  return (
    <>
      <MetaData title="AI Resume Analyzer" />

      <div
        className="h-screen bg-cover p-6 bg-center relative flex flex-col items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(/hero-bg.jpg)`,
        }}
      >
        {/* Dropdown */}
        <div className="absolute top-5 right-5">
          <Link to="/login">
            <button
              // onClick={() => setOpen((o) => !o)}
              className="bg-sky-400 text-white rounded-full px-6 py-3 text-base font-medium hover:bg-sky-500"
            >
              Log In
            </button>
          </Link>
        </div>

        {/* Icon */}
        <img
          src={`/icon-doc.png`}
          alt="Doc Icon"
          className="w-[60px] mb-5 z-10"
        />

        {/* Title */}
        <h1 className="text-3xl md:text-5xl text-center font-bold z-10">
          AI Resume Analyzer
        </h1>
        <h1 className="text-3xl md:text-5xl text-center font-bold transform scale-y-[-1] opacity-20 blur-sm mt-2 z-0">
          AI Resume Analyzer
        </h1>

        {/* Subtitle */}
        <p className="text-center max-w-xl mt-6 mb-10 text-base leading-relaxed z-10">
          "Smarter Resumes Start Here — Powered by AI, Built for Ambition.
          <br />
          Get personalized insights, fix hidden mistakes, and craft a resume
          that speaks to recruiters."
        </p>

        {/* Footer */}
        <p className="z-10 text-sm">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-sky-400 font-semibold underline">
            GET STARTED
          </Link>
        </p>
      </div>
    </>
  );
};
