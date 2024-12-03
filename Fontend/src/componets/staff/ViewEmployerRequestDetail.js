import React, { useState, useEffect } from 'react';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
function EmployerRequestDetail() {
    const { id } = useParams();
    const [employerDetail, setEmployerDetail] = useState(null);
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isImageEnlarged, setIsImageEnlarged] = useState(false); // Thêm trạng thái mới để kiểm soát việc phóng to ảnh

    useEffect(() => {
        fetchEmployerDetail();
    }, []);

    const fetchEmployerDetail = async () => {
        try {
            const response = await axios.get(`https://localhost:7077/api/Users/RegisterEmployerDetail`, {
                params: { id }
            });
            setEmployerDetail(response.data);
            setStatus(response.data.status);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employer details:', error);
        }
    };

    const handleApprove = async () => {

        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chấp thuận cho nhà tuyển dụng không ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });

            if (result.isConfirmed) {
                try {
                    await axios.post(`https://localhost:7077/api/Users/Accept/${id}`);

                    await Swal.fire({
                        title: 'Chấp thuận thành công!',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                    });

                    fetchEmployerDetail(); // Làm mới thông tin
                } catch (error) {
                    console.error('Error approving employer:', error);
                    await Swal.fire({
                        title: 'Lỗi khi chấp thuận',
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


    const handleReject = async () => {
        const { value: reason } = await Swal.fire({
            title: "Bạn có chắc chắn từ chối nhà tuyển dụng? Nếu có hãy nhập lý do",
            input: "textarea",
            inputAttributes: {
                autocapitalize: "off"
            },
            inputPlaceholder: "Nhập lý do từ chối ở đây...", // Thêm placeholder
            showCancelButton: true,
            confirmButtonText: "Có",
            cancelButtonText: "Không",
            showLoaderOnConfirm: true,
        });

        console.log(reason);
    
        // Kiểm tra nếu người dùng bấm "Có" và có nhập lý do không
        if (reason !== undefined) { // Kiểm tra nếu người dùng bấm "Có"
            if (!reason) {
                //alert('Vui lòng nhập lý do từ chối');
                await Swal.fire({
                    title: 'Vui lòng nhập lý do từ chối',
                    icon: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  });
                return;
            }
            try {
                await axios.post(`https://localhost:7077/api/Users/Reject/${id}`, reason, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                await Swal.fire('Đã từ chối', '', 'success');
                fetchEmployerDetail(); // Làm mới thông tin
            } catch (error) {
                await Swal.fire('Có lỗi xảy ra khi từ chối', '', 'error');
            }
        } 
        // Nếu người dùng bấm "Không", không làm gì cả
    };


    const openImageModal = (img) => {
        if (isImageEnlarged && selectedImage === img) {
            setIsImageModalOpen(false);
            setIsImageEnlarged(false);
            setSelectedImage('');
        } else {
            setSelectedImage(img);
            setIsImageModalOpen(true);
            setIsImageEnlarged(true); // Mở phóng to ảnh
        }
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setIsImageEnlarged(false); // Đóng modal và thu nhỏ ảnh
        setSelectedImage(''); // Xóa ảnh đã chọn khi đóng modal
    };

    if (loading) return <div>Loading...</div>;

    return (

        <div className="dashboard-grid-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="dashboard-content">

                <>
                    <div className="container">
                        <h1>Chi tiết đơn đăng ký nhà tuyển dụng</h1>
                        {/* Phần thông tin doanh nghiệp */}
                        <div className="details-container">

                            <div className="info-item">
                                <strong>Doanh nghiệp:</strong> {employerDetail.bussinessName}
                            </div>
                            <div className="info-item">
                                <strong>Địa chỉ:</strong> {employerDetail.bussinessAddress}
                            </div>
                            <div className="info-item">
                                <strong>Ngày tạo:</strong> {new Date(employerDetail.createDate).toLocaleDateString()}
                            </div>
                            <div className="info-item">
                                <strong>Trạng thái:</strong>
                                {status === 0 ? "Đang chờ phê duyệt" : status === 1 ? "Đã phê duyệt" : "Bị từ chối"}
                            </div>

                            {employerDetail.reason && (
                                <div className="info-item">
                                    <strong>Lý do từ chối: {employerDetail.reason}</strong>
                                </div>
                            )}

                            <div >
                                <strong style={{ display: 'block', width: '100%' }}>Hình ảnh doanh nghiệp:</strong>
                                <div className="images-container">
                                    {employerDetail.listIMG.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`Image ${index}`}
                                            className="employer-image image-thumbnail"
                                            onClick={() => openImageModal(img)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Phần thông tin người dùng */}
                        <div className="user-info">
                            <h2>Người đăng ký</h2>
                            <div className="user-item">
                                <img
                                    src={employerDetail.user?.avatarURL || '/default-avatar.png'}
                                    alt="User Avatar"
                                    className="user-avatar"
                                />
                                <div className="user-details">
                                    <div className="info-item">
                                        <strong>Người gửi:</strong> {employerDetail.user?.fullName || 'N/A'}
                                    </div>
                                    <div className="info-item">
                                        <strong>Email:</strong> {employerDetail.user?.email || 'N/A'}
                                    </div>
                                    <div className="info-item">
                                        <strong>Điện thoại:</strong> {employerDetail.user?.phonenumber || 'N/A'}
                                    </div>
                                    <div className="info-item">
                                        <strong>Giới tính:</strong> {employerDetail.user?.gender || 'N/A'}
                                        {
                                            employerDetail.user === 0
                                                ? 'Nữ'
                                                : 'Nam'
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Các nút hành động */}
                        {status === 0 && (
                            <div className="action-buttons">
                                <div className="action-button-row">
                                    <button onClick={handleApprove} className="approve-button">Chấp thuận</button>
                                    <button onClick={handleReject} className="reject-button">Từ chối</button>
                                </div>
                                
                            </div>
                        )}
                    </div>

                    {/* Modal phóng to ảnh */}
                    {isImageModalOpen && (
                        <div className="modal" onClick={closeImageModal}>
                            <img src={selectedImage} alt="Enlarged" className="modal-image" onClick={(e) => e.stopPropagation()} />
                        </div>
                    )}

                    <style jsx>{`
                .container {
    max-width: 70%;
    margin: 0 auto;
    padding: 40px;
    background-color: #f9fafb;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.details-container, 
.user-info {
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
}

.details-container:hover,
.user-info:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
}

.info-item {
    display: flex; /* Sử dụng flexbox để sắp xếp */
    align-items: center; /* Căn giữa theo chiều dọc */
    margin-bottom: 10px; /* Khoảng cách giữa các mục */
}

.info-item:last-child {
    border-bottom: none;
}

.info-item strong {
    margin-right: 5px; /* Khoảng cách giữa nhãn và giá trị */
}

.info-item span {
    color: #34495e;
    font-size: 15px;
}

.images-container {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
    width: '100%';
    margin-top: 10px;
}

.employer-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.employer-image:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.user-info .user-item {
    display: flex;
    align-items: center;
    gap: 25px;
}

.user-avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #3498db;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.user-details {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
}

.user-detail-item {
    display: flex;
    flex-direction: column;
}

.user-detail-item strong {
    color: #7f8c8d;
    font-size: 13px;
    margin-bottom: 5px;
    text-transform: uppercase;
}

.user-detail-item span {
    color: #2c3e50;
    font-size: 15px;
    font-weight: 500;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
}

.action-button-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    width: 100%;
}

.approve-button, 
.reject-button {
    padding: 12px 30px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    border: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    width: 200px; /* Đảm bảo hai nút có kích thước bằng nhau */
}

.approve-button {
    background-color: #2ecc71;
    color: white;
}

.reject-button {
    background-color: #e74c3c;
    color: white;
}

.reason-input {
    width: 100%;
    max-width: 780px; /* Giới hạn chiều rộng */
    height: 120px;
    padding: 15px;
    margin-top: 15px;
    border: 2px solid #ecf0f1;
    border-radius: 10px;
    font-size: 15px;
    resize: vertical;
    transition: all 0.3s ease;
}

.reason-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 16px;
    object-fit: contain;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
            `}</style>
                </>
            </main>
        </div>

    );
}

export default EmployerRequestDetail;
