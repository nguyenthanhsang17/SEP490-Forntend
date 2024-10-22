import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const loginData = {
      Email: email,
      Password: password,
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

      // Lưu token vào localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('fullName', result.fullName);

      // Điều hướng đến trang chủ
      navigate('/'); // Thay '/home' bằng đường dẫn đến trang chủ của bạn

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
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
