import React, { useState, useEffect } from "react";
import $ from 'jquery';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Ensure jQuery is initialized correctly
    if (typeof $.fn.styleSwitcher === "function") {
      $('#styleOptions').styleSwitcher();
    } else {
      console.error("styleSwitcher is not defined");
    }
  }, []);

  return (
    <body className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="wrapper">
        <section className="signup-screen-sec">
          <div className="container">
            <div className="signup-screen">
              <a href="/">
                <img src={logoImage} className="img-responsive" alt="Logo" />
              </a>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button className="btn btn-login" type="submit">
                  Đăng Ký
                </button>
                <span>
                  Have You Account? <a href="/login">Login</a>
                </span>
              </form>
            </div>
          </div>
        </section>
      </div>
    </body>
  );
};

export default Signup;
