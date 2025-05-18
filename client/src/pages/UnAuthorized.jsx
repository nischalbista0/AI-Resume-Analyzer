import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

function UnAuthorized() {
  return (
    <main className="bg-gray-50 min-h-screen py-10 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-blue-200 relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]">
        {/* Subtle background element for AI vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-gray-50 opacity-60"></div>
        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <MdLockOutline className="text-8xl text-blue-700 relative z-10 transform transition-transform duration-300 hover:scale-110" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 transform transition-transform duration-300 hover:scale-105">
              401
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
              Unauthorized Access
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access denied! You don't have permission to view this page. Please
              log in with appropriate credentials or return to the home page.
            </p>
          </div>

          <div className="text-center">
            <Link to="/">
              <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-blue-600 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full h-full bg-blue-500 border-2 border-blue-600 group-hover:bg-blue-600"></span>
                <span className="relative flex items-center gap-2">
                  <FaHome className="text-lg transform transition-transform duration-300 group-hover:scale-110" />
                  Back to Home
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UnAuthorized;
