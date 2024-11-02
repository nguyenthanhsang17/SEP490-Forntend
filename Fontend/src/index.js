import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import reportWebVitals from './reportWebVitals';

// Import Components
import Register from './componets/accounts/Register';
import Login from './componets/accounts/Login';
import ForgotPassword from './componets/accounts/ForgotPassword';
import HomePage from './componets/common/HomePage';
import ViewJobDetail from './componets/jobseeker/ViewJobDetail';
import CreatePostJob from './componets/employee/CreatePostJob';
import ViewAllJobApplied from './componets/jobseeker/View_All_Job_Applied';
import ViewAllJobSeekerApply from './componets/jobseeker/View_All_Jobseeker_Apply';
import ViewJobSeekerDetail from './componets/jobseeker/View_JobSeeker_Detail';
import ViewJobCreatedDetail from './componets/employee/ViewJobCreatedDetail';
import ViewListJobsCreated from './componets/employee/ViewListJobsCreated';
import Profile from './componets/accounts/Profile';
import VerifyRegister from './componets/accounts/VerifyRegister';
import PostJobs from './componets/jobseeker/ViewAllPostJob';
import ApplyJob from './componets/jobseeker/ApplyJob';
import ScheduleTable from './componets/jobseeker/ScheduleTable';
import MemberCard from './componets/employee/ViewAllJobSeeker';
import VerifyEmployerAccount from './componets/jobseeker/VerifyEmployerAccount';
import ViewAllPostJobInWishlist from './componets/jobseeker/ViewAllPostJobInWishlist';
import ViewAllJobSeekerInFavoriteList from './componets/employee/ViewAllJobSeekerInFavoriteList'

// Import PrivateRoute
import PrivateRoute from './PrivateRoute';
import Unauthorized from './componets/common/Unauthorized';

const root = ReactDOM.createRoot(document.getElementById('root'));

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
          <Route
            path="/viewJobDetail/:id"
            element={<ViewJobDetail />}
          />
          {/* Job Seeker-Only Routes */}
          
          <Route
            path="/ViewAllJobApplied"
            element={<PrivateRoute allowedRoles={["1"]}><ViewAllJobApplied /></PrivateRoute>}
          />
          <Route
            path="/ApplyJob/:job_id"
            element={<PrivateRoute allowedRoles={["1"]}><ApplyJob /></PrivateRoute>}
          />

          {/* Employer-Only Routes */}
          <Route
            path="/createPostJob"
            element={<PrivateRoute allowedRoles={["2"]}><CreatePostJob /></PrivateRoute>}
          />
          <Route
            path="/viewListJobsCreated"
            element={<PrivateRoute allowedRoles={["2"]}><ViewListJobsCreated /></PrivateRoute>}
          />
          <Route
            path="/viewJobCreatedDetail/:id"
            element={<PrivateRoute allowedRoles={["2"]}><ViewJobCreatedDetail /></PrivateRoute>}
          />
          <Route
            path="/viewAllJobSeeker"
            element={<PrivateRoute allowedRoles={["2"]}><MemberCard /></PrivateRoute>}
          />
          <Route
            path="/ViewAllJobseekerApply/:id"
            element={<PrivateRoute allowedRoles={["2"]}><ViewAllJobSeekerApply /></PrivateRoute>}
          />
          <Route
            path="/ViewJobSeekerDetail/:id/:apply_id"
            element={<PrivateRoute allowedRoles={["2"]}><ViewJobSeekerDetail /></PrivateRoute>}
          />
           <Route
            path="/verifyEmployerAccount"
            element={<PrivateRoute allowedRoles={["1"]}><VerifyEmployerAccount /></PrivateRoute>}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/viewAllPostJobInWishlist" element={<ViewAllPostJobInWishlist />} />
          <Route path="/viewAllJobSeekerInFavoriteList" element={<ViewAllJobSeekerInFavoriteList />} />
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
