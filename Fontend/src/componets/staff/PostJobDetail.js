import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";
import { useNavigate } from "react-router-dom";

function PostJobDetail() {
    const { job_id } = useParams();
    const [status, setStatus] = useState(null);
    const [postData, setPostData] = useState(null);
    const [banReason, setBanReason] = useState("");
    const [isBanned, setIsBanned] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [reports, setReports] = useState({ items: [], totalCount: 0, totalPages: 1 });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5; // Set page size for pagination
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const statusMapping = {
        0: 'Nháp',
        1: 'Chờ Duyệt',
        2: 'Đã duyệt/Công khai',
        3: 'Bị từ chối',
        4: 'Đã xóa',
        5: 'Đã ẩn',
        6: 'Bị Cấm',
    };

    useEffect(() => {
        axios.get(`https://localhost:7077/api/PostJobs/GetPostDetailForStaff?id=${job_id}`)
            .then(response => {
                setPostData(response.data);
                setIsBanned(response.data.status === 3);
                setStatus(response.data.status)
            })
            .catch(error => console.error('Error fetching post data:', error));
    }, [job_id]);

    const handleApprove = async () => {
        try {
            // Gọi API duyệt bài viết
            const response = await fetch(`https://localhost:7077/api/PostJobs/Accept/${job_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Duyệt bài viết thành công");
                navigate(`/ViewDetail/${job_id}`);
                window.location.reload()
            } else {
                const result = await response.json();
                alert(result.Message || "Có lỗi khi duyệt bài viết");
            }
        } catch (error) {
            console.error("Error during approve:", error);
            alert("Có lỗi khi duyệt bài viết");
        }
    };

    const handleReject = async () => {
        if (!banReason) {
            alert("Vui lòng nhập lý do không duyệt.");
            return;
        }

        try {
            // Gọi API từ chối duyệt bài viết với lý do từ textarea
            const response = await fetch(`https://localhost:7077/api/PostJobs/Reject/${job_id}?reasonRejecr=${encodeURIComponent(banReason)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Từ chối duyệt bài viết thành công");
                navigate(`/ViewDetail/${job_id}`);
                window.location.reload()
            } else {
                const result = await response.json();
                alert(result.Message || "Có lỗi khi từ chối duyệt bài viết");
            }
        } catch (error) {
            console.error("Error during reject:", error);
            alert("Có lỗi khi từ chối duyệt bài viết");
        }
    };

    const handleBan = async () => {
        if (!banReason) {
            alert("Vui lòng nhập lý do cấm.");
            return;
        }

        try {
            // Gọi API cấm bài viết với lý do
            const response = await fetch(`https://localhost:7077/api/PostJobs/Ban/${job_id}?reasonBan=${encodeURIComponent(banReason)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                alert("Bài viết đã bị cấm.");
                navigate(`/ViewDetail/${job_id}`); // Chuyển hướng đến trang chi tiết bài viết với trạng thái cấm
            } else {
                const result = await response.json(banReason);
                console.log()
                alert(result.Message || "Có lỗi khi cấm bài viết");
            }
        } catch (error) {
            console.error("Error during ban:", error);
            alert("Có lỗi khi cấm bài viết");
        }
    };



    useEffect(() => {
        if (status !== "1") {
            axios.get(`https://localhost:7077/api/Report/GetAllReportByPostId?postID=${job_id}&pageNumber=${currentPage}&pageSize=${pageSize}&sortOrder=asc`)
                .then(response => {
                    console.log('API response:', response.data);
                    setReports({
                        items: Array.isArray(response.data.items) ? response.data.items : [],
                        totalCount: response.data.totalCount || 0,
                        totalPages: response.data.totalPages || 1
                    });
                })
                .catch(error => {
                    console.error('Error fetching reports:', error);
                });
        }
    }, [job_id, status, currentPage]);

    const handleImageClick = (url) => {
        setSelectedImage(url);
        setShowImage(true);
    };

    const closeImageModal = () => {
        setShowImage(false);
    };

    return (
        <div className="dashboard-grid-container">
            {/* Sidebar */}
            <Sidebar />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="dashboard-content">
                <>
                    <div className="post-job-container">
                        {postData && (
                            <div className="post-job-details">
                                <h2>{postData.jobTitle}</h2>
                                <p><strong>Mô tả công việc:</strong> {postData.jobDescription}</p>
                                <p><strong>Địa chỉ:</strong> {postData.address}</p>
                                <p><strong>Số lượng tuyển:</strong> {postData.numberPeople}</p>
                                <p><strong>Mức lương:</strong> {postData.salary.toLocaleString()} VND</p>
                                <p><strong>Ngày tạo:</strong> {new Date(postData.createDate).toLocaleDateString()}</p>
                                <p><strong>Trạng thái:</strong> {statusMapping[postData.status]} {status}</p>

                                {postData.imagePostJobs && postData.imagePostJobs.length > 0 && (
                                    <div className="images-gallery">
                                        <div className="image-container">
                                            {postData.imagePostJobs.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.image.url}
                                                    alt={`Image ${index + 1}`}
                                                    className="image-thumbnail"
                                                    onClick={() => handleImageClick(image.image.url)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {showImage && (
                                    <div className="modal" onClick={closeImageModal}>
                                        <img src={selectedImage} alt="Selected" className="modal-image" />
                                    </div>
                                )}

                                {/* Author Information */}
                                <div className="author-info">
                                    <h3>Thông tin người đăng</h3>
                                    <img src={postData.author.avatarURL} alt="Avatar" className="author-avatar" />
                                    <p><strong>Họ và tên:</strong> {postData.author.fullName}</p>
                                    <p><strong>Tuổi:</strong> {postData.author.age}</p>
                                    <p><strong>Số điện thoại:</strong> {postData.author.phonenumber}</p>
                                    <p><strong>Email:</strong> {postData.author.email}</p>
                                </div>

                                {status !== 1 && status !== 0 && postData.censor && (
                                    <div className="author-info">
                                        <h3>Thông tin người duyệt</h3>
                                        <img src={postData.censor.avatarURL} alt="Censor Avatar" className="author-avatar" />
                                        <p><strong>Họ và tên:</strong> {postData.censor.fullName}</p>
                                        <p><strong>Tuổi:</strong> {postData.censor.age}</p>
                                        <p><strong>Số điện thoại:</strong> {postData.censor.phonenumber}</p>
                                        <p><strong>Email:</strong> {postData.censor.email}</p>
                                    </div>
                                )}

                                {/* Conditional Button Rendering */}
                                <div className="action-section">
                                    {status === 1 ? (
                                        <>
                                            <button onClick={handleApprove} className="btn-approve">Duyệt</button>
                                            <button onClick={handleReject} className="btn-reject">Không Duyệt</button>
                                            <textarea
                                                value={banReason}
                                                onChange={(e) => setBanReason(e.target.value)}
                                                placeholder="Nhập lý do không duyệt"
                                                className="reason-textarea"
                                            />
                                        </>
                                    ) : status === 2 ? (
                                        <>
                                            <button onClick={handleBan} className="btn-ban">Cấm</button>
                                            <textarea
                                                value={banReason}
                                                onChange={(e) => setBanReason(e.target.value)}
                                                placeholder="Nhập lý do cấm"
                                                className="reason-textarea"
                                            />
                                        </>
                                    ) : null}
                                </div>

                                {reports.totalCount > 0 && (
                                    <div className="report-section">
                                        <h3>Danh sách báo cáo</h3>
                                        {reports.items.map((report, index) => (
                                            <div key={index} className="report-item">
                                                <div className="reporter-info">
                                                    <img src={report.jobSeeker.avatarURL} alt="Reporter Avatar" className="author-avatar" />
                                                    <p><strong>Họ và tên:</strong> {report.jobSeeker.fullName}</p>
                                                    <p><strong>Email:</strong> {report.jobSeeker.email}</p>
                                                </div>
                                                <p><strong>Lý do báo cáo:</strong> {report.reason}</p>

                                                {report.reportMedia && report.reportMedia.length > 0 && (
                                                    <div className="report-images">
                                                        {report.reportMedia.map((media, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={media.image.url}
                                                                alt={`Report Media ${idx + 1}`}
                                                                className="image-thumbnail"
                                                                onClick={() => handleImageClick(media.image.url)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Pagination buttons */}
                                        <div className="pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </button>
                                            <span>Trang {currentPage} / {reports.totalPages}</span>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, reports.totalPages))}
                                                disabled={currentPage === reports.totalPages}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    <style jsx>{`
            .report-section {
                    margin-top: 20px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                
                .report-item {
                    margin-top: 15px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #e9ecef;
                }

                .reporter-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .report-images {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .post-job-container {
                    padding: 20px;
                    max-width: 80%;
                    margin: 0 auto;
                }

                .post-job-details {
                    background-color: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                .author-info {
                    background-color: #e9ecef;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .author-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 15px;
                }

                .action-section {
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .reason-textarea {
                    width: 100%;
                    height: 80px;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                    resize: none;
                }

                .btn-approve, .btn-reject, .btn-ban, .btn-unban {
                    padding: 10px 20px;
                    color: #fff;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    font-size: 16px;
                }

                .btn-approve {
                    background-color: #28a745;
                }

                .btn-reject {
                    background-color: #dc3545;
                }

                .btn-ban {
                    background-color: #ffc107;
                }

                .btn-unban {
                    background-color: #007bff;
                }

                .btn-approve:hover {
                    background-color: #218838;
                }

                .btn-reject:hover {
                    background-color: #c82333;
                }

                .btn-ban:hover {
                    background-color: #e0a800;
                }

                .btn-unban:hover {
                    background-color: #0069d9;
                }
                    .images-gallery {
    margin-top: 30px;
}

.image-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
}

.image-thumbnail {
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.image-thumbnail:hover {
    transform: scale(1.1);
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

.modal-image {
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    object-fit: contain;
}
            `}</style>
                </>
            </main>
        </div>

    );
}

export default PostJobDetail;
