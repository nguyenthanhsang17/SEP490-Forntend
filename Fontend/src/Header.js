import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import './App.css';

function Header() {
  return (
    <header className="navbar">
      <div className="logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <nav>
        <ul>
          <li><Link to="/jobs">Việc làm</Link></li>
          <li><Link to="/profile">Hồ sơ & CV</Link></li>
          <li><Link to="/companies">Công ty</Link></li>
          <li><Link to="/career-guide">Cẩm nang nghề nghiệp</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button>Đăng nhập</button>
        <Link to="/register">
          <button>Đăng ký</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
