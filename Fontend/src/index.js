import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import reportWebVitals from "./reportWebVitals";

// Import Components
import Register from "./componets/accounts/Register";
import Login from "./componets/accounts/Login";
import ForgotPassword from "./componets/accounts/ForgotPassword";
import HomePage from "./componets/common/HomePage";
import ViewJobDetail from "./componets/jobseeker/ViewJobDetail";
import CreatePostJob from "./componets/employee/CreatePostJob";
import ViewAllJobApplied from "./componets/employee/View_All_Job_Applied";
import ViewAllJobSeekerApply from "./componets/employee/View_All_Jobseeker_Apply";
import ViewJobSeekerDetail from "./componets/employee/View_JobSeeker_Detail";
import ViewJobCreatedDetail from "./componets/employee/ViewJobCreatedDetail";
import ViewListJobsCreated from "./componets/employee/ViewListJobsCreated";
import Profile from "./componets/accounts/Profile";
import VerifyRegister from "./componets/accounts/VerifyRegister";
import PostJobs from "./componets/jobseeker/ViewAllPostJob";
import ApplyJob from "./componets/jobseeker/ApplyJob";
import ScheduleTable from "./componets/jobseeker/ScheduleTable";
import MemberCard from "./componets/employee/ViewAllJobSeeker";
import VerifyEmployerAccount from "./componets/jobseeker/VerifyEmployerAccount";
import ViewAllPostJobInWishlist from "./componets/jobseeker/ViewAllPostJobInWishlist";
import ViewAllJobSeekerInFavoriteList from "./componets/employee/ViewAllJobSeekerInFavoriteList";
import ReportPostJob from "./componets/jobseeker/ReportPostJob";
import ManagementCV from "./componets/jobseeker/ManagementCV";
// Import PrivateRoute
import PrivateRoute from "./PrivateRoute";
import Unauthorized from "./componets/common/Unauthorized";
import ViewJobDetailJobSeeker from "./componets/employee/ViewDetailJobSeeker";
import EditPostJob from "./componets/employee/EditPostJob";
import ViewAllPostJob from "./componets/staff/ViewAllPostJob";
import PostJobDetail from "./componets/staff/PostJobDetail";

import EmployerRequests from "./componets/staff/ViewEmployerRequest";
import EmployerRequestDetail from "./componets/staff/ViewEmployerRequestDetail";
import ChatList from "./componets/common/ChatList";
import AdminDashboard from "./componets/admin/AdminDashBoard";
import PaymentScreen from "./componets/utils/Payment";
import ViewEmployerProfile from "./componets/jobseeker/ViewEmployerProfile";
import ViewBlogList from "./componets/common/ViewBlogList";
import BlogDetail from "./componets/common/BlogDetatil";
import ViewAllPriceList from "./componets/employee/ViewAllPriceList";
import ReCreateJob from "./componets/employee/ReCreateJob";

import ManageUser from "./componets/admin/ManageUser";
import UserDetail from "./componets/admin/UserDetail";
import BlogList from "./componets/admin/BlogList";
import BlogDetailllll from "./componets/admin/BlogDetail";
import CreateBlog from "./componets/admin/CreateBlog";

import HistoryPayment from "./componets/admin/ViewHistoryPayment";
import PaymentHistoryTable from "./componets/employee/ViewHistoryPayment";
import ViewRecommendedJobs from "./componets/jobseeker/ViewRecommendedJobs";
import PaymentSuccess from "./componets/employee/PaymentSuccess";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/VerifyRegister" element={<VerifyRegister />} />
          <Route path="/viewAllJob" element={<PostJobs />} />
          <Route path="/lich" element={<ScheduleTable />} />
          <Route path="/ViewEmployerRequests" element={<EmployerRequests />} />
          <Route
            path="/ViewEmployerRequestsDetail/:id"
            element={<EmployerRequestDetail />}
          />
          <Route path="/viewJobDetail/:id" element={<ViewJobDetail />} />
          
          
          <Route path="/ManageUser"element={<PrivateRoute allowedRoles={[4]}><ManageUser /></PrivateRoute>}/>
          <Route path="/user/:id"element={<PrivateRoute allowedRoles={[4]}><UserDetail /></PrivateRoute>}/>
          <Route path="/BlogList"element={<PrivateRoute allowedRoles={[4]}><BlogList /></PrivateRoute>}/>
          <Route path="/BlogDetailllll/:id"element={<PrivateRoute allowedRoles={[4]}><BlogDetailllll /></PrivateRoute>}/>
          <Route path="/CreateBlog"element={<PrivateRoute allowedRoles={[4]}><CreateBlog /></PrivateRoute>}/>
          <Route path="/ViewAllHistoryPayment"element={<PrivateRoute allowedRoles={[4]}><HistoryPayment /></PrivateRoute>}/>
          <Route path="/ViewAllPost"element={<PrivateRoute allowedRoles={[3, 4]}><ViewAllPostJob /></PrivateRoute>}/>
          <Route path="/ViewDetail/:job_id/:status" element={<PrivateRoute allowedRoles={[3, 4]}><PostJobDetail /></PrivateRoute>}/>
          <Route path="/PaymentSuccess" element={<PaymentSuccess/>}/>
           {/* Job Seeker-Only Routes */}
          <Route
            path="/ViewAllJobApplied"
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ViewAllJobApplied />
              </PrivateRoute>
            }
          />
          <Route
            path="/ApplyJob/:job_id"
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ApplyJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/ChatList"
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <ChatList />
              </PrivateRoute>
            }
          />
          <Route
            path="/verifyEmployerAccount"
            element={
              <PrivateRoute allowedRoles={[1]}>
                <VerifyEmployerAccount />
              </PrivateRoute>
            }
          />
          {/* Employer-Only Routes */}
          <Route path="/ViewHistoryPayment"element={<PrivateRoute allowedRoles={[2]}><PaymentHistoryTable /></PrivateRoute>}/>
          <Route
            path="/createPostJob"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <CreatePostJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewListJobsCreated"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <ViewListJobsCreated />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewJobCreatedDetail/:id"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <ViewJobCreatedDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewDetailJobSeeker/:id"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <ViewJobDetailJobSeeker />
              </PrivateRoute>
            }
          />
          <Route
            path="/viewAllJobSeeker"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <MemberCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/ViewAllJobseekerApply/:id"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <ViewAllJobSeekerApply />
              </PrivateRoute>
            }
          />
          <Route
            path="/ViewJobSeekerDetail/:id/:apply_id"
            element={
              <PrivateRoute allowedRoles={[2]}>
                <ViewJobSeekerDetail />
              </PrivateRoute>
            }
          />

          {/* Admin-Only Routes */}
          <Route
            path="/AdminDashBoard"
            element={
              <PrivateRoute allowedRoles={[4]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Miscellaneous Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/viewAllPostJobInWishlist"
            element={<ViewAllPostJobInWishlist />}
          />
          <Route
            path="/viewAllJobSeekerInFavoriteList"
            element={<ViewAllJobSeekerInFavoriteList />}
          />
          <Route path="/reportPostJob/:id" element={<ReportPostJob />} />
          <Route path="/ManagementCV" element={<ManagementCV />} />

          <Route path="/EditPostJob/:id" element={<EditPostJob />} />
          <Route path="/Payment" element={<PaymentScreen />} />
          <Route
            path="/viewEmployerProfile/:authorId"
            element={<ViewEmployerProfile />}
          />
          <Route path="/viewBlogList" element={<ViewBlogList />} />
          <Route path="/blogDetail/:id" element={<BlogDetail />} />
          <Route path="/viewAllPriceList" element={<ViewAllPriceList />} />
          <Route path="/ReCreateJob/:id" element={<ReCreateJob />} />
          <Route
            path="/viewRecommendedJobs"
            element={<ViewRecommendedJobs />}
          />
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
