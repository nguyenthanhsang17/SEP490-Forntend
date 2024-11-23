import React from "react";

const Sidebar = () => {
  const navigateTo = (path) => {
    window.location.href = path; // Điều hướng bằng cách thay đổi URL
  };

  const roleId = localStorage.getItem("roleId"); // Lấy roleId từ localStorage

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Quản Trị</div>
      <nav className="sidebar-menu">


        {(roleId === "4") && (
          <div className="menu-item" onClick={() => navigateTo("/AdminDashboard")}>
            Tổng Quan
          </div>
        )}

        {(roleId === "3" ) && (
          <div className="menu-item" onClick={() => navigateTo("/BlogList")}>
            Danh sách bài đăng
          </div>
        )}

        {(roleId === "3") && (
          <div className="menu-item" onClick={() => navigateTo("/CreateBlog")}>
            Tạo bài đăng mới
          </div>
        )}

        {roleId === "4" && (
          <div className="menu-item" onClick={() => navigateTo("/ViewAllHistoryPayment")}>
            Lịch sử giao dịch
          </div>
        )}

        {roleId === "4" && (
          <div className="menu-item" onClick={() => navigateTo("/ManageUser")}>
            Quản lý người dùng
          </div>
        )}


        {(roleId === "3" ) && (
          <div className="menu-item" onClick={() => navigateTo("/ViewAllPost")}>
            Danh sách công việc 
          </div>
        )}

        {(roleId === "3" ) && (
          <div className="menu-item" onClick={() => navigateTo("/ViewEmployerRequests")}>
            Yêu cầu trở thành nhà tuyển dụng
          </div>
        )}

      </nav>
    </aside>
  );
};

export default Sidebar;
