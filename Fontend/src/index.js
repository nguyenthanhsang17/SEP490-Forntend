import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Register from './componets/accounts/Register'; // Trang đăng ký
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './componets/accounts/Login';
import ForgotPassword from './componets/accounts/ForgotPassword';
import HomePage from './componets/common/HomePage';
import ViewJobDetail from './componets/jobs/ViewJobDetail'
import CreatePostJob from './componets/jobs/CreatePostJob'

import ViewAllJobApplied from './componets/jobs/View_All_Job_Applied';
import ViewAllJobSeekerApply from './componets/jobs/View_All_Jobseeker_Apply';
import ViewJobSeekerDetail from './componets/jobs/View_JobSeeker_Detail';

import ViewListJobsCreated from './componets/jobs/ViewListJobsCreated';
import Profile from './componets/accounts/Profile';
import VerifyRegister from "./componets/accounts/VerifyRegister";
import PostJobs from './componets/jobs/ViewAllPostJob';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Định tuyến đến các trang khác nhau */}
        <Route path="/" element={<HomePage />} /> {/* Trang chính */}
        <Route path="/register" element={<Register />} /> {/* Trang đăng ký */}
        <Route path="/login" element={<Login />} /> {/* Trang đăng nhập*/}
        <Route path="/forgotPassword" element={<ForgotPassword />} /> {/* Trang đăng nhập*/}
        <Route path="/viewJobDetail/:id" element={<ViewJobDetail />} />
        <Route path="/createPostJob" element={<CreatePostJob />} />
        <Route path="/ViewAllJobApplied/:id" element={<ViewAllJobApplied />} />
        <Route path="/ViewAllJobseekerApply/:id" element={<ViewAllJobSeekerApply />} />
        <Route path="/ViewJobSeekerDetail/:id" element={<ViewJobSeekerDetail />} />
        <Route path="/viewListJobsCreated" element={<ViewListJobsCreated/>}/>
        {/* Thêm các route khác nếu cần */}

        <Route path="/profile" element={<Profile />} /> {/* Thêm các route khác nếu cần */}
        <Route path='/VerifyRegister' element={<VerifyRegister/>}/>{/*màn này để verifycode khi đăng ký */}
        <Route path='/viewalljob' element={<PostJobs/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
