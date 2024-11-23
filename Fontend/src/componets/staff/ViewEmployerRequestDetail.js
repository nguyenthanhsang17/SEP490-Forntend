import React, { useState, useEffect } from 'react';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
            await axios.post(`https://localhost:7077/api/Users/Accept/${id}`);
            alert('Đã chấp thuận');
            fetchEmployerDetail(); // Làm mới thông tin
        } catch (error) {
            console.error('Error approving employer:', error);
        }
    };


    const handleReject = async () => {
        if (!reason) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }
        try {
            await axios.post(`https://localhost:7077/api/Users/Reject/${id}`, reason, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Đã từ chối');
            fetchEmployerDetail(); // Làm mới thông tin
        } catch (error) {
            console.error('Error rejecting employer:', error);
        }
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
                            <div className="info-item">
                                <strong>Hình ảnh doanh nghiệp:</strong>
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
                                <button onClick={handleApprove} className="approve-button">Chấp thuận</button>
                                <button onClick={handleReject} className="reject-button">Từ chối</button>
                                <textarea
                                    placeholder="Nhập lý do từ chối..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="reason-input"
                                />
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
                    padding: 20px;
                }

                .details-container, .user-info {
                    margin-bottom: 20px;
                }

                .info-item {
                    margin-bottom: 10px;
                }

                .images-container {
                    display: flex;
                    gap: 10px;
                }

                .employer-image {
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.3s;
                }

                .image-thumbnail:hover {
                    transform: scale(1.1);
                }

                .user-info .user-item {
                    display: flex;
                    align-items: center;
                    margin-top: 20px;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin-right: 20px;
                }

                .user-details {
                    flex: 1;
                }

                .action-buttons {
                    margin-top: 20px;
                }

                .approve-button, .reject-button {
                    padding: 10px 15px;
                    margin-right: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 5px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                }

                .reject-button {
                    background-color: #f44336;
                }

                .reason-input {
                    width: 100%;
                    height: 100px;
                    padding: 10px;
                    margin-top: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }

                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    position: relative;
                    width: 80%;
                    max-width: 800px;
                    max-height: 80%;
                    overflow: hidden;
                }

                .modal-image {
                    width: auto;
                    height: 96%;
                    border-radius: 8px;
                }
            `}</style>
                </>
            </main>
        </div>

    );
}

export default EmployerRequestDetail;
