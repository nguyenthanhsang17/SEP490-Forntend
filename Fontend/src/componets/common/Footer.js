import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "../assets/css/colors/green-style.css";

class Footer extends React.Component {
  state = {
    isLoggedIn: false,
    showChatList: false, // Kiểm tra roleId
  };

  componentDidMount() {
    const token = localStorage.getItem("token"); // Token kiểm tra đăng nhập
    const roleId = localStorage.getItem("roleId"); // Lấy roleId từ localStorage

    // Kiểm tra nếu người dùng đăng nhập và roleId hợp lệ
    if (token) {
      this.setState({ isLoggedIn: true });
    }

    // Hiển thị ChatList chỉ khi roleId là 1 hoặc 2
    if (roleId === "1" || roleId === "2") {
      this.setState({ showChatList: true });
    }
  }

  render() {
    const { isLoggedIn, showChatList } = this.state;

    return (
      <footer className="footer">
        <div className="row no-padding">
          <div className="container">
            <div className="col-md-8 col-sm-12">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Về VJN</h3>
                <div className="textwidget">
                  <p>Nền tảng tuyển dụng và tìm việc bán thời gian trực tuyến.</p>
                  <p>Đại học FPT, Hòa Lạc</p>
                  <p>
                    <strong>Email:</strong> quickjobvjn2024@gmail.com
                  </p>
                  <p>
                    <strong>Điện Thoại:</strong>{" "}
                    <a href="tel:+15555555555">0369354782</a>
                  </p>
                  <ul className="footer-social">
                    <li>
                      <a href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Kết Nối Với Chúng Tôi</h3>
                <div className="textwidget">
                  <p>
                    <strong>Điện Thoại:</strong> +84 369354782
                  </p>
                  <p>
                    <strong>Email:</strong> quickjobvjn2024@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row copyright">
          <div className="container">
            <p>
              <a target="_blank" href="https://www.templateshub.net">
                2024
              </a>
            </p>
          </div>
        </div>

        {/* Floating Chat Icon - Visible only for roleId 1 or 2 */}
        {isLoggedIn && showChatList && (
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
