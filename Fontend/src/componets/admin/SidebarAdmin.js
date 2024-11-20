// src/components/common/Sidebar.js
import React from "react";

const Sidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">Quản Trị</div>
      <nav className="sidebar-menu">
        <div className="menu-item active">Tổng Quan</div>
        <div className="menu-item">Công Việc</div>
        <div className="menu-item">Ứng Tuyển</div>
        <div className="menu-item">Báo Cáo</div>
      </nav>
    </aside>
  );
};

export default Sidebar;
