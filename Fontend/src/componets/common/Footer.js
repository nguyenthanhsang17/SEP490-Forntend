import React, { useEffect, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';
import "../assets/css/colors/green-style.css";

class Footer extends React.Component {
  state = {
    isLoggedIn: false
  };

  componentDidMount() {
    // Check if the user is logged in by looking for a token or some indicator
    const token = localStorage.getItem('token'); // Adjust based on your authentication method
    if (token) {
      this.setState({ isLoggedIn: true });
    }
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
      <footer className="footer">
        <div className="row no-padding">
          <div className="container">
            <div className="col-md-8 col-sm-12">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Về VJN</h3>
                <div className="textwidget">
                  <p>Nền tảng tuyển dụng và tìm việc bán thời gian trực tuyến.</p>
                  <p>Đại học fpt, Hòa lạc</p>
                  <p><strong>Email:</strong> quickjobvjn2024@gmail.com</p>
                  <p><strong>Gọi:</strong> <a href="tel:+15555555555">0369354782</a></p>
                  <ul className="footer-social">
                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                    <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                    <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>


            <div className="col-md-4 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Kết Nối Với Chúng Tôi</h3>
                <div className="textwidget">
                  <p><strong>Điện Thoại:</strong> +84 369354782</p>
                  <p><strong>Email:</strong> quickjobvjn2024@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row copyright">
          <div className="container">
            <p><a target="_blank" href="https://www.templateshub.net">2024</a></p>
          </div>
        </div>

        {/* Floating Chat Icon - Only visible if logged in */}
        {isLoggedIn && (
          <div className="floating-icons">
            <a 
              href="/ChatList" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="icon messenger-icon"
            >
              <i className="fa fa-comments"></i> {/* Messenger icon */}
            </a>
          </div>
        )}
      </footer>
    );
  }
}

export default Footer;
