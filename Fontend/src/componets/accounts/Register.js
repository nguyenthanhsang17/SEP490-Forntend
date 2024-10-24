import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import $ from 'jquery';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate để chuyển trang

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });


  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    console.log(formData);
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
        setError(result.message)
        throw new Error(result.message || "Đăng Ký không thành công");
      }else{
        navigate('/VerifyRegister'); // Thay '/home' bằng đường dẫn đến trang chủ của bạn
      }

      console.log("Đăng ký thành công:", result);

      // Lưu token vào localStorage

      // Điều hướng đến trang chủ
      

    } catch (error) {
      setError(error.message);
      console.error("Lỗi:", error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    

  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'rgba(255, 255, 255, 0.9)', padding: '20px', borderRadius: '8px' }}>
        <a href="/">
          <img src={logoImage} className="img-responsive" alt="Logo" />
        </a>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              style={styles.input}
              name="fullName"
              placeholder="Your Name"
              value={formData.fullName}
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <input
              type="email"
              style={styles.input}
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <div style={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                style={styles.input}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span onClick={togglePasswordVisibility} style={styles.icon}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <div style={styles.passwordInput}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                style={styles.input}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span onClick={toggleConfirmPasswordVisibility} style={styles.icon}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <div style={{ color: 'red' }} >{error}</div>
            <button style={styles.button} type="submit">
              Đăng Ký Tài Khoản
            </button>
          </form>
      </div>
    </div>
  );
};

export default Signup;
