import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/img/Nice Job Logo-Photoroom.png";
import ChangePasswordModal from "../accounts/ChangePasswordModal"; // Assuming you have this component
import { FaBriefcase } from "react-icons/fa";

const styles = {
  wrapper: {
    // Your styles here
  },
  navbar: {
    // Your navbar styles here
  },
  profileButton: {
    marginLeft: "20px",
    padding: "10px 20px",
    backgroundColor: "#4facfe",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    position: "relative",
  },
  dropdown: {
    display: "none",
    position: "absolute",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 1,
  },
  dropdownVisible: {
    display: "block",
  },
  dropdownItem: {
    padding: "10px 15px",
    cursor: "pointer",
  },
  viewJobsLink: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    color: "#333",
    textDecoration: "none",
  },
  icon: {
    marginRight: "5px",
  },
};

const Header = () => {
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  
    const fullName = localStorage.getItem("fullName");
    console.log("fullName:", fullName);
  
    const handleWindowClose = () => {
      localStorage.clear();
    };
  
    window.addEventListener("beforeunload", handleWindowClose);
  
    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  const openChangePassModal = () => {
    setShowChangePassModal(true);
    setDropdownVisible(false);
  };

  const closeChangePassModal = () => {
    setShowChangePassModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setDropdownVisible(false);
    window.location.reload();
  };

  const handleProfileClick = () => {
    setDropdownVisible(false);
    navigate("/profile");
  };

  const handleViewAllJobsClick = () => {
    setDropdownVisible(false);
    navigate("/jobs");
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div style={styles.wrapper}>
      <nav
        style={styles.navbar}
        className="navbar navbar-default navbar-fixed navbar-transparent white bootsnav"
      >
        <div className="container">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target="#navbar-menu"
          >
            <i className="fa fa-bars"></i>
          </button>
          <div
            className="navbar-header"
            style={{ position: "relative", top: "-90px" }}
          >
            <a className="navbar-brand" href="/">
              <img src={logoImage} className="logo logo-display" alt="Logo" />
              <img
                src={logoImage}
                className="logo logo-scrolled"
                alt="Scrolled Logo"
              />
            </a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-menu">
            <ul
              className="nav navbar-nav navbar-right"
              data-in="fadeInDown"
              data-out="fadeOutUp"
            >
              <li>
                <a href="pricing.html">
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
                  Giá
                </a>
              </li>

              {/* New "View All Jobs" link */}
              <li>
                <a 
                  style={styles.viewJobsLink} 
                  onClick={handleViewAllJobsClick}
                  href="/viewalljob"
                >
                  <FaBriefcase style={styles.icon} /> {/* Job icon */}
                  Tất cả các công việc
                </a>
              </li>

              {isLoggedIn ? (
                <li className="left-br">
                  <button style={styles.profileButton} onClick={toggleDropdown}>
                    {localStorage.getItem("fullName") || "Họ và tên"}{/* Display the full name */}
                  </button>
                  <div
                    style={{
                      ...styles.dropdown,
                      ...(dropdownVisible ? styles.dropdownVisible : {}),
                    }}
                  >
                    <div style={styles.dropdownItem} onClick={handleProfileClick}>
                      Hồ sơ của bạn
                    </div>
                    <div
                      style={styles.dropdownItem}
                      onClick={openChangePassModal}
                    >
                      Đổi mật khẩu
                    </div>
                    <div style={styles.dropdownItem} onClick={handleLogout}>
                      Đăng xuất
                    </div>
                  </div>
                </li>
              ) : (
                <li className="left-br">
                  <a
                    href="/login"
                    data-toggle="modal"
                    data-target="#signup"
                    className="signin"
                  >
                    Đăng ký ngay
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <ChangePasswordModal
        show={showChangePassModal}
        handleClose={closeChangePassModal}
      />
      <div className="clearfix"></div>
    </div>
  );
};

export default Header;
