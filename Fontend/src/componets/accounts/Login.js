import React, { useState } from "react";
import "../assets/css/style.css"; // Import các tệp CSS từ đúng đường dẫn trong src
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg'; // Import banner image từ thư mục đúng
import logoImage from '../assets/img/logo.png'; // Import logo image từ thư mục đúng

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic đăng nhập ở đây
    console.log("Username:", username, "Password:", password);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openRightMenu = () => {
    setIsMenuOpen(true);
  };

  const closeRightMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}> {/* Sửa background image */}
      <div className="wrapper">
        <section className="login-screen-sec">
          <div className="container">
            <div className="login-screen">
              <a href="index-2.html">
                <img src={logoImage} className="img-responsive" alt="Logo" /> {/* Sửa đường dẫn logo */}
              </a>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="btn btn-login" type="submit">
                  Login
                </button>
                <span>
                  You Have No Account? <a href="/register"> Create An Account</a>
                </span>
                <span>
                  <a href="/forgotPassword"> Forgot Password</a>
                </span>
              </form>
            </div>
          </div>
        </section>

        <button className="w3-button w3-teal w3-xlarge w3-right" onClick={openRightMenu}>
          <i className="spin fa fa-cog" aria-hidden="true"></i>
        </button>

        {isMenuOpen && (
          <div className="w3-sidebar w3-bar-block w3-card-2 w3-animate-right" style={{ right: 0 }}>
            <button onClick={closeRightMenu} className="w3-bar-item w3-button w3-large">
              Close &times;
            </button>
            <ul id="styleOptions" title="switch styling">
              <li>
                <a href="javascript: void(0)" className="cl-box blue" data-theme="colors/blue-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box red" data-theme="colors/red-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box purple" data-theme="colors/purple-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box green" data-theme="colors/green-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box dark-red" data-theme="colors/dark-red-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box orange" data-theme="colors/orange-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box sea-blue" data-theme="colors/sea-blue-style"></a>
              </li>
              <li>
                <a href="javascript: void(0)" className="cl-box pink" data-theme="colors/pink-style"></a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
