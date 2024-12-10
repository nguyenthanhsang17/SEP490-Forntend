import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "../assets/css/colors/green-style.css";

class Footer extends React.Component {
  state = {
    isLoggedIn: false,
    showChatList: false, // Kiểm tra roleId
    unreadMessages: 0, // Số lượng tin nhắn chưa đọc
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

    // Kết nối WebSocket để theo dõi tin nhắn mới
    this.connectWebSocket();
  }

  connectWebSocket = () => {
    const socket = new WebSocket("wss://localhost:7077/ws/chat");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      // Kiểm tra nếu tin nhắn thuộc chat hiện tại
      const isCurrentChat =
        data.chatId === parseInt(localStorage.getItem("currentChatId")); // Lưu `currentChatId` khi mở chat
    
      this.setState((prevState) => ({
        unreadMessages: isCurrentChat
          ? prevState.unreadMessages // Nếu đang ở trong chat, không tăng số
          : prevState.unreadMessages + 1, // Nếu không thì tăng số
      }));
    };
    

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    this.socket = socket;
  };

  componentWillUnmount() {
    // Đóng kết nối WebSocket khi component bị hủy
    if (this.socket) {
      this.socket.close();
    }
  }
  handleChatClick = () => {
    // Reset số tin nhắn chưa đọc về 0 khi click vào biểu tượng
    this.setState({ unreadMessages: 0 });
  };

  render() {
    const { isLoggedIn, showChatList, unreadMessages } = this.state;

    return (
      <footer className="footer">
        <div className="row no-padding">
          <div className="container">
            <div className="col-md-8 col-sm-12">
              <div className="footer-widget">
                <h3 className="widgettitle widget-title">Về VJN</h3>
                <div className="textwidget">
                  <p>
                    Nền tảng tuyển dụng và tìm việc bán thời gian trực tuyến.
                  </p>
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
                <h3 className="widgettitle widget-title">
                  Kết Nối Với Chúng Tôi
                </h3>
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
          <div
            className="floating-icons"
            style={{
              position: "fixed",
              bottom: "20px", // Cách đáy màn hình
              right: "20px", // Cách mép phải màn hình
              zIndex: 1000, // Hiển thị trên tất cả các thành phần khác
            }}
          >
            <a
              href="/ChatList"
              target="_blank"
              rel="noopener noreferrer"
              className="icon messenger-icon"
              onClick={this.handleChatClick} // Gọi hàm khi click vào biểu tượng
              style={{
                position: "relative",
                display: "inline-block",
                width: "60px",
                height: "60px",
                backgroundColor: "#28a745", // Màu nền xanh lá
                borderRadius: "10px", // Bo góc vuông thành bo tròn
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Đổ bóng
                textDecoration: "none", // Loại bỏ gạch chân
                transition: "transform 0.3s", // Hiệu ứng hover
                cursor: "pointer",
              }}
            >
              <i
                className="fa fa-comments"
                style={{
                  fontSize: "30px",
                  color: "white", // Màu icon
                }}
              ></i>
              {unreadMessages > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    width: "24px",
                    height: "24px",
                    backgroundColor: "red", // Màu đỏ nổi bật
                    color: "white", // Màu chữ
                    fontSize: "14px", // Cỡ chữ
                    fontWeight: "bold",
                    borderRadius: "50%", // Hình tròn
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white", // Đường viền trắng
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Đổ bóng
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </a>
          </div>
        )}
      </footer>
    );
  }
}

export default Footer;
