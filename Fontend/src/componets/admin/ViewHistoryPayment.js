import React, { useState, useEffect } from 'react';
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";

const PaymentHistoryTable = () => {
  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [daysFilter, setDaysFilter] = useState(0); // 0 for no filter, can be set to other values like 7, 10, 30
  const [servicePriceIdFilter, setServicePriceIdFilter] = useState(''); // Filter by servicePriceId
  const [totalCount, setTotalCount] = useState(0);
  const [servicePrices, setServicePrices] = useState([]); // State for service prices
  const pageSize = 10; // Fixed page size of 5 items per page

  // Fetch data for payment history
  const fetchData = async () => {
    const query = `pageNumber=${pageNumber}&pageSize=${pageSize}&daysFilter=${daysFilter}&servicePriceId=${servicePriceIdFilter}`;
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
                  <tr
                    key={item.servicePriceLogId}
                    onClick={() => window.location.href = `/ViewAllHistoryPaymentDetail/${item.user.userId}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{item.user.fullName}</td>
                    <td>{item.servicePrice.price} VNĐ</td>
                    <td>{item.servicePrice.servicePriceName}</td>
                    <td>
                      {new Date(item.registerDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
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
    background-color: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08);
}

.filter-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
}

.filter-controls label {
    margin-right: 15px;
    font-weight: bold;
    color: #2c3e50;
    font-size: 16px;
}

.filter-controls select {
    padding: 10px 15px;
    border-radius: 8px;
    border: 1px solid #bdc3c7;
    background-color: white;
    font-size: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    margin-right: 20px;
}

.payment-history-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    background-color: white;
}

.payment-history-table th {
    background-color: #f8f9fa;
    color: #2c3e50;
    font-weight: bold;
    text-align: left;
    padding: 15px;
    border-bottom: 2px solid #e0e0e0;
}

.payment-history-table td {
    padding: 15px;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    gap: 15px;
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 10px;
}

.pagination-controls button {
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination-controls button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
    background-color: #2980b9;
}

/* Tùy chỉnh style cho các dòng trong bảng */
.payment-history-table tr {
    transition: all 0.3s ease;
}

.payment-history-table tr:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
          `}</style>
        </div>
      </main>
    </div>
  );
};

export default PaymentHistoryTable;
