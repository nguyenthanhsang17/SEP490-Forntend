import React, { useState, useEffect } from "react";
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false); // Trạng thái xác thực email
  const [verificationCode, setVerificationCode] = useState(''); // Quản lý mã xác thực
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // Điều hướng trang

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

    try {
      // Gửi dữ liệu đăng ký tới API
      const response = await fetch('https://localhost:7077/api/Auth/Register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Đăng ký thất bại!');
      }

      // Sau khi đăng ký thành công, yêu cầu người dùng nhập mã xác thực email
      setIsEmailVerified(true);

    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      // Gửi mã xác thực tới API
      const response = await fetch(`https://localhost:7077/api/Email/VerifyCode?code=${encodeURIComponent(verificationCode)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Mã xác thực không hợp lệ hoặc đã hết hạn.');
      }

      // Xác thực thành công, chuyển về màn hình đăng nhập
      alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      navigate('/login'); // Chuyển đến trang đăng nhập

    } catch (error) {
      console.error("Error during email verification:", error);
      setErrorMessage("Xác thực email thất bại, vui lòng thử lại.");
    }
  };

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

        {!isEmailVerified ? (
          // Form đăng ký
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              style={{ marginBottom: '15px' }}
            />
            <div className="password-input" style={{ position: 'relative', marginBottom: '15px' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span onClick={togglePasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', cursor: 'pointer', transform: 'translateY(-50%)' }}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <div className="password-input" style={{ position: 'relative', marginBottom: '15px' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span onClick={toggleConfirmPasswordVisibility} style={{ position: 'absolute', right: '10px', top: '50%', cursor: 'pointer', transform: 'translateY(-50%)' }}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <button type="submit" className="btn btn-login" style={{ width: '100%' }}>Đăng Ký</button>
            {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
          </form>
        ) : (
          // Form xác thực email
          <form onSubmit={handleVerifyEmail}>
            <h3>Nhập mã xác thực</h3>
            <input
              type="text"
              className="form-control"
              name="verificationCode"
              placeholder="Nhập mã xác thực"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={{ marginBottom: '15px' }}
            />
            <button type="submit" className="btn btn-login" style={{ width: '100%' }}>Xác thực Email</button>
            {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
