import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/img/Nice Job Logo-Photoroom.png";
import ChangePasswordModal from "../accounts/ChangePasswordModal"; // Assuming you have this component
import {
  FaBriefcase,
  FaBlog,
  FaHeart,
  FaList,
  FaUsers,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const styles = {
  wrapper: {
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    position: "relative",
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
    transition: "background-color 0.3s ease",
  },
  profileButtonHover: {
    backgroundColor: "#3b8ddb",
  },
  dropdown: {
    display: "none",
    position: "absolute",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
    zIndex: 1,
    borderRadius: "5px",
    top: "100%",
    left: "0",
    width: "200px",
    padding: "10px 0",
  },
  dropdownVisible: {
    display: "block",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center", // Căn giữa theo chiều dọc
    justifyContent: "flex-start", // Canh trái cho nội dung
    textDecoration: "none",
    padding: "10px 20px", // Khoảng cách trong các mục
    color: "#333", // Màu chữ
    fontSize: "14px",
    width: "100%", // Đảm bảo chiếm toàn bộ chiều rộng
    boxSizing: "border-box", // Bao gồm padding trong kích thước
  },
  dropdownItemHover: {
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  viewJobsLink: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    color: "#333",
    textDecoration: "none",
    transition: "color 0.3s ease",
    position: "relative",
  },
  viewJobsLinkHover: {
    color: "#4facfe",
  },
  icon: {
    marginRight: "10px", // Khoảng cách giữa icon và chữ
    fontSize: "16px", // Đảm bảo icon đều kích thước
  },
  dropdownMenu: {
    display: "none",
    position: "absolute",
    top: "100%",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "10px 0",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
    borderRadius: "5px",
    width: "200px",
  },
  dropdownMenuHover: {
    display: "block",
  },
};

const Header = () => {
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [roleId, setRoleId] = useState(null); // Add state for role_id
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fullName = localStorage.getItem("fullName");
    const role = localStorage.getItem("roleId"); // Retrieve role_id from local storage
    setRoleId(role); // Store role_id in state
    console.log("roleId:", role); // Kiểm tra giá trị roleId
    console.log("fullName:", fullName);

    const handleWindowClose = () => {
      // localStorage.clear();
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
    localStorage.removeItem("fullName");
    localStorage.removeItem("roleId");
    setIsLoggedIn(false);
    setDropdownVisible(false);
    navigate("/login"); // Redirect to login page after logout
  };

  const handleProfileClick = () => {
    setDropdownVisible(false);
    navigate("/profile");
  };

  const handleViewAllJobsClick = () => {
    setDropdownVisible(false);
    navigate("/viewBlogList");
  };

  const handleViewListCreatedClick = () => {
    setDropdownVisible(false);
    navigate("/viewListJobsCreated");
  };

  const handleViewListAppliedClick = () => {
    setDropdownVisible(false);
    navigate("/ViewAllJobApplied");
  };

  const handleViewAllCandidatesClick = () => {
    setDropdownVisible(false);
    navigate("/viewAllJobSeeker"); // Adjust the route as necessary
  };

  const handleManageAllPostJob = () => {
    setDropdownVisible(false);
    navigate("/ViewAllPost"); // Adjust the route as necessary
  };

  const handleRequestEmployer = () => {
    setDropdownVisible(false);
    navigate("/ViewEmployerRequests"); 
  };

  const handleViewhistoryPayment = () => {
    setDropdownVisible(false);
    navigate("/ViewHistoryPayment"); 
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
            style={{ position: "relative", top: "-93px" }}
          >
            <a className="navbar-brand" href="/">
              <img src={logoImage} className="logo logo-display" alt="Logo" />
              <img
                src={logoImage}
                className="logo logo-scrolled"
                alt="Scrolled Logo"
                style={{ marginTop: "40px" }}
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
                <a
                  style={styles.viewJobsLink}
                  onClick={handleViewAllJobsClick}
                  href="/viewAllPriceList"
                >
                  <FaList style={styles.icon} /> Bảng giá dịch vụ
                </a>
              </li>
              <li>
                <a
                  style={styles.viewJobsLink}
                  onClick={handleViewAllJobsClick}
                  href="/viewBlogList"
                >
                  <FaBlog style={styles.icon} /> Blog
                </a>
              </li>
              {/* Tất cả các công việc với dropdown */}
              <li
                className="dropdown"
                onMouseEnter={(e) =>
                  (e.currentTarget.querySelector(
                    ".dropdown-menu"
                  ).style.display = "block")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.querySelector(
                    ".dropdown-menu"
                  ).style.display = "none")
                }
              >
                <a style={styles.viewJobsLink} href="/viewalljob">
                  <FaBriefcase style={styles.icon} /> Tất cả các công việc
                </a>
                <ul className="dropdown-menu" style={styles.dropdownMenu}>
                  <li>
                    <a
                      style={styles.dropdownItem}
                      onClick={() => navigate("/viewAllPostJobInWishlist")}
                    >
                      <FaHeart style={styles.icon} /> Công việc yêu thích
                    </a>
                  </li>
                  <li>
                    <a
                      style={styles.dropdownItem}
                      onClick={() => navigate("/viewRecommendedJobs")}
                    >
                      <FaStar style={styles.icon} /> Công việc đề xuất
                    </a>
                  </li>
                </ul>
              </li>

              {/* Tất cả ứng viên với dropdown */}
              {roleId === "2" && (
                <li
                  className="dropdown"
                  onMouseEnter={(e) =>
                    (e.currentTarget.querySelector(
                      ".dropdown-menu"
                    ).style.display = "block")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.querySelector(
                      ".dropdown-menu"
                    ).style.display = "none")
                  }
                >
                  <a style={styles.viewJobsLink} href="/viewAllJobSeeker">
                    <FaUsers style={styles.icon} /> Tất cả ứng viên
                  </a>
                  <ul className="dropdown-menu" style={styles.dropdownMenu}>
                    <li>
                      <a
                        style={styles.dropdownItem}
                        onClick={() =>
                          navigate("/viewAllJobSeekerInFavoriteList")
                        }
                      >
                        <FaList style={styles.icon} /> Ứng viên ưa thích
                      </a>
                    </li>
                  </ul>
                </li>
              )}

              {/* Dropdown với tên người dùng */}
              {isLoggedIn ? (
                <li className="left-br">
                  <button style={styles.profileButton} onClick={toggleDropdown}>
                    {localStorage.getItem("fullName") || "Họ và tên"}
                  </button>
                  <div
                    style={{
                      ...styles.dropdown,
                      ...(dropdownVisible ? styles.dropdownVisible : {}),
                    }}
                  >
                    <div
                      style={styles.dropdownItem}
                      onClick={handleProfileClick} 
                    >
                      Hồ sơ của bạn
                    </div>


                    {roleId === "2" && (
                      <div
                      style={styles.dropdownItem}
                      onClick={handleViewhistoryPayment} 
                    >
                      Xem lịch sử mua gói
                    </div>
                    )}

                    {roleId === "2" && (
                      <div
                        style={styles.dropdownItem}
                        onClick={handleViewListCreatedClick}
                      >
                        Danh sách công việc đã tạo
                      </div>
                    )}
                    {roleId === "1" && (
                      <div
                        style={styles.dropdownItem}
                        onClick={handleViewListAppliedClick}
                      >
                        Danh sách công việc đã ứng tuyển
                      </div>
                    )}
                    {roleId === "3" && (
                      <div
                        style={styles.dropdownItem}
                        onClick={handleManageAllPostJob}
                      >
                        Xem tất cả bài đăng
                      </div>
                    )}

                    {roleId === "3" && (
                      <div
                        style={styles.dropdownItem}
                        onClick={handleRequestEmployer}
                      >
                        Xem các yêu cầu trở thành nhà tuyển dụng
                      </div>
                    )}

                    <div
                      style={styles.dropdownItem}
                      onClick={openChangePassModal}
                    >
                      Đổi mật khẩu
                    </div>

                    {/* Thêm Wishlist và Favorite List vào dropdown */}

                    <div style={styles.dropdownItem} onClick={handleLogout}>
                      Đăng xuất
                    </div>
                  </div>
                </li>
              ) : (
                <li className="left-br">
                  <Link to="/login" className="signin">
                    Đăng Nhập Ngay
                  </Link>
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
