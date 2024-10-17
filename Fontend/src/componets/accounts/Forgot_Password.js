import React, { useState } from 'react';
import '../assets/css/style.css'; // Custom CSS
import '../assets/css/colors/green-style.css'; // Theme CSS
import logoImage from '../assets/img/logo.png'; // Logo image import
import bannerImage from '../assets/img/banner-10.jpg'; // Background image import

function ForgotPassword() {
  const [email, setEmail] = useState(''); // State for managing email input
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for managing menu visibility

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submit logic here
    console.log("Email submitted:", email);
  };

  const openRightMenu = () => {
    setIsMenuOpen(true);
  };

  const closeRightMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="wrapper">
        <section className="lost-ps-screen-sec">
          <div className="container">
            <div className="lost-ps-screen">
              <a href="/">
                <img src={logoImage} className="img-responsive" alt="Logo" />
              </a>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <button className="btn btn-login" type="submit">Submit</button>
              </form>
            </div>
          </div>
        </section>

        {/* Toggle button for settings menu */}
        <button className="w3-button w3-teal w3-xlarge w3-right" onClick={openRightMenu}>
          <i className="spin fa fa-cog" aria-hidden="true"></i>
        </button>

        {/* Right sidebar menu */}
        {isMenuOpen && (
          <div className="w3-sidebar w3-bar-block w3-card-2 w3-animate-right" style={{ right: 0 }}>
            <button onClick={closeRightMenu} className="w3-bar-item w3-button w3-large">Close &times;</button>
            <ul id="styleOptions" title="switch styling">
              <li>
                <a href="javascript:void(0)" className="cl-box blue" data-theme="colors/blue-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box red" data-theme="colors/red-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box purple" data-theme="colors/purple-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box green" data-theme="colors/green-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box dark-red" data-theme="colors/dark-red-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box orange" data-theme="colors/orange-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box sea-blue" data-theme="colors/sea-blue-style"></a>
              </li>
              <li>
                <a href="javascript:void(0)" className="cl-box pink" data-theme="colors/pink-style"></a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
