import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";

const ManageService = () => {
    const [serviceList, setServiceList] = useState([]);
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: 9,
        totalPages: 0,
        totalCount: 0
    });
    const [newService, setNewService] = useState({
        numberPosts: '',
        numberPostsUrgentRecruitment: '',
        isFindJobseekers: '',
        durationsMonth: '',
        price: ''
    });

    // Fetch service list with pagination
    const fetchServiceList = async (pageNumber = 1, pageSize = 9) => {
        try {
            const response = await axios.get(`https://localhost:7077/api/ServicePriceLists/GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            const { items, totalCount, pageNumber: currentPage, pageSize: currentPageSize, totalPages } = response.data;

            setServiceList(items);
            setPagination({
                pageNumber: currentPage,
                pageSize: currentPageSize,
                totalPages,
                totalCount
            });
        } catch (error) {
            console.error('Error fetching service list:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const validValue = value < 1 ? 1 : value; // Không cho giá trị âm
        setNewService({ ...newService, [name]: validValue });
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await axios.put('https://localhost:7077/api/ServicePriceLists/CreateNewService', newService);
            alert('Gói dịch vụ đã được tạo thành công!');
            setNewService({
                numberPosts: '',
                numberPostsUrgentRecruitment: '',
                isFindJobseekers: '',
                durationsMonth: '',
                price: ''
            });
            fetchServiceList(pagination.pageNumber, pagination.pageSize); // Refresh the list after creation
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Có lỗi xảy ra khi tạo gói dịch vụ!');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            fetchServiceList(newPage, pagination.pageSize);
        }
    };

    useEffect(() => {
        fetchServiceList(pagination.pageNumber, pagination.pageSize);
    }, [pagination.pageNumber, pagination.pageSize]);

    return (
        <div className="dashboard-grid-container">
            <Sidebar />
            <Header />
            <main className="dashboard-content">
                <div className="container">
                    <div className="service-section">
                        <h2 className="section-title">Danh Sách Gói Dịch Vụ</h2>
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th>Mã dịch vụ</th>
                                    <th>Số lượng bài đăng</th>
                                    <th>Số lượng bài đăng khẩn cấp</th>
                                    <th>Tìm kiếm ứng viên</th>
                                    <th>Thời hạn sử dụng (tháng)</th>
                                    <th>Mức giá (VNĐ)</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceList.map((service) => (
                                    <tr key={service.servicePriceId}>
                                        <td>{service.servicePriceId || 'N/A'}</td>
                                        <td>{service.numberPosts || 'N/A'}</td>
                                        <td>{service.numberPostsUrgentRecruitment || 'N/A'}</td>
                                        <td>{service.isFindJobseekers === 1 ? 'Có' : 'Không'}</td>
                                        <td>{service.durationsMonth ? `${service.durationsMonth} tháng` : 'Không có'}</td>
                                        <td>{service.price ? `${service.price.toLocaleString()} VNĐ` : 'N/A'}</td>
                                        <td >
                                            <div className="action-buttons">
                                                <button className="edit-btn">Sửa</button>
                                                <button className="delete-btn">Xóa</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                    <button
                        disabled={pagination.pageNumber === 1}
                        onClick={() => handlePageChange(pagination.pageNumber - 1)}
                    >
                        Previous
                    </button>
                    <span>Trang {pagination.pageNumber} / {pagination.totalPages}</span>
                    <button
                        disabled={pagination.pageNumber === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.pageNumber + 1)}
                    >
                        Next
                    </button>
                </div>
                    </div>

                    <div className="create-service">
                        <h2 className="section-title">Tạo Gói Mới</h2>
                        <form onSubmit={handleCreateService} className="service-form">
                            <div className="form-group">
                                <label>Số lượng bài đăng:</label>
                                <input
                                    type="number"
                                    name="numberPosts"
                                    value={newService.numberPosts}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập số lượng bài đăng"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số lượng bài đăng khẩn cấp:</label>
                                <input
                                    type="number"
                                    name="numberPostsUrgentRecruitment"
                                    value={newService.numberPostsUrgentRecruitment}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số lượng bài khẩn cấp"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tìm kiếm ứng viên:</label>
                                <select
                                    name="isFindJobseekers"
                                    value={newService.isFindJobseekers}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn</option>
                                    <option value="1">Có</option>
                                    <option value="0">Không</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Thời hạn sử dụng (tháng):</label>
                                <input
                                    type="number"
                                    name="durationsMonth"
                                    value={newService.durationsMonth}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập số tháng"
                                />
                            </div>
                            <div className="form-group">
                                <label>Mức giá:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newService.price}
                                    onChange={handleInputChange}
                                    step="1000"
                                    required
                                    placeholder="Nhập giá tiền"
                                />
                            </div>
                            <button type="submit" className="create-btn">Thêm Gói</button>
                        </form>
                    </div>
                </div>

                

                <style jsx>{`
                    .container {
                        display: flex;
                        gap: 20px;
                        
                    }
                    .service-section {
                        flex: 3;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .create-service {
                        flex: 1;
                        background-color: #f9f9f9;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .section-title {
                        text-align: center;
                        margin-bottom: 20px;
                        font-size: 20px;
                        font-weight: bold;
                    }
                    .service-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .service-table th,
                    .service-table td {
                        border: 1px solid #ccc;
                        padding: 5px;
                        text-align: center;
                    }
                    .form-group {
                        margin-bottom: 15px;
                    }
                    .form-group input,
                    .form-group select {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                    .create-btn {
                        width: 100%;
                        padding: 10px;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .pagination {
                        margin-top: 20px;
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                    }
                    .pagination button {
                        padding: 8px 12px;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                         .action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px; /* Khoảng cách giữa các nút */
}

.edit-btn, .delete-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    min-width: 70px; /* Đảm bảo các nút có chiều rộng cố định */
}

.edit-btn {
    background-color: #4CAF50;
    color: white;
}

.delete-btn {
    background-color: #f44336;
    
                `}</style>
            </main>
        </div>
    );
};

export default ManageService;