import React, { useState, useEffect } from 'react';
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const PaymentHistoryTableDetail = () => {
  const { uid } = useParams();
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [daysFilter, setDaysFilter] = useState(0); // 0 for no filter, can be set to other values like 7, 10, 30
  const [servicePriceIdFilter, setServicePriceIdFilter] = useState(''); // Filter by servicePriceId
  const [totalCount, setTotalCount] = useState(0);
  const [servicePrices, setServicePrices] = useState([]); // State for service prices
  const pageSize = 10; // Fixed page size of 5 items per page
  const navigate = useNavigate();
  // Fetch data for payment history
  const fetchData = async () => {
    const query = `uid=${uid}&pageNumber=${pageNumber}&pageSize=${pageSize}&daysFilter=${daysFilter}&servicePriceId=${servicePriceIdFilter}`;
    console.log('Fetching data with query:', query);

    try {
      const response = await fetch(`https://localhost:7077/api/Payment/GetallHistoryPayment?${query}`);
      const result = await response.json();
      setData(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu: ", error);
    }
  };

  // Fetch service price list
  const fetchServicePrices = async () => {
    try {
      const response = await fetch('https://localhost:7077/api/ServicePriceLists/GetAllServiecPriceList');
      const result = await response.json();
      setServicePrices(result); // Save service prices to state
    } catch (error) {
      console.error("Lỗi khi lấy danh sách dịch vụ: ", error);
    }
  };

  // Fetch data and service prices when component mounts
  useEffect(() => {
    fetchData();
    fetchServicePrices();
  }, [pageNumber, daysFilter, servicePriceIdFilter]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / pageSize)) {
      setPageNumber(newPage);
    }
  };

  // Handle days filter change
  const handleDaysFilterChange = (event) => {
    setDaysFilter(event.target.value);
    setPageNumber(1); // Reset to page 1 when filter changes
  };

  // Handle servicePriceId filter change
  const handleServicePriceIdFilterChange = (event) => {
    setServicePriceIdFilter(event.target.value);
    setPageNumber(1); // Reset to page 1 when filter changes
  };

  const ViewUserDetail = (userid) => {
    navigate(`/user/${userid}`);
  }

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="payment-history-container">
          <h1 className='pageTitle' style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '28px',
            fontWeight: '700',
            borderBottom: '3px solid #3498db',
            paddingBottom: '15px'
          }}>
            Lịch sử thanh toán
          </h1>
          {/* Filter controls */}
          <div className="filter-controls">
            <label htmlFor="daysFilter">Lọc theo ngày: </label>
            <select id="daysFilter" value={daysFilter} onChange={handleDaysFilterChange}>
              <option value="0">Tất cả</option>
              <option value="7">1 Tuần</option>
              <option value="10">10 Ngày</option>
              <option value="15">15 Ngày</option>
              <option value="30">30 Ngày</option>
            </select>

            <label htmlFor="servicePriceId">Lọc theo tên dịch vụ: </label>
            <select style={{ maxWidth: '300px' }}
              id="servicePriceId"
              value={servicePriceIdFilter}
              onChange={handleServicePriceIdFilterChange}
            >
              <option value="">Tất cả</option>
              {/* Ensure servicePrices is defined and not empty */}
              {servicePrices && servicePrices.length > 0 ? (
                servicePrices.map(service => (
                  <option key={service.servicePriceId} value={service.servicePriceId}>
                    {service.servicePriceName}
                  </option>
                ))
              ) : (
                <option value="">Không có dịch vụ</option>
              )}
            </select>
          </div>

          {/* Table displaying payment history */}
          <table className="payment-history-table">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Giá</th>
                <th>Tên dịch vụ</th>
                <th>Thời gian giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {/* Ensure data is defined and not empty */}
              {data && data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.servicePriceLogId}>
                    <td><a onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện click trên <tr>
                        ViewUserDetail(item.user.userId); // Chuyển hướng đến trang người dùng
                    }} style={{ cursor: 'pointer' }}>
                        {item.user.fullName}
                    </a></td>
                    <td>{item.servicePrice.price} VNĐ</td>
                    <td>{item.servicePrice.servicePriceName}</td>
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
                  <td colSpan="4">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination-controls">
            <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 1}>
              Trước
            </button>
            <span>Trang {pageNumber} / {Math.ceil(totalCount / pageSize)}</span>
            <button
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber === Math.ceil(totalCount / pageSize)}
            >
              Sau
            </button>
          </div>

          <style jsx>{`
            .payment-history-container {
    font-family: Arial, sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9; /* Màu nền nhẹ hơn */
    border-radius: 10px; /* Bo tròn góc */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

h1 {
    text-align: center;
    color: #2c3e50; /* Màu chữ tối */
    margin-bottom: 20px;
    font-size: 32px; /* Kích thước chữ lớn hơn */
    font-weight: 700; /* Đậm */
    padding-bottom: 10px; /* Khoảng cách dưới */
}

.filter-controls {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    gap: 15px; /* Tăng khoảng cách giữa các phần tử */
    background-color: #ffffff; /* Màu nền trắng cho bộ lọc */
    padding: 15px; /* Khoảng cách bên trong */
    border-radius: 8px; /* Bo tròn góc */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
}

.filter-controls label {
    font-size: 16px;
    color: #34495e; /* Màu chữ tối */
}

.filter-controls select {
    padding: 10px; /* Khoảng cách bên trong */
    font-size: 16px;
    border: 1px solid #bdc3c7; /* Đường viền nhẹ */
    border-radius: 5px; /* Bo tròn góc */
    transition: border-color 0.3s; /* Hiệu ứng chuyển đổi */
}

.filter-controls select:focus {
    border-color: #3498db; /* Đổi màu viền khi focus */
}

.payment-history-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #ffffff; /* Màu nền trắng */
    border-radius: 8px; /* Bo tròn góc */
    overflow: hidden; /* Để bo tròn góc hoạt động */
}

.payment-history-table th, .payment-history-table td {
    padding: 12px; /* Khoảng cách giữa chữ và viền */
    text-align: center;
    border: 1px solid #ddd; /* Đường viền nhẹ */
}

.payment-history-table th {
    background-color: #3498db; /* Màu nền tiêu đề */
    color: white; /* Màu chữ trắng */
    font-weight: bold;
}

.payment-history-table td {
    background-color: #ffffff; /* Màu nền trắng cho ô */
}

.payment-history-table tr:hover {
    background-color: #f1f1f1; /* Màu nền khi hover */
    transition: background-color 0.3s; /* Hiệu ứng chuyển đổi */
}

.pagination-controls {
    text-align: center;
    margin-top: 20px;
}

.pagination-controls button {
    padding: 10px 15px; /* Khoảng cách bên trong */
    font-size: 16px;
    margin: 0 10px;
    background-color: #3498db; /* Màu nền nút */
    color: white; /* Màu chữ trắng */
    border: none;
    border-radius: 5px; /* Bo tròn góc */
    cursor: pointer; /* Con trỏ tay */
    transition: background-color 0.3s; /* Hiệu ứng chuyển đổi */
}

.pagination-controls button:hover:not(:disabled) {
    background-color: #2980b9; /* Màu nền khi hover */
}

.pagination-controls button:disabled {
    background-color: #bdc3c7; /* Màu nền cho nút bị vô hiệu */
    cursor: not-allowed; /* Con trỏ không cho phép */
}

.pagination-controls span {
    font-size: 16px;
    margin: 0 10px;
}
          `}</style>
        </div>
      </main>
    </div>
  );
};

export default PaymentHistoryTableDetail;
