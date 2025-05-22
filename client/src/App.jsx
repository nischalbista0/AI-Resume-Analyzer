import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Landing } from "./pages/Landing.jsx";
import { Navbar } from "./components/Navbar";
import { Jobs } from "./pages/Jobs";
import { MyProfile } from "./pages/MyProfile";
import { AppliedJobs } from "./pages/AppliedJobs";
import { SavedJobs } from "./pages/SavedJobs";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CompanyLogin } from "./pages/CompanyLogin";
import { CompanyRegister } from "./pages/CompanyRegister";
import { CompanyProfile } from "./pages/CompanyProfile";
import { JobDetails } from "./pages/JobDetails";
import { ChangePassword } from "./pages/ChangePassword";
import { useSelector, useDispatch } from "react-redux";
import { logOrNot, me } from "./actions/UserActions";
import { EditProfile } from "./pages/EditProfile";
import { DeleteAccount } from "./pages/DeleteAccount";
import { Dashboard } from "./pages/Dashboard";
import { CreateJob } from "./pages/CreateJob";
import { getAllJobs } from "./actions/JobActions";
import { JobsLayout } from "./pages/JobsLayout";
import { Application } from "./pages/Application";
import { ApplicationDetails } from "./pages/ApplicationDetails";
import { ViewAllJobAdmin } from "./pages/VIewAllJobAdmin";
import { ViewAllAppli } from "./pages/ViewAllAppli";
import { ViewAllUsersAdmin } from "./pages/ViewAllUsersAdmin";
import { EditAppAdmin } from "./pages/EditAppAdmin";
import { EditUserAdmin } from "./pages/EditUserAdmin";
import { EditJobAdmin } from "./pages/EditJobAdmin";
import { Test } from "./pages/Test";
import NotFound from "./pages/NotFound";
import UnAuthorized from "./pages/UnAuthorized";
import ScrollToTopWhenRouteChanges from "./components/ScrollToTopOnRouteChange.jsx";
import { Toaster } from "react-hot-toast";
import { UserDashboard } from "./pages/UserDashboard.jsx";
import { MainLayout } from "./components/MainLayout.jsx";
import { ResumeAnalysis } from "./pages/ResumeAnalysis";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { CompanyJobs } from "./pages/CompanyJobs";
import { EditJob } from "./pages/EditJob";
import { CompanyApplications } from "./pages/CompanyApplications";
import { JobApplications } from "./pages/JobApplications";
import { Notifications } from "./pages/Notifications";

function App() {
  const dispatch = useDispatch();

  const { isLogin } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(me());
  }, [dispatch, isLogin]);

  useEffect(() => {
    const LogOrNot = () => {
      dispatch(logOrNot());
      dispatch(getAllJobs());
    };
    LogOrNot();
  }, []);

  const ProtectedRoute = ({
    isAllowed,
    redirectPath = "/unauthorized",
    children,
  }) => {
    if (!isAllowed) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };

  return (
    <>
      <ScrollToTopWhenRouteChanges />

      <Toaster position="top-center" />

      <Routes>
        <Route exact path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company/login" element={<CompanyLogin />} />
        <Route path="/company/register" element={<CompanyRegister />} />

        <Route element={<MainLayout />}>
          <Route
            element={
              <ProtectedRoute
                isAllowed={["applicant", "admin"].includes(
                  localStorage.getItem("role")
                )}
              />
            }
          >
            <Route path="/main" element={<UserDashboard />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/applied" element={<AppliedJobs />} />
            <Route path="/saved" element={<SavedJobs />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/deleteAccount" element={<DeleteAccount />} />
            <Route path="/resume-analysis" element={<ResumeAnalysis />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                isAllowed={localStorage.getItem("companyToken") !== null}
              />
            }
          >
            <Route path="/company/profile" element={<CompanyProfile />} />
            <Route path="/company/dashboard" element={<CompanyDashboard />} />
            <Route path="/company/post-job" element={<CreateJob />} />
            <Route path="/company/jobs" element={<CompanyJobs />} />
            <Route path="/company/edit-job/:id" element={<EditJob />} />
            <Route
              path="/company/applications"
              element={<CompanyApplications />}
            />
            <Route
              path="/company/jobs/:id/applications"
              element={<JobApplications />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                isAllowed={"admin" === localStorage.getItem("role")}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/postJob" element={<CreateJob />} />
            <Route path="/admin/allJobs" element={<ViewAllJobAdmin />} />
            <Route path="/admin/allApplications" element={<ViewAllAppli />} />
            <Route path="/admin/allUsers" element={<ViewAllUsersAdmin />} />
            <Route
              path="/admin/update/application/:id"
              element={<EditAppAdmin />}
            />
            <Route path="/admin/user/role/:id" element={<EditUserAdmin />} />
            <Route path="/admin/job/details/:id" element={<EditJobAdmin />} />
          </Route>

          <Route path="/jobs" element={<Jobs />} />

          <Route path="/details/:id" element={<JobDetails />} />

          <Route path="/JobsLayout" element={<JobsLayout />} />

          <Route path="/Application/:id" element={<Application />} />

          <Route
            path="/Application/Details/:id"
            element={<ApplicationDetails />}
          />

          <Route path="/test" element={<Test />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
