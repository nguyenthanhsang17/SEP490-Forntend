import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Register from './componets/accounts/Register'; // Trang đăng ký
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './componets/accounts/Login';
import ForgotPassword from './componets/accounts/ForgotPassword';
import HomePage from './componets/common/HomePage';
import ViewJobDetail from './componets/jobs/ViewJobDetail';
import CreatePostJob from './componets/jobs/CreatePostJob';
import ViewAllJobApplied from './componets/jobs/View_All_Job_Applied';
import ViewAllJobSeekerApply from './componets/jobs/View_All_Jobseeker_Apply';
import ViewJobSeekerDetail from './componets/jobs/View_JobSeeker_Detail';
import ViewJobCreatedDetail from './componets/jobs/ViewJobCreatedDetail';
import ViewListJobsCreated from './componets/jobs/ViewListJobsCreated';
import Profile from './componets/accounts/Profile';
import VerifyRegister from "./componets/accounts/VerifyRegister";
import PostJobs from './componets/jobs/ViewAllPostJob';
import ApplyJob from './componets/jobs/ApplyJob';
import ScheduleTable from './componets/jobs/ScheduleTable';
import { SnackbarProvider } from 'notistack'; // Import SnackbarProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3}> {/* Wrap your application with SnackbarProvider */}
        <Routes>
          {/* Định tuyến đến các trang khác nhau */}
          <Route path="/" element={<HomePage />} /> {/* Trang chính */}
          <Route path="/register" element={<Register />} /> {/* Trang đăng ký */}
          <Route path="/login" element={<Login />} /> {/* Trang đăng nhập*/}
          <Route path="/forgotPassword" element={<ForgotPassword />} /> {/* Trang quên mật khẩu */}
          <Route path="/viewJobDetail/:id" element={<ViewJobDetail />} />
          <Route path="/createPostJob" element={<CreatePostJob />} />
          <Route path="/ViewAllJobApplied" element={<ViewAllJobApplied />} />  {/* Xem danh sách các công việc đã ứng tuyển*/}
          <Route path="/ViewAllJobseekerApply/:id" element={<ViewAllJobSeekerApply />} /> {/* Xem danh sách các ứng viên đã ứng tuyển*/}
          <Route path="/ViewJobSeekerDetail/:id/:apply_id" element={<ViewJobSeekerDetail />} /> {/* Xem chi tiết ứng viên đã ứng tuyển*/}
          <Route path="/viewListJobsCreated" element={<ViewListJobsCreated />} />
          <Route path="/viewJobCreatedDetail/:id" element={<ViewJobCreatedDetail />} />
          <Route path="/ApplyJob/:job_id" element={<ApplyJob />} />
          {/* Thêm các route khác nếu cần */}
          <Route path="/profile" element={<Profile />} /> {/* Thêm các route khác nếu cần */}
          <Route path='/VerifyRegister' element={<VerifyRegister />} /> {/* Màn này để verify code khi đăng ký */}
          <Route path='/viewalljob' element={<PostJobs />} />
          <Route path='/lich' element={<ScheduleTable />} />
        </Routes>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();