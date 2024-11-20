// src/components/common/Header.js
import React from "react";
import { Input, Badge, Avatar } from "antd";
import { SearchOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";

const Header = () => {
  return (
    <header className="dashboard-header">
      <Input
        className="dashboard-search"
        placeholder="Tìm kiếm"
        prefix={<SearchOutlined />}
      />
      <div className="dashboard-actions">
        <Badge count={2}>
          <BellOutlined className="dashboard-icon" />
        </Badge>
        <Avatar
          size="large"
          icon={<UserOutlined />}
          style={{ marginLeft: "15px", backgroundColor: "#87d068" }}
        />
      </div>
    </header>
  );
};

export default Header;
