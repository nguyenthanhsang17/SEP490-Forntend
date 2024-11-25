import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import $ from "jquery";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from "../assets/img/banner-10.jpg";
import logoImage from "../assets/img/Nice Job Logo-Photoroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const VerifyRegister = () => {
  const [formData, setFormData] = useState({
    opt: "",
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://localhost:7077/api/Users/VerifyCodeRegister",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        enqueueSnackbar("Xác thực không thành công. Vui lòng thử lại.", {
          variant: "error",
        });
        throw new Error(result.message || "Xác thực không thành công.");
      }

      enqueueSnackbar("Xác thực thành công! Bạn có thể đăng nhập ngay.", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      console.error("Lỗi:", error);
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    if (typeof $.fn.styleSwitcher === "function") {
      $("#styleOptions").styleSwitcher();
    } else {
      console.error("styleSwitcher is not defined");
    }
  }, []);

  const styles = {
    body: {
      backgroundImage: `url(${bannerImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    wrapper: {
      width: "100%",
      maxWidth: "400px",
      margin: "0 auto",
      background: "rgba(255, 255, 255, 0.9)",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: "10px",
      paddingRight: "40px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      boxSizing: "border-box",
    },

    swordInput: {
      position: "relative",
      width: "100%",
    },
    icon: {
      position: "absolute",
      top: "50%",
      right: "10px",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#888",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#4caf50", // Màu xanh lá cây
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginTop: "8px",
    },
    passwordInput: {
      position: "relative",
      width: "100%",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <a href="">
          <img
            src={logoImage}
            className="img-responsive"
            alt="Logo"
            style={{ marginBottom: "20px" }}
          />
        </a>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.passwordInput}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              style={styles.input}
              name="opt"
              placeholder="Nhập Code"
              value={formData.opt}
              onChange={handleChange}
            />
            <span onClick={toggleConfirmPasswordVisibility} style={styles.icon}>
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
              />
            </span>
          </div>
          <span
          style={{
            color: "#4caf50",
            fontWeight: "bold",
            display: "block",
            textAlign: "left",
            marginBottom: "15px",
            fontSize: "13px",
          }}
        >
          Kiểm tra code được gửi đến email của bạn
        </span>
          <button style={styles.button} type="submit">
            Xác thực tài Khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyRegister;
