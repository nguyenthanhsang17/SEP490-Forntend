import React, { useState, useEffect } from 'react';
import Footer from "../common/Footer";
import Header from "../common/Header";
import bannerImage from '../assets/img/banner-10.jpg';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';

const PaymentHistoryTable = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch data from the API
  const fetchData = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      console.error('Token not found in localStorage');
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7077/api/Payment?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (response.ok) {
        setData(result.items);
        setTotalCount(result.totalCount);
      } else {
        console.error('Error:', result.message || 'Không thể tải dữ liệu');
      }

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / pageSize)) {
      setPageNumber(newPage);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize); // Tính toán tổng số trang

  return (
    <>
      <Header />
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1 style={{ color: 'white' }}>Lịch sử thanh toán</h1>
        </div>
      </section>

      <div className="payment-history-container">
        {/* Table displaying payment history */}
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Giá</th>
              <th>Tên dịch vụ</th>
              <th>Thời gian giao dịch</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.servicePriceLogId}>
                  <td>{item.servicePrice.price} VNĐ</td>
                  <td>{item.servicePriceName}</td>
                  <td>{new Date(item.registerDate).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination controls */}
        {data.length > 0 && (
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              disabled={pageNumber === 1}
              onClick={() => handlePageChange(pageNumber - 1)}
            />
            <span style={{ margin: '0 10px', fontSize: '16px' }}>
              {pageNumber} / {totalPages} trang
            </span>
            <Button
              shape="circle"
              icon={< RightOutlined />}
              disabled={pageNumber === totalPages}
              onClick={() => handlePageChange(pageNumber + 1)}
            />
          </div>
        )}

        <style jsx>{`
        .payment-history-container {
    font-family: Arial, sans-serif;
    max-width: 1000px;
    min-height: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9; /* Thêm màu nền nhẹ */
    border-radius: 8px; /* Bo góc cho container */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Thêm bóng cho container */
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px; /* Khoảng cách dưới tiêu đề */
}

.payment-history-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff; /* Nền trắng cho bảng */
    border-radius: 8px; /* Bo góc cho bảng */
    overflow: hidden; /* Để bo góc hoạt động */
}

.payment-history-table th, .payment-history-table td {
    padding: 12px; /* Tăng khoảng cách cho ô */
    text-align: center;
    border: 1px solid #ddd;
}

.payment-history-table th {
    background-color: #28a745; /* Màu nền cho tiêu đề bảng */
    color: white; /* Màu chữ trắng cho tiêu đề */
}

.payment-history-table tr:nth-child(even) {
    background-color: #f2f2f2; /* Màu nền cho hàng chẵn */
}

.payment-history-table tr:hover {
    background-color: #e0f7fa; /* Màu nền khi hover */
}

.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.pagination-container span {
    margin: 0 10px;
    font-size: 16px;
    font-weight: bold; /* Đậm hơn để nổi bật */
}

.pagination-container button {
    padding: 10px 15px; /* Tăng padding cho nút */
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #007BFF; /* Màu nền cho nút */
    color: white; /* Màu chữ trắng cho nút */
    cursor: pointer;
    transition: background-color 0.3s; /* Hiệu ứng chuyển màu */
}

.pagination-container button:disabled {
    background-color: #ccc; /* Màu nền cho nút bị vô hiệu hóa */
    cursor: not-allowed;
}

.pagination-container button:hover:not(:disabled) {
    background-color: #0056b3; /* Màu nền khi hover cho nút */
}
      `}</style>
      </div>
      <Footer />
    </>
  );
};

export default PaymentHistoryTable;