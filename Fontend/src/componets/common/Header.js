import React, { useState, useEffect } from 'react';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
const styles = {
  wrapper: {
    // Styles for wrapper
  },
  navbar: {
    // Styles for navbar
  },
  modal: {
    display: 'flex',
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    width: '90%',
    maxWidth: '400px',
    animation: 'slideIn 0.3s',
  },
  title: {
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  primaryButton: {
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  passwordStrength: {
    height: '5px',
    marginTop: '10px',
    borderRadius: '5px',
    transition: 'width 0.3s',
  },
  togglePassword: {
    position: 'absolute',
    right: '10px',
    top: '38px',
    cursor: 'pointer',
    color: '#999',
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes slideIn': {
    from: { transform: 'translateY(-50px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
};

const ChangePasswordModal = ({ show, handleClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show]);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      console.log('Password changed successfully');
      handleClose();
    } else {
      console.error('Passwords do not match');
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 6) strength += 20;
    if (password.match(/[a-z]+/)) strength += 20;
    if (password.match(/[A-Z]+/)) strength += 20;
    if (password.match(/[0-9]+/)) strength += 20;
    if (password.match(/[$@#&!]+/)) strength += 20;
    setPasswordStrength(strength);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!show) {
    return null;
  }

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="old-password">Mật Khẩu Cũ</label>
            <input
              style={styles.input}
              type={showOldPassword ? "text" : "password"}
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span style={styles.togglePassword} onClick={toggleOldPasswordVisibility}>
              {showOldPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="new-password">Mật Khẩu Mới</label>
            <input
              style={styles.input}
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <span style={styles.togglePassword} onClick={toggleNewPasswordVisibility}>
              {showNewPassword ? "🙈" : "👁️"}
            </span>
            <div style={{ ...styles.passwordStrength, width: `${passwordStrength}%`, backgroundColor: `hsl(${passwordStrength}, 100%, 50%)` }}></div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirm-password">Xác Nhận Lại Mật Khẩu</label>
            <input
              style={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span style={styles.togglePassword} onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={handleClose}>Hủy</button>
            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Đổi Mật Khẩu</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Header = () => {
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  const openChangePassModal = () => {
    setShowChangePassModal(true);
  };

  const closeChangePassModal = () => {
    setShowChangePassModal(false);
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
    <img
      src={logoImage}
      className="logo logo-display"
      alt="Logo"
    />
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
                  Pricing
                </a>
              </li>
              <li class="left-br">
                <a href="/login" data-toggle="modal" data-target="#signup" class="signin">Sign In Now</a>
              </li>
            </ul>
            <ul
              className="nav navbar-nav navbar-right"
              data-in="fadeInDown"
              data-out="fadeOutUp"
            >
              <li className="dropdown megamenu-fw">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  Browse
                </a>
                <ul className="dropdown-menu megamenu-content" role="menu">
                  <li>
                    <div className="row">
                      <div className="col-menu col-md-3">
                        <h6 className="title">Main Pages</h6>
                        <div className="content">
                          <ul className="menu-col">
                            <li><a href="index-2.html">Home Page 1</a></li>
                            <li><a href="index-3.html">Home Page 2</a></li>
                            <li><a href="index-4.html">Home Page 3</a></li>
                            <li><a href="index-5.html">Home Page 4</a></li>
                            <li><a href="index-6.html">Home Page 5</a></li>
                            <li><a href="freelancing.html">Freelancing</a></li>
                            <li><a href="signin-signup.html">Sign In / Sign Up</a></li>
                            <li><a href="search-job.html">Search Job</a></li>
                            <li><a href="accordion.html">Accordion</a></li>
                            <li><a href="tab.html">Tab Style</a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-menu col-md-3">
                        <h6 className="title">For Candidate</h6>
                        <div className="content">
                          <ul className="menu-col">
                            <li><a href="browse-jobs.html">Browse Jobs</a></li>
                            <li><a href="browse-company.html">Browse Companies</a></li>
                            <li><a href="create-resume.html">Create Resume</a></li>
                            <li><a href="resume-detail.html">Resume Detail</a></li>
                            <li><a href="#">Manage Jobs</a></li>
                            <li><a href="job-detail.html">Job Detail</a></li>
                            <li><a href="browse-jobs-grid.html">Job In Grid</a></li>
                            <li><a href="candidate-profile.html">Candidate Profile</a></li>
                            <li><a href="manage-resume-2.html">Manage Resume 2</a></li>
                            <li><a href="company-detail.html">Company Detail</a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-menu col-md-3">
                        <h6 className="title">For Employer</h6>
                        <div className="content">
                          <ul className="menu-col">
                            <li><a href="create-job.html">Create Job</a></li>
                            <li><a href="create-company.html">Create Company</a></li>
                            <li><a href="manage-company.html">Manage Company</a></li>
                            <li><a href="manage-candidate.html">Manage Candidate</a></li>
                            <li><a href="manage-employee.html">Manage Employee</a></li>
                            <li><a href="browse-resume.html">Browse Resume</a></li>
                            <li><a href="search-new.html">New Search Job</a></li>
                            <li><a href="employer-profile.html">Employer Profile</a></li>
                            <li><a href="manage-resume.html">Manage Resume</a></li>
                            <li><a href="new-job-detail.html">New Job Detail</a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-menu col-md-3">
                        <h6 className="title">
                          Extra Pages <span className="new-offer">New</span>
                        </h6>
                        <div className="content">
                          <ul className="menu-col">
                            <li><a href="freelancer-detail.html">Freelancer detail</a></li>
                            <li><a href="job-apply-detail.html">New Apply Job</a></li>
                            <li><a href="payment-methode.html">Payment Methode</a></li>
                            <li><a href="new-login-signup.html">New LogIn / SignUp</a></li>
                            <li><a href="freelancing-jobs.html">Freelancing Jobs</a></li>
                            <li><a href="freelancers.html">Freelancers</a></li>
                            <li><a href="freelancers-2.html">Freelancers 2</a></li>
                            <li><a href="premium-candidate.html">Premium Candidate</a></li>
                            <li><a href="premium-candidate-detail.html">Premium Candidate Detail</a></li>
                            <li><a href="blog-detail.html">Blog detail</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <a href="blog.html">Blog</a>
              </li>
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