import React from 'react';
import './App.css'; // If you have a separate CSS file for header styles, import that here

function Header() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><a href="#">Việc làm</a></li>
          <li><a href="#">Hồ sơ & CV</a></li>
          <li><a href="#">Công ty</a></li>
          <li><a href="#">Cẩm nang nghề nghiệp</a></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button>Đăng nhập</button>
        <button>Đăng ký</button>
      </div>
    </header>
  );
}

export default Header;
