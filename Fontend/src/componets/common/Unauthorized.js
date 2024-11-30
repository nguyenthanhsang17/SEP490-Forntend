import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Điều hướng về trang chủ
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button
        onClick={handleBackToHome}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Unauthorized;
