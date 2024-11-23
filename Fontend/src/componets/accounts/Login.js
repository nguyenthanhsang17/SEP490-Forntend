import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null); // Thông báo cảnh báo

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setWarningMessage(null);

    if (!validateEmail(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setIsLoading(true);

    const loginData = {
      userName: email,
      password: password,
    };

    try {
      const response = await fetch("https://localhost:7077/api/Users/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json-patch+json", // Đúng với định dạng API yêu cầu
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      console.log("API Response:", result);

      if (response.status === 401) {
        // Kiểm tra thông điệp trả về
        if (result.message === "Tài khoản của bạn hiện chưa được xác thực.") {
          console.log("Chuyển đến trang xác minh email");
          navigate('/VerifyRegister');
          return;
        } else {
          setError(result.message || "Đăng nhập không thành công");
          return;
        }
      }

      if (!response.ok) {
        throw new Error(result.message || "Đăng nhập không thành công");
      }

      // Đăng nhập thành công
      localStorage.setItem('token', result.token);
      localStorage.setItem('fullName', result.fullName);
      localStorage.setItem('roleId', result.roleId);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('status', result.status);
      localStorage.setItem('haveProfile', result.haveProfile);

      if (result.roleId === 4) {
        navigate('/AdminDashboard');
      }  else if (result.roleId === 3 ){
        navigate('/Bloglist');
      }else {
        navigate('/');
      }

      // Cảnh báo mật khẩu yếu
      if (!validatePassword(password)) {
        setWarningMessage("Mật khẩu của bạn không đáp ứng yêu cầu bảo mật mới. Vui lòng cập nhật mật khẩu.");
      }


    } catch (error) {
      setError(error.message || "Lỗi đăng nhập. Vui lòng kiểm tra lại thông tin.");
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };




  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Logic cho đăng nhập bằng Google
  };

  return (
    <div className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="wrapper">
        <section className="login-screen-sec">
          <div className="container">
            <div className="login-screen">
              <div className="logo-container text-center">
                <a href="/">
                  <img src={logoImage} className="img-responsive logo" alt="Logo" />
                </a>
              </div>
              <form onSubmit={handleLogin} className="login-form">
                {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
                {warningMessage && <div className="warning-message" style={{ color: 'orange' }}>{warningMessage}</div>}
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="password-field" style={{ position: "relative" }}>
                  <label htmlFor="password" className="form-label">Mật khẩu</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Mật khẩu"
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
                      right: "-150px",
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
                <button className="btn btn-login btn-block" type="submit" disabled={isLoading}>
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <span>Hoặc</span>
                <button className="btn btn-google btn-block" type="button" onClick={handleGoogleLogin}>
                  <i className="fa fa-google"></i> Đăng nhập bằng Google
                </button>
                <div className="login-links text-center">
                  <span>Bạn chưa có tài khoản? <a href="/register">Tạo tài khoản</a></span>
                  <span><a href="/forgotPassword">Quên mật khẩu</a></span>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
