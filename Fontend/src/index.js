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
import ViewAllJobApplied from './componets/employee/View_All_Job_Applied';
import ViewAllJobSeekerApply from './componets/employee/View_All_Jobseeker_Apply';
import ViewJobSeekerDetail from './componets/employee/View_JobSeeker_Detail';
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

// Import PrivateRoute
import PrivateRoute from './PrivateRoute';
import Unauthorized from './componets/common/Unauthorized';
import ViewJobDetailJobSeeker from './componets/employee/ViewDetailJobSeeker';
import ViewAllPostJob from './componets/staff/ViewAllPostJob';
import PostJobDetail from './componets/staff/PostJobDetail'
import EmployerRequests from './componets/staff/ViewEmployerRequest'
import EmployerRequestDetail from './componets/staff/ViewEmployerRequestDetail'
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
          <Route path="/ViewEmployerRequests" element={<EmployerRequests />} />
          <Route path="/ViewEmployerRequestsDetail/:id" element={<EmployerRequestDetail />} />
          

          {/* <Route path='/ViewAllPost' element={<ViewAllPostJob />} />
          <Route path='/ViewDetail/:job_id/:status' element={<PostJobDetail />} /> */}
          <Route
            path="/viewJobDetail/:id"
            element={<ViewJobDetail />}
          />
          {/* Job Seeker-Only Routes */}
          
          <Route
            path="/ViewAllPost"
            element={<PrivateRoute allowedRoles={["3,4"]}><ViewAllPostJob /></PrivateRoute>}
          />

          <Route
            path="/ViewDetail/:job_id/:status"
            element={<PrivateRoute allowedRoles={["3,4"]}><PostJobDetail /></PrivateRoute>}
          />

          <Route
            path="/ViewAllJobApplied"
            element={<PrivateRoute allowedRoles={["1,2"]}><ViewAllJobApplied /></PrivateRoute>}
          />
          <Route
            path="/ApplyJob/:job_id"
            element={<PrivateRoute allowedRoles={["1,2"]}><ApplyJob /></PrivateRoute>}
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
            path="/viewDetailJobSeeker/:id"
            element={<PrivateRoute allowedRoles={["2"]}><ViewJobDetailJobSeeker /></PrivateRoute>}
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
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
