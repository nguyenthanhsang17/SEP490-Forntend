import React, { useState } from "react";
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Username:", username, "Password:", password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Logic for Google login here
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-login btn-block" type="submit">
                  Đăng nhập
                </button>
                <span>OR</span>
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
