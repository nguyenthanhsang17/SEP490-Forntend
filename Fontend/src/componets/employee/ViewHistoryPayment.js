import React, { useState, useEffect } from 'react';
import Footer from "../common/Footer";
import Header from "../common/Header";

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
        console.log(result.item)
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

  return (
    <>
      <Header />
      <div className="payment-history-container">
        <h1>Lịch sử thanh toán</h1>

        {/* Table displaying payment history */}
        <table className="payment-history-table">
          <thead>
            <tr>
              <th>Giá</th>
              <th>Mã dịch vụ</th>
              <th>Thời gian giao dịch</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.servicePriceLogId}>
                  <td>{item.servicePrice.price} VNĐ</td>
                  <td>{item.servicePriceId}</td>
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
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}>
            Trước
          </button>
          <span>Trang {pageNumber} / {Math.ceil(totalCount / pageSize)}</span>
          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === Math.ceil(totalCount / pageSize)}>
            Sau
          </button>
        </div>

        <style jsx>{`
        .payment-history-container {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
          color: #333;
        }

        .payment-history-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .payment-history-table th, .payment-history-table td {
          padding: 10px;
          text-align: center;
          border: 1px solid #ddd;
        }

        .payment-history-table th {
          background-color: #f4f4f4;
          color: #333;
        }

        .pagination-controls {
          text-align: center;
          margin-top: 20px;
        }

        .pagination-controls button {
          padding: 8px 16px;
          font-size: 16px;
          margin: 0 10px;
          background-color: #007BFF;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .pagination-controls button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .pagination-controls span {
          font-size: 16px;
          margin: 0 10px;
        }
      `}</style>
      </div>
      <Footer />
    </>

  );
};

export default PaymentHistoryTable;
