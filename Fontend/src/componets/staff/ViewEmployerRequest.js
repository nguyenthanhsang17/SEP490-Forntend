import React, { useState, useEffect } from 'react';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";
import axios from 'axios';

function EmployerRequests() {
    const [employers, setEmployers] = useState([]);
    const [status, setStatus] = useState(-1); // Lấy tất cả trạng thái
    const [searchFullName, setSearchFullName] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchEmployers();
    }, [status, searchFullName, sortOrder, pageNumber]);

    const fetchEmployers = async () => {
        try {
            const response = await axios.get(`https://localhost:7077/api/Users/ViewRegisterEmployerList`, {
                params: {
                    status,
                    searchFullName,
                    sortOrder,
                    pageNumber,
                    pageSize,
                },
            });
            setEmployers(response.data.items);
            console.log(response.data.items)
        } catch (error) {
            console.error('Error fetching employers:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchFullName(e.target.value);
        setPageNumber(1); // Reset về trang đầu tiên
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(parseInt(e.target.value));
        setPageNumber(1);
    };

    return (
        <div className="dashboard-grid-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="dashboard-content">
                <div className="container">
                    <h1 className='pageTitle' style={{
                        textAlign: 'center',
                        color: '#2c3e50',
                        marginBottom: '20px',
                        fontSize: '28px',
                        fontWeight: '700',
                        borderBottom: '3px solid #3498db',
                        paddingBottom: '15px'
                    }}>
                        Danh sách yêu cầu trở thành nhà tuyển dụng
                    </h1>

                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Tìm theo tên người gửi..."
                            value={searchFullName}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                        <select value={status} onChange={handleStatusChange} className="status-dropdown">
                            <option value="-1">Tất cả</option>
                            <option value="0">Chờ phê duyệt</option>
                            <option value="1">Thành công</option>
                            <option value="2">Bị từ chối</option>
                        </select>
                        <select value={sortOrder} onChange={handleSortChange} className="sort-dropdown">
                            <option value="asc">Ngày tạo: Tăng dần</option>
                            <option value="desc">Ngày tạo: Giảm dần</option>
                        </select>
                    </div>

                    <table className="employer-table">
                        <thead>
                            <tr>
                                <th>Ảnh</th>
                                <th>Doanh nghiệp</th>
                                <th>Ngày tạo</th>
                                <th>Người gửi</th>
                                <th>Điện thoại</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employers.map((employer) => (
                                <tr key={employer.registerEmployerId}>
                                    <td>
                                        <img
                                            src={employer.listIMG && employer.listIMG.length > 0 ? employer.listIMG[0] : 'default-image-url.jpg'}
                                            alt="Employer"
                                            className="employer-image"
                                        />
                                    </td>
                                    <td>{employer.bussinessName}</td>
                                    <td>{new Date(employer.createDate).toLocaleDateString()}</td>
                                    <td>{employer.user?.fullName || 'N/A'}</td>
                                    <td>{employer.user?.phonenumber || 'N/A'}</td>
                                    <td>
                                        {employer.status === 0
                                            ? 'Đang chờ phê duyệt'
                                            : employer.status === 1
                                                ? 'Đã duyệt'
                                                : employer.status === 2
                                                    ? 'Bị từ chối'
                                                    : 'Không xác định'}
                                    </td>
                                    <td>
                                        <a href={'/ViewEmployerRequestsDetail/' + employer.registerEmployerId} className="view-detail-button">
                                            Xem chi tiết
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>Trang trước</button>
                        <span>Trang {pageNumber}</span>
                        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={employers.length < pageSize}>Trang sau</button>
                    </div>
                </div>

                <style jsx>{`
                    .container {
        max-width: 90%;
        margin: 0 auto;
        padding: 20px;
        background-color: #f4f6f8;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .page-title {
        text-align: center;
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 28px;
        font-weight: 700;
        position: relative;
        padding-bottom: 15px;
    }

    .page-title::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 3px;
        background-color: #3498db;
    }

    .filter-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
    }

    .search-bar {
        width: 40%;
        padding: 10px;
        border: 1px solid #bdc3c7;
        border-radius: 8px;
        font-size: 15px;
    }

    .status-dropdown, .sort-dropdown {
        padding: 10px;
        width: 200px;
        border: 1px solid #bdc3c7;
        border-radius: 8px;
        font-size: 15px;
    }

    .employer-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 10px;
        background-color: white;
    }

    .employer-table th {
        background-color: #f8f9fa;
        color: #2c3e50;
        font-weight: bold;
        text-align: left;
        padding: 15px;
        border-bottom: 2px solid #e0e0e0;
    }

    .employer-table td {
        padding: 15px;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .employer-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 10px;
        background-color: #e0e0e0;
    }

    .view-detail-button {
        display: inline-block;
        padding: 8px 15px;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }

    .view-detail-button:hover {
        background-color: #2980b9;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        gap: 15px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
    }

    .pagination button {
        padding: 10px 20px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .pagination button:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    .pagination button:hover:not(:disabled) {
        background-color: #2980b9;
    }

    .pageTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: '700',
    borderBottom: '3px solid #3498db',
    paddingBottom: '15px',
  }

                `}</style>
            </main>
        </div>
    );
}

export default EmployerRequests;
