import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Register from './componets/accounts/Register'; // Trang đăng ký
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './componets/accounts/Login';
import ForgotPassword from './componets/accounts/Forgot_Password';
import HomePage from './componets/common/HomePage';
import ViewJobDetail from './componets/jobs/View_Job_Detail'
import Profile from './componets/accounts/Profile';

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
        <Route path="/viewJobDetail" element={<ViewJobDetail />} />
        <Route path="/profile" element={<Profile />} /> {/* Thêm các route khác nếu cần */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
