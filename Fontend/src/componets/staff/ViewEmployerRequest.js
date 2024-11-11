import React, { useState, useEffect } from 'react';
import Footer from '../common/Footer';
import Header from '../common/Header';
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
        <>
            <Header />
            <h1>.</h1>
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

                <ul className="employer-list">
                    {employers.map((employer) => (
                        <li key={employer.registerEmployerId} className="employer-item">
                            <div className="employer-info">
                                <img
                                    src={employer.listIMG && employer.listIMG.length > 0 ? employer.listIMG[0] : 'default-image-url.jpg'}
                                    alt="Employer"
                                    className="employer-image"
                                /> 
                            </div>
                            <div className="employer-info">
                                <strong>Doanh nghiệp:</strong> {employer.bussinessName}
                            </div>
                            <div className="employer-info">
                                <strong>Ngày tạo:</strong> {new Date(employer.createDate).toLocaleDateString()}
                            </div>
                            <div className="employer-info">
                                <strong>Người gửi:</strong> {employer.user?.fullName || 'N/A'}
                            </div>
                            <div className="employer-info">
                                <strong>Điện thoại:</strong> {employer.user?.phonenumber || 'N/A'}
                            </div>
                            <div className="employer-info">
                                <strong>Trạng thái:</strong> {employer.status?.phonenumber || 'N/A'}
                            </div>
                            <div className="employer-info">
                                <a href={'/ViewEmployerRequestsDetail/' + employer.registerEmployerId} className="view-detail-button">
                                    Xem chi tiết
                                </a>
                            </div>
                            
                        </li>
                    ))}
                </ul>

                <div className="pagination">
                    <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1}>Trang trước</button>
                    <span>Trang {pageNumber}</span>
                    <button onClick={() => setPageNumber(pageNumber + 1)} disabled={employers.length < pageSize}>Trang sau</button>
                </div>
            </div>
            <Footer />
            <style jsx>{`
                .container {
                    max-width: 900px;
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

                .employer-list {
                    list-style-type: none;
                    padding: 0;
                }

                .employer-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #ddd;
                    padding: 10px 0;
                }

                .employer-info {
                    flex: 1;
                    margin-right: 10px;
                }

                .employer-image {
                    width: 80px;  /* Adjust width */
                    height: 80px; /* Adjust height */
                    object-fit: cover; /* Ensures the image is cropped to fit inside the box */
                    margin-right: 10px; /* Space between the image and other content */
                    background-color: #e0e0e0; /* Fallback background if the image fails to load */
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
        </>
    );
}

export default EmployerRequests;
