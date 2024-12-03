import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import { faStop, faPlay, faEdit, faTrash, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';
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
        price: '',
        servicePriceName: '',
        status: ''
    });

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
        const validValue = value < 1 ? 1 : value;
        setNewService({ ...newService, [name]: validValue });

        if (name === "isFindJobseekers" && value === "0") {
            setNewService({
                ...newService,
                [name]: value,
                durationsMonth: 0, // Đặt thời hạn sử dụng thành 0 khi chọn "Không"
            });
        } else if (name === "isFindJobseekers" && value === "1") {
            setNewService({
                ...newService,
                [name]: value,
                durationsMonth: 1,
            });
        } else {
            setNewService({ ...newService, [name]: value });
        }
    };

    const handleInputMonth = (e) => {
        const { name, value } = e.target;
        const validValue = value < 0 ? 0 : value;
        setNewService({ ...newService, [name]: validValue });
    };

    const handleCreateService = async (e) => {
        e.preventDefault();

        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chắn muốn tạo gói?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });

            if (result.isConfirmed) {
                console.log(newService);
                try {
                    await axios.put('https://localhost:7077/api/ServicePriceLists/CreateNewService', newService);
                    //alert('Gói dịch vụ đã được tạo thành công!');
                    await Swal.fire({
                        title: 'Gói dịch vụ đã được tạo thành công!',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });
                    setNewService({
                        numberPosts: '',
                        numberPostsUrgentRecruitment: '',
                        isFindJobseekers: '',
                        durationsMonth: '',
                        price: '',
                        servicePriceName: '',
                        status: ''
                    });
                    fetchServiceList(pagination.pageNumber, pagination.pageSize);
                } catch (error) {
                    console.error('Error creating service:', error);
                    //alert('Có lỗi xảy ra khi tạo gói dịch vụ!');
                    await Swal.fire({
                        title: 'Có lỗi xảy ra khi tạo gói dịch vụ!',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    });
                }
            }
        } catch (error) {
            console.error("Failed to send request approval:", error);
            await Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Ok',
            });
        }


    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            fetchServiceList(newPage, pagination.pageSize);
        }
    };

    const DeleteService = async (serviceId) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn xóa gói dịch vụ này?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`https://localhost:7077/api/ServicePriceLists/DeleteServicePriceLists/${serviceId}`);

                if (response.status === 200) {
                    await Swal.fire({
                        title: 'Xóa thành công !',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });
                    fetchServiceList(pagination.pageNumber, pagination.pageSize);

                    // Cập nhật lại danh sách dịch vụ hoặc thực hiện các hành động khác
                }
            }
        } catch (error) {
            if (error.response) {
                console.log("Error response:", error.response);
                // Nếu có phản hồi từ server
                await Swal.fire({
                    title: error.response.data.message ||'Không thể xóa vì có gói dịch vụ đã có giao dịch',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            } else {
                // Nếu không có phản hồi từ server
                await Swal.fire({
                    title: 'Có lỗi xảy ra!',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            }
        };
    }

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn chắc chắn muốn thay đổi trạng thái gói dịch vụ',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });

            if (result.isConfirmed) {
                try {
                    const newStatus = currentStatus === 1 ? 0 : 1; // Đổi trạng thái
                    await axios.put(`https://localhost:7077/api/ServicePriceLists/UpdateStatus?id=${id}&newStatus=${newStatus}`);
                    //alert(`Trạng thái gói dịch vụ đã được cập nhật thành công!`);
                    await Swal.fire({
                        title: 'Trạng thái gói dịch vụ đã được cập nhật thành công!',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });
                    fetchServiceList(pagination.pageNumber, pagination.pageSize); // Làm mới danh sách
                } catch (error) {
                    console.error('Error updating status:', error);
                    //alert('Có lỗi xảy ra khi cập nhật trạng thái!');
                    await Swal.fire({
                        title: "Có lỗi xảy ra khi cập nhật trạng thái!",
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    });
                }
            }
        } catch (error) {
            console.error("Failed to send request approval:", error);
            await Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Ok',
            });
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
                        <h1 className='pageTitle' style={{
                            textAlign: 'center',
                            color: '#2c3e50',
                            marginBottom: '20px',
                            fontSize: '28px',
                            fontWeight: '700',
                            borderBottom: '3px solid #3498db',
                            paddingBottom: '15px'
                        }}>
                            Danh Sách Gói Dịch Vụ
                        </h1>
                        <table className="service-table">
                            <thead>
                                <tr>
                                    <th>Tên gói</th>
                                    <th>Số lượng bài đăng</th>
                                    <th>Số lượng bài đăng nổi bật</th>
                                    <th>Tìm kiếm ứng viên</th>
                                    <th>Thời hạn sử dụng </th>
                                    <th>Mức giá </th>
                                    <th>Trạng thái </th>
                                    <th>Hành động</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceList.map((service) => (
                                    <tr key={service.servicePriceId}>
                                        <td>{service.servicePriceName || 'N/A'}</td>
                                        <td>{service.numberPosts || 'N/A'}</td>
                                        <td>{service.numberPostsUrgentRecruitment || 'N/A'}</td>
                                        <td>{service.isFindJobseekers === 1 ? 'Có' : 'Không'}</td>
                                        <td>{service.durationsMonth ? `${service.durationsMonth} tháng` : 'Không có'}</td>
                                        <td>{service.price ? `${service.price.toLocaleString()} VNĐ` : 'N/A'}</td>
                                        <td>{service.status == "1" ? 'Đang bán' : 'Không bán'}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className={service.status === 1 ? 'stop-sale-btn' : 'start-sale-btn'}
                                                    onClick={() => handleToggleStatus(service.servicePriceId, service.status)}
                                                >
                                                    <FontAwesomeIcon icon={service.status === 1 ? faTimesCircle : faCheckCircle} />
                                                    {service.status == "1" ? 'Ngừng bán' : 'Bán'}
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    style={{ backgroundColor: '#DC3545' }}
                                                    onClick={() => DeleteService(service.servicePriceId)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} />
                                                    Xóa
                                                </button>
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
                            <span style={{ marginTop: '10px' }}>Trang {pagination.pageNumber} / {pagination.totalPages}</span>
                            <button
                                disabled={pagination.pageNumber === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.pageNumber + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="create-service">

                        <h2 className="section-title" style={{
                            textAlign: 'center',
                            color: '#2c3e50',
                            marginBottom: '20px',
                            fontSize: '28px',
                            fontWeight: '700',
                            borderBottom: '3px solid #3498db',
                            paddingBottom: '15px'
                        }}>Tạo Gói Mới</h2>
                        <form onSubmit={handleCreateService} className="service-form">
                            <div className="form-group">

                                <label>Tên gói dịch vụ:</label>
                                <input
                                    type="text"
                                    name="servicePriceName"
                                    value={newService.servicePriceName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập tên gói dịch vụ"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số lượng bài đăng:</label>
                                <input
                                    type="number"
                                    name="numberPosts"
                                    value={newService.numberPosts}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập số lượng bài đăng"
                                    min={0}
                                />
                            </div>
                            <div className="form-group">
                                <label>Số lượng bài đăng nổi bật:</label>
                                <input
                                    type="number"
                                    name="numberPostsUrgentRecruitment"
                                    value={newService.numberPostsUrgentRecruitment}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số lượng bài đăng nổi bật"
                                    min={0}
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
                            {newService.isFindJobseekers == "1" ? (<div className="form-group">
                                <label>Thời hạn sử dụng (tháng):</label>
                                <input
                                    type="number"
                                    name="durationsMonth"
                                    value={newService.durationsMonth}
                                    onChange={handleInputMonth}
                                    required
                                    placeholder="Nhập số tháng"
                                    readOnly={!newService.isFindJobseekers}
                                />
                            </div>) : ("")}

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
                            <div className="form-group">
                                <label>Trạng thái:</label>
                                <select
                                    name="status"
                                    value={newService.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="1">Bán</option>
                                    <option value="0">Không bán</option>
                                </select>
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
    background-color: #ffffff; /* Màu nền trắng */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.create-service {
    flex: 1;
    background-color: #f9f9f9; /* Màu nền nhẹ cho phần tạo dịch vụ */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px; /* Kích thước chữ lớn hơn */
    font-weight: bold;
    color: #2c3e50; /* Màu chữ tối */
}

.service-table {
    width: 100%;
    border-collapse: collapse;
}

.service-table th,
.service-table td {
    border: 1px solid #ddd; /* Đường viền nhẹ */
    padding: 10px; /* Khoảng cách giữa chữ và viền */
    text-align: center;
}

.service-table th {
    background-color: #3498db; /* Màu nền tiêu đề */
    color: white; /* Màu chữ trắng */
    font-weight: bold;
}

.service-table td {
    background-color: #ffffff; /* Màu nền trắng cho ô */
}

.service-table tr:nth-child(even) {
    background-color: #f2f2f2; /* Màu nền cho hàng chẵn */
}

.service-table tr:hover {
    background-color: #e0f7fa; /* Màu nền khi hover */
    transition: background-color 0.3s ease; /* Hiệu ứng chuyển đổi */
}

.form-group {
    margin-bottom: 20px; /* Khoảng cách giữa các nhóm */
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px; /* Khoảng cách bên trong */
    border: 1px solid #bdc3c7; /* Đường viền nhẹ */
    border-radius: 5px; /* Bo tròn góc */
    font-size: 16px; /* Kích thước chữ */
    transition: border-color 0.3s; /* Hiệu ứng chuyển đổi viền */
}

.form-group input:focus,
.form-group select:focus {
    border-color: #3498db; /* Đổi màu viền khi focus */
}

.create-btn {
    width: 100%;
    padding: 12px; /* Khoảng cách bên trong */
    background-color: #007bff; /* Màu nền nút */
    color: white; /* Màu chữ trắng */
    border: none;
    border-radius: 5px; /* Bo tròn góc */
    cursor: pointer;
    transition: background-color 0.3s; /* Hiệu ứng chuyển đổi */
}

.create-btn:hover {
    background-color: #0056b3; /* Màu nền khi hover */
}

.pagination {
    margin-top: 20px; /* Khoảng cách trên */
    display: flex;
    justify-content: center;
    gap: 10px; /* Khoảng cách giữa các nút */
}

.pagination button {
    padding: 10px 15px; /* Khoảng cách bên trong */
    background-color: #007bff; /* Màu nền nút */
    color: white; /* Màu chữ trắng */
    border: none;
    border-radius: 5px; /* Bo tròn góc */
    cursor: pointer;
    transition: background-color 0.3s; /* Hiệu ứng chuyển đổi */
}

.pagination button:disabled {
    background-color: #bdc3c7; /* Màu nền cho nút bị vô hiệu */
    cursor: not-allowed; /* Con trỏ không cho phép */
}

.pagination button:hover:not(:disabled) {
    background-color: #0056b3; /* Màu nền khi hover */
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px; /* Khoảng cách giữa các nút */
}

.action-buttons button {
    padding: 8px 12px; /* Khoảng cách bên trong */
    background-color: #007bff; /* Màu nền nút hành động */
    color: white; /* Màu chữ trắng */
    border: none;
    border-radius: 5px; /* Bo tròn góc */
    cursor: pointer;
    transition: background-color 0.3s; /* Hiệu ứng chuyển đổi */
    display: flex;
    align-items: center; /* Căn giữa icon và chữ */
}

.action-buttons button i {
    margin-right: 5px; /* Khoảng cách giữa icon và chữ */
}

.action-buttons button:hover {
    background-color: #3498db; /* Màu nền khi hover */
}

.stop-sale-btn{
background-color: #dc3545;
}

    
                `}</style>
            </main>
        </div>
    );
};

export default ManageService;
