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
                    <h1>Danh sách yêu cầu trở thành nhà tuyển dụng</h1>

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
                    }

                    .filter-container {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }

                    .search-bar {
                        width: 40%;
                        padding: 8px;
                    }

                    .status-dropdown, .sort-dropdown {
                        padding: 8px;
                        width: 150px;
                    }

                    .employer-table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    .employer-table th, .employer-table td {
                        padding: 10px;
                        text-align: left;
                        border: 1px solid #ddd;
                    }

                    .employer-table th {
                        background-color: #f4f4f4;
                    }

                    .employer-image {
    width: 80px;  /* Adjusted width to 80px */
    height: 80px; /* Adjusted height to 80px */
    object-fit: cover; /* Ensures the image fits nicely */
    background-color: #e0e0e0; /* Fallback background */
}


                    .pagination {
                        display: flex;
                        justify-content: center;
                        margin-top: 20px;
                    }

                    .pagination button {
                        padding: 8px 12px;
                        margin: 0 5px;
                    }

                    .view-detail-button {
                        padding: 6px 12px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        border-radius: 4px;
                    }

                    .view-detail-button:hover {
                        background-color: #45a049;
                    }
                `}</style>
            </main>
        </div>
    );
}

export default EmployerRequests;
