import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import ChangePasswordModal from '../accounts/ChangePasswordModal'; // Assuming you have this component

const styles = {
  wrapper: {
    // Your styles here
  },
  navbar: {
    // Your navbar styles here
  },
  profileButton: {
    marginLeft: '20px',
    padding: '10px 20px',
    backgroundColor: '#4facfe',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'relative',
  },
  dropdown: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  dropdownVisible: {
    display: 'block',
  },
  dropdownItem: {
    padding: '10px 15px',
    cursor: 'pointer',
  },
};

const Header = () => {
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check if token exists
    setIsLoggedIn(!!token); // Set login state based on token existence
  }, []);

  const openChangePassModal = () => {
    setShowChangePassModal(true);
    setDropdownVisible(false); // Close dropdown when opening modal
  };

  const closeChangePassModal = () => {
    setShowChangePassModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    setIsLoggedIn(false); // Set login state to false
    setDropdownVisible(false); // Close dropdown on logout
    window.location.reload(); // Reload the page
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div style={styles.wrapper}>
      <nav style={styles.navbar} className="navbar navbar-default navbar-fixed navbar-transparent white bootsnav">
        <div className="container">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target="#navbar-menu"
          >
            <i className="fa fa-bars"></i>
          </button>
          <div className="navbar-header" style={{ position: 'relative', top: '-90px' }}>
            <a className="navbar-brand" href="#">
              <img src={logoImage} className="logo logo-display" alt="Logo" />
              <img src={logoImage} className="logo logo-scrolled" alt="Scrolled Logo" />
            </a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-menu">
            <ul className="nav navbar-nav navbar-right" data-in="fadeInDown" data-out="fadeOutUp">
              <li>
                <a href="pricing.html">
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
                  Pricing
                </a>
              </li>

              {isLoggedIn ? (
                <li className="left-br">
                  <button
                    style={styles.profileButton}
                    onClick={toggleDropdown}
                  >
                    Your Profile
                  </button>
                  <div style={{ ...styles.dropdown, ...(dropdownVisible ? styles.dropdownVisible : {}) }}>
                    <div
                      style={styles.dropdownItem}
                      onClick={openChangePassModal}
                    >
                      Change Password
                    </div>
                    <div
                      style={styles.dropdownItem}
                      onClick={handleLogout}
                    >
                      Log Out
                    </div>
                  </div>
                </li>
              ) : (
                <li className="left-br">
                  <a href="/login" data-toggle="modal" data-target="#signup" className="signin">
                    Sign In Now
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <ChangePasswordModal show={showChangePassModal} handleClose={closeChangePassModal} />
      <div className="clearfix"></div>
    </div>
  );
};

export default Header;
