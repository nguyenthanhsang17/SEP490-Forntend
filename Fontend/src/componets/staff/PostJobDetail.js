import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [schedules, setSchedules] = useState();
  const token = localStorage.getItem("token");
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
  const daysOfWeek = [
    { name: "Thứ 2", icon: "📅" },
    { name: "Thứ 3", icon: "📅" },
    { name: "Thứ 4", icon: "📅" },
    { name: "Thứ 5", icon: "📅" },
    { name: "Thứ 6", icon: "📅" },
    { name: "Thứ 7", icon: "📅" },
    { name: "Chủ Nhật", icon: "🌞" }
  ];
  const statusMapping = {
    0: 'Nháp',
    1: 'Chờ Duyệt',
    2: 'Đã duyệt',
    3: 'Bị từ chối',
    4: 'Đã xóa',
    5: 'Đã ẩn',
    6: 'Bị Cấm',
  };

  const getMaxWorkingHours = () => {
    if (!schedules || schedules.length === 0) return 0;

    // Lấy slot hiện tại
    const currentSlot = schedules[activeScheduleIndex];

    // Tìm số lượng giờ làm việc nhiều nhất trong các ngày
    const maxHours = currentSlot.jobScheduleDTOs.reduce((max, schedule) => {
      return Math.max(max, schedule.workingHourDTOs.length);
    }, 0);

    return maxHours;
  };

  const getWorkingHoursForDay = (dayOfWeek) => {
    if (!schedules || schedules.length === 0) return null;

    const currentSlot = schedules[activeScheduleIndex];
    const scheduleForDay = currentSlot.jobScheduleDTOs.find(
      schedule => schedule.dayOfWeek === dayOfWeek
    );

    if (!scheduleForDay) return null;

    return scheduleForDay.workingHourDTOs.map(
      hour => `${hour.startTime.slice(0, 5)} - ${hour.endTime.slice(0, 5)}`
    );
  };
  

  useEffect(() => {
    axios.get(`https://localhost:7077/api/PostJobs/GetPostDetailForStaff?id=${job_id}`)
      .then(response => {
        setPostData(response.data);
        setIsBanned(response.data.status === 3);
        console.log(response.data.status===1);
        console.log(response.data.status);
        setStatus(response.data.status);
        if (response.data.slots && response.data.slots.length > 0) {
          setSchedules(response.data.slots);
        }
      })
      .catch(error => console.error('Error fetching post data:', error));
  }, [job_id]);

  const handleApprove = async () => {
    setIsButtonDisabled(true);
    try {
      // Hiển thị xác nhận
      const result = await Swal.fire({
        title: 'Bạn có chắc muốn  duyệt bài viết này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });
      if (result.isConfirmed) {
        const response = await fetch(`https://localhost:7077/api/PostJobs/Accept/${job_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        await Swal.fire({
          title: 'Đã duyệt bài thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });

        navigate(`/ViewDetail/${job_id}`);
        window.location.reload()

      }

    } catch (error) {
      console.error("Failed to send request:", error);
      await Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
    setIsButtonDisabled(false);
  };

  const handleReject = async () => {
    if (!banReason) {
      await Swal.fire({
        title: 'Nhập lý do từ chối',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }
    setIsButtonDisabled(true);

    try {
      // Hiển thị xác nhận
      const result = await Swal.fire({
        title: 'Bạn có chắc muốn từ chối bài viết này ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });
      if (result.isConfirmed) {
        const response = await fetch(`https://localhost:7077/api/PostJobs/Reject/${job_id}?reasonRejecr=${encodeURIComponent(banReason)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        await Swal.fire({
          title: 'Từ chối bài viết thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        navigate(`/ViewDetail/${job_id}`);
        window.location.reload()
      }
      // Gọi API từ chối duyệt bài viết với lý do từ textarea

    } catch (error) {
      console.error("Failed to send request:", error);
      await Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
    setIsButtonDisabled(false);
  };

  const handleBan = async () => {
    if (!banReason) {
      await Swal.fire({
        title: 'Nhập lý do cấm',
        icon: 'warning',
        confirmButtonText: 'Ok',
      });
      return;
    }

    setIsButtonDisabled(true);
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc muốn cấm bài viết này ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });
      if (result.isConfirmed) {
        // Gọi API cấm bài viết với lý do
        const response = await fetch(`https://localhost:7077/api/PostJobs/Ban/${job_id}?reasonBan=${encodeURIComponent(banReason)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        await Swal.fire({
          title: 'Từ chối bài viết thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        window.location.reload()
      }


    } catch (error) {
      console.error("Failed to send request:", error);
      await Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
    setIsButtonDisabled(false);
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

  const closeImageModal = (e) => {
    // Chỉ đóng modal khi click vào phần nền
    if (e.target.classList.contains('modal')) {
      setShowImage(false);
    }
  };
  function removeTheo(text) {
    if (text.startsWith("Theo ")) {
      return text.slice(5); // Bỏ chữ "Theo " (5 ký tự đầu)
    }
    return text; // Trả về chuỗi gốc nếu không bắt đầu bằng "Theo "
  }

  return (

    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="container">
          <h1 className="pageTitle">Chi tiết công việc</h1>

          {postData ? (
            <div className="layout-container">
              <div className="details-container">
                <h2 className="section-title">{postData.jobTitle}</h2>
                <div className="info-item">
                  <strong>Mô tả công việc:</strong> {postData.jobDescription}
                </div>
                <div className="info-item">
                  <strong>Địa chỉ:</strong> {postData.address}
                </div>
                <div className="info-item">
                  <strong>Số lượng tuyển:</strong> {postData.numberPeople} người
                </div>
                <div className="info-item">
                  <strong>Mức lương:</strong> {postData.salary.toLocaleString()} VND / {removeTheo(postData.salaryTypes.typeName)}
                </div>
                <div className="info-item">
                  <strong>Ngày tạo:</strong> {new Date(postData.createDate).toLocaleDateString()}
                </div>
                <div className="info-item">
                  <strong>Thời gian duy trì:</strong> {postData.time}
                </div>
                <div className="info-item">
                  <strong>Trạng thái:</strong> {statusMapping[postData.status]}
                </div>
                {postData.status === 3 && (
                  <div className="info-item">
                    <strong>Lý do từ chối:</strong> {postData.reason}
                  </div>
                )}
                <section style={{width: "750px", marginTop: "0px"}}>
                  <div className="container">
                    <div className="row row-bottom">
                      {postData.slots ? (
                        <div style={styles.container}>
                          
                          {Array.isArray(schedules) && schedules.length > 0 && (
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                  <tr>
                                    {daysOfWeek.map((day, index) => (
                                      <th
                                        key={index}
                                        style={{
                                          border: '1px solid #ddd',
                                          padding: '5px 5px',
                                          backgroundColor: '#f2f2f2',
                                          minWidth: '200px',
                                        }}
                                      >
                                        <div style={{ marginBottom: '10px' }}>{day.name}{day.icon}</div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {[...Array(getMaxWorkingHours())].map((_, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {daysOfWeek.map((_, dayIndex) => {
                                        const workingHours = getWorkingHoursForDay(dayIndex + 2);
                                        return (
                                          <td
                                            key={dayIndex}
                                            style={{
                                              border: '1px solid #ddd',
                                              padding: '8px',
                                              verticalAlign: 'top',
                                            }}
                                          >
                                            {workingHours && workingHours[rowIndex] ? workingHours[rowIndex] : '-'}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {postData.jobPostDates ? (
                        <div className="container">
                          {postData.jobPostDates ? (
                            <div style={styles.dateGrid}>
                              {postData.jobPostDates.map((date, index) => (
                                <div key={index} style={styles.dateCard}>
                                  <h3 style={styles.cardTitle}>Ngày làm việc {index + 1}</h3>
                                  <div style={styles.formGroup}>
                                    <label style={styles.label}>Ngày:</label>
                                    <input
                                      type="date"
                                      value={date.eventDate ? date.eventDate.slice(0, 10) : new Date().toISOString().split('T')[0]}
                                      style={styles.input}
                                      min={new Date().toISOString().split('T')[0]} // Giới hạn ngày chọn chỉ có thể là ngày hiện tại trở đi
                                      readOnly
                                    />
                                  </div>

                                  <div style={styles.formGroup}>
                                    <label style={styles.label}>Giờ bắt đầu:</label>
                                    <input
                                      type="time"
                                      value={date.startTime}
                                      style={styles.input}
                                      readOnly
                                    />
                                  </div>

                                  <div style={styles.formGroup}>
                                    <label style={styles.label}>Giờ kết thúc:</label>
                                    <input
                                      type="time"
                                      value={date.endTime}
                                      style={styles.input}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#999' }}>Không có lịch làm việc</p>
                          )}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </section>
                {postData.imagePostJobs && postData.imagePostJobs.length > 0 && (
                  <div className="images-container">
                    <strong>Hình ảnh công việc:</strong>
                    <div className="image-gallery">
                      {postData.imagePostJobs.map((image, index) => (
                        <img
                          key={index}
                          src={image.image.url}
                          alt={`Image ${index + 1}`}
                          className="job-image image-thumbnail"
                          onClick={() => handleImageClick(image.image.url)}
                        />
                      ))}
                    </div>
                    <div className="action-buttons">
                      {status === 1 ? (
                        <>
                          <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Nhập lý do không duyệt"
                            className="reason-input"
                          />
                          <button onClick={handleApprove} disabled={isButtonDisabled} className="approve-button">Duyệt</button>
                          <button onClick={handleReject} disabled={isButtonDisabled} className="reject-button">Không Duyệt</button>
                        </>
                      ) : status === 2 ? (
                        <>
                          <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Nhập lý do cấm"
                            className="reason-input"
                          />
                          <button onClick={handleBan} disabled={isButtonDisabled} className="btn-ban">Cấm</button>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}

                
              </div>

              <div className="sidebar">
                <div className="user-info">
                  <div className="user-item">
                    <img src={postData.author.avatarURL} alt="Avatar" className="user-avatar" />
                    <div className="user-details">
                      <div className="info-item">
                        <strong>Người đăng:</strong> {postData.author.fullName}
                      </div>
                      <div className="info-item">
                        <strong>Tuổi:</strong> {postData.author.age}
                      </div>
                      <div className="info-item">
                        <strong>Số điện thoại:</strong> {postData.author.phonenumber}
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong> {postData.author.email}
                      </div>
                    </div>
                  </div>
                </div>

                {status !== 1 && status !== 0 && postData.censor && (
                  <div className="user-info">
                    <div className="user-item">
                      <img src={postData.censor.avatarURL} alt="Censor Avatar" className="user-avatar" />
                      <div className="user-details">
                        <div className="info-item">
                          <strong>Người duyệt:</strong> {postData.censor.fullName}
                        </div>
                        <div className="info-item">
                          <strong>Số điện thoại:</strong> {postData.censor.phonenumber}
                        </div>
                        <div className="info-item">
                          <strong>Email:</strong> {postData.censor.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Đang tải thông tin chi tiết công việc...</p>
          )}



          {reports.totalCount > 0 && (
            <div className="report-section">
              <h2 className="section-title">Danh sách báo cáo</h2>
              {reports.items.map((report, index) => (
                <div key={index} className="report-item">
                  <div >
                    <strong>Lý do báo cáo:</strong> {report.reason}
                  </div>
                  {report.reportMedia && report.reportMedia.length > 0 && (
                    <div className="report-images-container">
                      {report.reportMedia.map((media, idx) => (
                        <img
                          key={idx}
                          src={media.image.url}
                          alt={`Report Media ${idx + 1}`}
                          className="report-image-thumbnail"
                          onClick={() => handleImageClick(media.image.url)}
                        />
                      ))}
                    </div>
                  )}
                  <div className="reporter-info">
                    <img src={report.jobSeeker.avatarURL} alt="Reporter Avatar" className="user-avatar" />
                    <div className="reporter-details">
                      <div className="info-item">
                        <strong>Họ và tên:</strong> {report.jobSeeker.fullName}
                      </div>
                      <div className="info-item">
                        <strong>Email:</strong> {report.jobSeeker.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </button>
                <span>Trang {currentPage} / {reports.totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, reports.totalPages))}
                  disabled={currentPage === reports.totalPages}
                >
                  Trang sau
                </button>
              </div>
            </div>
          )}

          {showImage && (
            <div
              className="modal"
              onClick={closeImageModal}
            >
              <div className="modal-wrapper">
                <div className="modal-content">
                  <button
                    className="close-button"
                    onClick={() => setShowImage(false)}
                  >
                    ×
                  </button>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="modal-image"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>



      <style jsx>{`
  .container {
    max-width: 100%;
    margin: 0 auto;
    padding: 10px;
    background-color: #f9fafb;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }

  .pageTitle {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: 700;
    border-bottom: 3px solid #3498db;
    padding-bottom: 15px;
  }

  .layout-container {
    display: flex;
    gap: 20px;
  }

  .details-container,
  .user-info,
  .report-section {
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }

  .details-container:hover,
  .user-info:hover,
  .report-section:hover,
  .sidebar:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
  }

  .details-container {
    flex: 2;
  }

  .sidebar {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: white;
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 25px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    align-self: stretch;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f5;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  .info-item strong {
    color: #2c3e50;
    font-weight: 600;
    font-size: 15px;
    flex-shrink: 0;
  }

  .info-item span {
    color: #34495e;
    font-size: 15px;
    flex-grow: 1;
    text-align: right;
    margin-left: 10px;
  }

  .images-container {
    margin-top: 15px;
  }

  .image-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .job-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  .job-image:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  .report-images-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 15px; /* Khoảng cách giữa lý do báo cáo và hình ảnh */
  }

  .report-image-thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .report-image-thumbnail:hover {
    transform: scale(1.05);
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
    overflow: hidden;
    position: fixed;
    touch-action: none; /* Ngăn cuộn trên mobile */
  }

  .modal-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  }

  .modal-content {
    position: relative;
    max-width: 95%;
    max-height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    -webkit-user-select: none;
    pointer-events: none;
  }

  .close-button {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 40px;
    cursor: pointer;
    z-index: 1001;
    outline: none;
  }

  .close-button:hover {
    color: #f1f1f1;
  }

  /* Prevent image dragging and selection */
  .modal-image {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  .user-info .user-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
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
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .reporter-info {
    display: flex;
    align-items: center;
    margin-top: 15px; /* Khoảng cách giữa lý do báo cáo và thông tin người báo cáo */
  }

  .reporter-info .user-avatar {
    width: 50px;
    height: 50px;
    border: none;
  }

  .reporter-details {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 30px;
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
    width: 200px;
  }

  .approve-button {
    background-color: #2ecc71;
    color: white;
  }

  .reject-button {
    background-color: #e74c3c;
    color: white;
  }

  .btn-ban {
    background-color: #e74c3c;
    color: white;
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
  }

  .reason-input {
    width: 100%;
    max-width: 780px;
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

  .report-item {
    padding: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }

  .report-item .info-item {
    display: flex;
    align-items: center;
  }

  .report-item .info-item strong {
    margin-right: 10px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
    padding: 15px;
    background-color: #f8f9fa;
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
`}</style>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1600px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#343a40',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: '600'
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  dateCard: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    position: 'relative'
  },
  cardTitle: {
    color: '#495057',
    marginBottom: '15px',
    fontSize: '18px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#6c757d',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px',
    transition: 'border-color 0.15s ease-in-out',
    boxSizing: 'border-box'
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  button: {
    flex: 1,
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'opacity 0.2s ease'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  publishButton: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  deleteButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px'
  },
  jsonOutput: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    whiteSpace: 'pre-wrap',
    fontSize: '14px',
    color: '#212529'
  }
};

export default PostJobDetail;
