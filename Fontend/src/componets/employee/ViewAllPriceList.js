import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from "axios";
import Swal from 'sweetalert2';

const ViewAllPriceList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      height: "100%", // Đảm bảo chiều cao bằng nhau
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
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
    card: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      textAlign: "center",
      backgroundColor: "#fff",
      padding: "25px",
      marginBottom: "30px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
      height: "100%", // Đảm bảo chiều cao bằng nhau
      display: "flex",
      flexDirection: "column", // Giúp nội dung dàn đều
      justifyContent: "space-between",
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

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7077/api/ServicePriceLists');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedData = data.map((item) => {
          const description = [
            `Bao gồm: ${item.numberPosts} bài đăng.`,
            `${item.numberPostsUrgentRecruitment} bài đăng tuyển nổi bật.`,
          ];

          // Thêm dòng "Có thể tìm kiếm ứng viên và có hiệu lực trong X tháng." nếu isFindJobseekers là true
          if (item.isFindJobseekers) {
            description.push(`Có thể tìm kiếm ứng viên và có hiệu lực trong ${item.durationsMonth} tháng.`);
          }

          return {
            id: item.servicePriceId,
            name: `Gói ${item.servicePriceId}`,
            price: `${item.price.toLocaleString()} VND`,
            description,
          };
        });

        setPlans(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  
const mua = async (ServiceID) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage

  if (!token) {
    // Nếu không có token, hiển thị thông báo yêu cầu đăng nhập
    Swal.fire({
      icon: 'warning', 
      title: 'Bạn chưa đăng nhập',
      text: 'Vui lòng đăng nhập để tiếp tục mua gói dịch vụ.',
      showCancelButton: true, 
      confirmButtonText: 'Đăng nhập',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      }
    });
    return;
  }

  try {
    const requestBody = {
      ServicePriceId: ServiceID, // ID của gói dịch vụ
    };
    const response = await axios.post("https://localhost:7077/api/VnPay/checkout", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const paymentUrl = response.data; // Lấy URL từ server
    console.log("Payment URL:", paymentUrl);
    window.location.href = paymentUrl;
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          <div
            className="row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {plans.map((plan) => (
              <div
                className="col-md-4"
                key={plan.id}
                style={{
                  display: "flex",
                  alignItems: "stretch", // Đảm bảo các card có chiều cao bằng nhau
                  flexDirection: "column",
                }}
              >
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>{plan.name}</h3>
                  <p style={styles.cardPrice}>{plan.price}</p>
                  <ul
                    style={{
                      textAlign: "left",
                      marginBottom: "1.5rem",
                      fontSize: "1.2rem",
                      lineHeight: "1.8",
                      color: "#444",
                    }}
                  >
                    {plan.description.map((line, index) => (
                      <li key={index} style={{ marginBottom: "0.5rem" }}>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-center">
                    <button
                      style={{ ...styles.button, ...styles.btnSuccess }}
                      onClick={() => mua(plan.id)}
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