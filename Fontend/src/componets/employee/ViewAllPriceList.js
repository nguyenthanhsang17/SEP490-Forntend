import React from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';

const ViewAllPriceList = () => {
  const plans = [
    {
      id: 1,
      name: "TOP MAX TRIAL",
      price: "2,887,500 VND",
      description:
        "Trải nghiệm đăng tin tuyển dụng hiệu quả với vị trí nổi bật trong Việc làm tốt nhất kết hợp cùng các dịch vụ cao cấp, giá đúng thử hấp dẫn.",
    },
    {
      id: 2,
      name: "TOP PRO TRIAL",
      price: "2,448,000 VND",
      description:
        "Trải nghiệm đăng tin tuyển dụng tối ưu với vị trí ưu tiên trong Việc làm hấp dẫn kết hợp cùng các dịch vụ cao cấp, giá đúng thử hấp dẫn.",
    },
    {
      id: 3,
      name: "TOP ECO PLUS TRIAL",
      price: "2,112,000 VND",
      description:
        "Trải nghiệm đăng tin tuyển dụng tiết kiệm với vị trí hiển thị trong Đề xuất việc làm liên quan kết hợp cùng các dịch vụ khác, giá đúng thử hấp dẫn.",
    },
  ];

  const styles = {
    alertBox: {
      backgroundColor: "#eaf5ff",
      padding: "15px 25px",
      border: "1px solid #b8daff",
      borderRadius: "8px",
      marginBottom: "30px",
      display: "flex",
      alignItems: "center",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    },
    alertIcon: {
      color: "#007bff",
      fontSize: "24px",
      marginRight: "15px",
    },
    alertText: {
      margin: 0,
      fontSize: "14px",
      color: "#333",
    },
    alertTitle: {
      fontWeight: "bold",
      marginBottom: "5px",
      fontSize: "16px",
    },
    section: {
      backgroundColor: "#f9f9f9",
      padding: "50px 0",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "#fff",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    cardHover: {
      transform: "scale(1.05)",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
    },
    cardTitle: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333",
    },
    cardPrice: {
      fontSize: "1.4rem",
      fontWeight: "bold",
      color: "#28a745",
      marginBottom: "1rem",
    },
    cardDescription: {
      fontSize: "1rem",
      color: "#666",
      marginBottom: "1.5rem",
      lineHeight: "1.6",
    },
    button: {
      borderRadius: "5px",
      fontSize: "1rem",
      padding: "10px 20px",
      margin: "0 10px",
      cursor: "pointer",
    },
    btnSecondary: {
      backgroundColor: "#6c757d",
      color: "#fff",
      border: "none",
    },
    btnSuccess: {
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
    },
  };

  return (
    <>
      <Header />
      <section style={styles.section}>
      {/* Alert Banner */}
      <div className="container">
        <div style={styles.alertBox}>
          <span style={styles.alertIcon}>ℹ️</span>
          <div>
            <p style={{ ...styles.alertText, ...styles.alertTitle }}>
              Lưu ý quan trọng
            </p>
            <p style={styles.alertText}>
              Nhằm tránh rủi ro mạo danh và lừa đảo, VJN khuyến nghị Quý khách
              hàng không chuyển khoản vào bất cứ tài khoản cá nhân nào và chỉ thực
              hiện thanh toán vào các tài khoản chính thức của chúng tôi.
            </p>
          </div>
        </div>
      </div>
      </section>
      
      {/* Pricing Section */}
      <section style={styles.section}>
        <div className="container">
          <div className="row">
            {plans.map((plan) => (
              <div
                className="col-md-4"
                key={plan.id}
                style={{
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>{plan.name}</h3>
                  <p style={styles.cardPrice}>{plan.price}</p>
                  <p style={styles.cardDescription}>{plan.description}</p>
                  <div className="d-flex justify-content-center">
                    <button
                      style={{ ...styles.button, ...styles.btnSecondary }}
                    >
                      Thêm vào giỏ
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.btnSuccess }}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ViewAllPriceList;