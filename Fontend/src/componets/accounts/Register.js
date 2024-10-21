import React, { useState, useEffect } from "react";
import $ from 'jquery';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Thêm FontAwesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Icon hiện/ẩn mật khẩu
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    console.log("Form submitted:", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (typeof $.fn.styleSwitcher === "function") {
      $('#styleOptions').styleSwitcher();
    } else {
      console.error("styleSwitcher is not defined");
    }
  }, []);

  const styles = {
    body: {
      backgroundImage: `url(${bannerImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    wrapper: {
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    input: {
      width: '100%',
      marginBottom: '15px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    passwordInput: {
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      top: '50%',
      right: '10px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#4facfe',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonHover: {
      backgroundColor: '#3a8fdd',
    },
    link: {
      display: 'block',
      marginTop: '10px',
      textAlign: 'center',
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.wrapper}>
        <a href="/">
          <img src={logoImage} className="img-responsive" alt="Logo" />
        </a>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            style={styles.input}
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            style={styles.input}
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
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
          <button style={styles.button} type="submit">
            Đăng Ký
          </button>
          <span style={styles.link}>
            Have You Account? <a href="/login">Login</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
