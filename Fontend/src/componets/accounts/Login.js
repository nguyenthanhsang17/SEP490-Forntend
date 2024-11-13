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
  
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError("Email không hợp lệ.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
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
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.Message || "Đăng nhập không thành công");
        }

        console.log("Đăng nhập thành công:", result);

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('fullName', result.fullName);
        localStorage.setItem('roleId', result.roleId);
        localStorage.setItem('userId', result.userId);

        // Điều hướng dựa trên roleId
        if (result.roleId === 4) {
            navigate('/AdminDashboard');
        } else {
            navigate('/'); // Điều hướng đến trang khác nếu không phải Admin
        }

    } catch (error) {
        setError(error.message);
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="password-field" style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: "2.5rem" }} // thêm khoảng trống bên phải
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "-150px",
                      top: "10%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.2rem", // Điều chỉnh kích thước icon cho phù hợp
                      color: "#888" // Màu sắc icon
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
