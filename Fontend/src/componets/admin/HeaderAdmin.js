import React from "react";
import { Input, Badge, Avatar, Dropdown, Menu } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Người dùng";

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();
    // Redirect to login page
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="dashboard-header">
      {/* Search Bar */}
      <Input
        className="dashboard-search"
        placeholder="Tìm kiếm"
        prefix={<SearchOutlined />}
      />

      {/* Actions */}
      <div className="dashboard-actions">
        {/* Notification */}
        

        {/* User Dropdown */}
        <Dropdown overlay={menu} trigger={['click']}>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{
                marginLeft: "15px",
                marginRight: "10px",
                backgroundColor: "#87d068",
              }}
            />
            <span>{fullName}</span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
