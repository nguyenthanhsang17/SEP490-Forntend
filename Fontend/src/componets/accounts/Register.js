import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp.");
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
        setError(result.message);
        throw new Error(result.message || "Đăng Ký không thành công");
      } else {
        setError(''); // Clear any previous error message
        setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
        navigate('/VerifyRegister');
      }
  
      console.log("Đăng ký thành công:", result);
  
    } catch (error) {
      setSuccessMessage(''); // Clear success message if there's an error
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
            name="fullName"
            placeholder="Your Name"
            value={formData.fullName}
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
  
          {/* Error message */}
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {/* Success message */}
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
  
          <button style={styles.button} type="submit">
            Đăng Ký Tài Khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;