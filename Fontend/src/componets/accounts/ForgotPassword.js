import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2
import '../assets/css/style.css';
import '../assets/css/colors/green-style.css';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import bannerImage from '../assets/img/banner-2.jpg';


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateEmail(email)) {
      Swal.fire('Error', 'Email không hợp lệ.', 'error');
      return;
    }

    try {
      const response = await fetch('https://localhost:7077/api/Email/SendMailToForgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire('Thành công', 'Mã xác thực đã được gửi về email của bạn.', 'success');
        setEmailVerified(true);
        setEmail(email);
      } else {
        Swal.fire('Error', 'Email của bạn không tồn tại trong hệ thống', 'error');
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi kiểm tra email:", error);
      Swal.fire('Error', 'Đã xảy ra lỗi, vui lòng thử lại!', 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!code) {
      Swal.fire('Error', 'Mã xác thực không được để trống.', 'error');
      return;
    }

    if (!validatePassword(password)) {
      Swal.fire('Error', 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt', 'error');
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire('Error', 'Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    const requestData = {
      toEmail: email,
      opt: code,
      password: password,
      confirmPassword: confirmPassword
    };

    try {
      const response = await fetch('https://localhost:7077/api/Users/VerifycodeForgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire('Thành công', 'Mật khẩu đã được đặt lại thành công!', 'success').then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi đặt lại mật khẩu:", error);
      Swal.fire('Error', 'Đã xảy ra lỗi, vui lòng thử lại!', 'error');
    }
  };

  return (
    <div className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="wrapper">
        <section className="lost-ps-screen-sec">
          <div className="container">
            <div className="lost-ps-screen">
              <a href="/">
                <img src={logoImage} className="img-responsive" alt="Logo" />
              </a>
              {!emailVerified ? (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="email" className="form-label">Email: </label><label style={{ marginLeft: "10px", color: 'red' }}> (*) </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-login" type="submit">Xác nhận Email</button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <label htmlFor="otp" className="form-label">Nhập OTP: </label><label style={{ marginLeft: "10px", color: 'red' }}> (*) </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã xác thực được gửi về email của bạn"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                  <div className="password-field" style={{ position: "relative", marginBottom: "20px" }}>
                    <label htmlFor="password" className="form-label">Mật khẩu mới: </label><label style={{ marginLeft: "10px", color: 'red' }}> (*) </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nhập mật khẩu mới"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <span
                      className="password-toggle-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "-160px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "#888"
                      }}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </span>
                  </div>
                  <div className="password-field" style={{ position: "relative" }}>
                    <label htmlFor="confirmPassword" className="form-label">Nhập lại mật khẩu: </label><label style={{ marginLeft: "10px", color: 'red' }}> (*) </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ paddingRight: "2.5rem" }}
                    />
                    <span
                      className="password-toggle-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "-160px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        color: "#888"
                      }}
                    >
                      {showConfirmPassword ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </span>
                  </div>
                  <button className="btn btn-login" type="submit">Đặt lại mật khẩu</button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;