// src/components/common/Sidebar.js
import React from "react";

const Sidebar = () => {
  const navigateTo = (path) => {
    window.location.href = path; // Điều hướng bằng cách thay đổi URL
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Quản Trị</div>
      <nav className="sidebar-menu">
        <div className="menu-item" onClick={() => navigateTo("/AdminDashboard")}>
          Tổng Quan
        </div>
        <div className="menu-item" onClick={() => navigateTo("/BlogList")}>
          Danh sách bài đăng
        </div>
        <div className="menu-item" onClick={() => navigateTo("/CreateBlog")}>
          Tạo bài đăng mới
        </div>
        <div className="menu-item" onClick={() => navigateTo("/ViewAllHistoryPayment")}>
          Lịch sử giao dịch
        </div>
        <div className="menu-item" onClick={() => navigateTo("/ManageUser")}>
          Quản lý người dùng
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

