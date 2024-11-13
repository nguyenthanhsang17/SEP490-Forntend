import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = parseInt(localStorage.getItem("roleId"), 10); // Lấy role từ localStorage và chuyển thành số

  // Kiểm tra xem userRole có nằm trong danh sách allowedRoles
  const isAuthorized = allowedRoles.includes(userRole);


  return isAuthorized ? children : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
