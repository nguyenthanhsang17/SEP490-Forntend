import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from "../assets/img/banner-10.jpg";
import logoImage from "../assets/img/Nice Job Logo-Photoroom.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Initialize notistack
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không đúng định dạng.";
      }
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else {
      // Kiểm tra mật khẩu với regex
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp.";
    }

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      enqueueSnackbar("Vui lòng kiểm tra thông tin đăng ký!", { variant: "warning" });
      return;
    }

    setErrors({});
    try {
      const response = await fetch("https://localhost:7077/api/Users/ResgisterUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Đăng ký không thành công.");
      }

      enqueueSnackbar("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.", {
        variant: "success",
      });
      navigate("/VerifyRegister");
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      setErrors({ global: error.message });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

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
      display: "flex", // Sử dụng Flexbox
      flexDirection: "column", // Sắp xếp theo cột
      alignItems: "center", // Căn giữa theo chiều ngang
    },
    input: {
      width: "100%",
      marginBottom: "15px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "20px",
    },
    passwordInput: {
      position: "relative", // Đảm bảo icon nằm trong cùng khối với input
      display: "flex", // Sử dụng Flexbox để căn chỉnh
      alignItems: "center", // Căn giữa theo chiều dọc
    },
    icon: {
      position: "absolute",
      top: "50%", // Căn giữa theo chiều dọc
      right: "10px", // Đặt cách lề phải
      transform: "translateY(-50%)", // Đảm bảo chính giữa hoàn hảo
      cursor: "pointer",
      fontSize: "20px", // Kích thước icon
      color: "#333", // Màu icon
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#4facfe",
      color: "#fff",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      marginTop: "8px"
    },
    loginButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#07b107",
      color: "#fff",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      marginTop: "10px",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginBottom: "10px",
    },
    input: {
      width: "100%",
      padding: "10px",
      paddingRight: "40px", // Tạo khoảng trống bên phải cho icon
      border: "1px solid #ccc",
      borderRadius: "20px", // Bo góc
      height: "45px", // Chiều cao cố định
      fontSize: "14px", // Kích thước chữ
      boxSizing: "border-box", // Đảm bảo padding không làm thay đổi kích thước
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <a href="/">
          <img src={logoImage} className="img-responsive" alt="Logo" />
        </a>
        <form onSubmit={handleSubmit}>
          <span>Họ và tên <span style={{ color: "red" }}>(*)</span></span>
          <input
            type="text"
            style={styles.input}
            name="fullName"
            placeholder="Họ và tên"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          {errors.fullName && <div style={styles.error}>{errors.fullName}</div>}
          <span>Email <span style={{ color: "red" }}>(*)</span></span>
          <input
            type="email"
            style={styles.input}
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <div style={styles.error}>{errors.email}</div>}
          <span>Mật khẩu <span style={{ color: "red" }}>(*)</span></span>
          <div style={styles.passwordInput}>
            <input
              type={showPassword ? "text" : "password"}
              style={styles.input}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <span onClick={togglePasswordVisibility} style={styles.icon}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>
          {errors.password && <div style={styles.error}>{errors.password}</div>}
          <span>Xác nhận mật khẩu <span style={{ color: "red" }}>(*)</span></span>
          <div style={styles.passwordInput}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              style={styles.input}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <span onClick={toggleConfirmPasswordVisibility} style={styles.icon}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </span>
          </div>
          {errors.confirmPassword && <div style={styles.error}>{errors.confirmPassword}</div>}
          {errors.global && <div style={styles.error}>{errors.global}</div>}
          <button style={styles.button} type="submit">
            Đăng Ký Tài Khoản
          </button>
          <button style={styles.loginButton} onClick={handleLoginRedirect}>
            Đăng Nhập Ngay
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
