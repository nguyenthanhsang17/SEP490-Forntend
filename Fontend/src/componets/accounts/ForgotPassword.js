import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm trạng thái mới


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
      setErrorMessage("Email không hợp lệ.");
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
        console.log(result.message);
        setEmailVerified(true);
        setEmail(email);
        setErrorMessage('');
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi kiểm tra email:", error);
      setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!code) {
        setErrorMessage("Mã xác thực không được để trống.");
        return;
    }

    if (!validatePassword(password)) {
        setErrorMessage("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.");
        return;
    }

    if (password !== confirmPassword) {
        setErrorMessage("Mật khẩu xác nhận không khớp.");
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
            console.log(result.message);
            setErrorMessage('');
            navigate('/login');
        } else {
            setErrorMessage(result.message);
        }
    } catch (error) {
        console.error("Có lỗi xảy ra khi đặt lại mật khẩu:", error);
        setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
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
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button className="btn btn-login" type="submit">Xác nhận Email</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã xác thực được gửi về email của bạn"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
                
                {/* Password Field */}
                <div className="password-field" style={{ position: "relative", marginBottom: "20px" }}>
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
                    onClick={() => setShowPassword(!showPassword)} // Chỉ thay đổi trạng thái cho trường password
                    style={{
                      position: "absolute",
                      right: "-150px",
                      top: "10%",
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

                {/* Confirm Password Field */}
                <div className="password-field" style={{ position: "relative" }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"} // Sử dụng trạng thái riêng cho confirmPassword
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Chỉ thay đổi trạng thái cho trường confirmPassword
                    style={{
                      position: "absolute",
                      right: "-150px",
                      top: "10%",
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
                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
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
