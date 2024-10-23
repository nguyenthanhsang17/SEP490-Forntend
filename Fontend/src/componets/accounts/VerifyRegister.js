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

const VerifyRegister = () => {

    const [formData, setFormData] = useState({
        opt: "",
      });
    
      const navigate = useNavigate(); // Khởi tạo useNavigate
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [error, setError] = useState('');
      const [sendmail, setsendmail] = useState(false);
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log(formData);
        try {
          const response = await fetch("https://localhost:7077/api/Users/VerifyCodeRegister", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          const result = await response.json();
    
          if (!response.ok) {
            setError("Xác thực không thành công");
            throw new Error(result.message || "Đăng Ký không thành công");
          }else{
            navigate('/login');
          }
    
          console.log("Đăng ký thành công:", result);
    
          // Lưu token vào localStorage
    
          // Điều hướng đến trang chủ
          navigate('/login'); // Thay '/home' bằng đường dẫn đến trang chủ của bạn
    
        } catch (error) {
          setError(error.message);
          console.error("Lỗi:", error);
        }
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

return(
<div style={styles.body}>
      <div style={styles.wrapper}>
        <a href="/">
          <img src={logoImage} className="img-responsive" alt="Logo" />
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
              <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
            </span>
          </div>
          <div style={{ color: 'red' }} >{error}</div>
          <button style={styles.button} type="submit">
            Xác thực tài Khoản
          </button>
        </form>
      </div>
    </div>
);
};
export default VerifyRegister;