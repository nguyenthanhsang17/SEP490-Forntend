import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Map from '../utils/Map';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function ViewJobCreatedDetail() {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Không thể tải chi tiết công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.noJob}>{error}</div>;
  }

  if (!jobDetails) {
    return <div style={styles.noJob}>Không tìm thấy chi tiết công việc.</div>;
  }

  const ImageGallery = ({ imageUrls }) => {
    const galleryStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    };

    const imageItemStyle = {
      margin: '10px',
      maxWidth: '200px',
      height: 'auto',
    };

    return (
      <div style={galleryStyle}>
        {imageUrls.map((url, index) => (
          <img key={index} src={url} alt={`image-${index}`} style={imageItemStyle} />
        ))}
      </div>
    );
  };

  const GenerateSlotDTOs = ({ slotDTOs }) => {
    const daysOfWeek = [
      { name: "Thứ 2", icon: "📅" },
      { name: "Thứ 3", icon: "📅" },
      { name: "Thứ 4", icon: "📅" },
      { name: "Thứ 5", icon: "📅" },
      { name: "Thứ 6", icon: "📅" },
      { name: "Thứ 7", icon: "📅" },
      { name: "Chủ Nhật", icon: "🌞" }
    ];

    // Hàm lấy lịch làm việc cho từng ngày
    const getWorkingHoursForDay = (dayOfWeek) => {
      const scheduleForDay = slotDTOs
        .flatMap(slot => slot.jobScheduleDTOs)
        .find(schedule => schedule.dayOfWeek === dayOfWeek);

      if (!scheduleForDay) return null;

      // Trả về tất cả các khoảng thời gian trong ngày
      return scheduleForDay.workingHourDTOs.map(hour => `${hour.startTime} - ${hour.endTime}`);
    };

    return (
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              {daysOfWeek.map((day, index) => (
                <th key={index} style={styles.tableHeader}>
                  {day.icon} {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {daysOfWeek.map((day, dayIndex) => {
                const workingHours = getWorkingHoursForDay(dayIndex + 2); // Ngày bắt đầu từ 2 (Thứ 2)
                return (
                  <td key={dayIndex} style={styles.tableCell}>
                    {workingHours ? workingHours.join(" ") : "-"}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const handleRequestApproval = async () => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc muốn gửi yêu cầu duyệt bài không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const apiEndpoint = `https://localhost:7077/api/PostJobs/RequestForPublicPost/${id}`;
        await axios.put(apiEndpoint, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await Swal.fire({
          title: 'Gửi yêu cầu duyệt bài thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setJobDetails({ ...jobDetails, status: 1 }); // Cập nhật trạng thái bài đăng
      }
    } catch (error) {
      console.error("Failed to send request approval:", error);
      await Swal.fire({
        title: 'Gửi yêu cầu không thành công!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleCancelApprovalRequest = async () => {
    try {
      const result = await Swal.fire({
        title: 'Bạn có chắc muốn hủy yêu cầu duyệt bài không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const apiEndpoint = `https://localhost:7077/api/PostJobs/CancelRequestForPublicPost/${id}`;
        await axios.put(apiEndpoint, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await Swal.fire({
          title: 'Hủy yêu cầu duyệt bài thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setJobDetails({ ...jobDetails, status: 0 }); // Cập nhật trạng thái bài đăng
      }
    } catch (error) {
      console.error("Failed to cancel request approval:", error);
      await Swal.fire({
        title: 'Hủy yêu cầu không thành công!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleHidePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiEndpoint = `https://localhost:7077/api/PostJobs/HidePostJob/${id}`;
      await axios.put(apiEndpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire({
        title: 'Ẩn bài viết thành công!',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      setJobDetails({ ...jobDetails, status: 5 }); // Cập nhật trạng thái thành "Đã ẩn"
    } catch (error) {
      console.error("Failed to hide post:", error);
      await Swal.fire({
        title: 'Ẩn bài viết không thành công!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const handleShowPost = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiEndpoint = `https://localhost:7077/api/PostJobs/ShowPostJob/${id}`;
      await axios.put(apiEndpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire({
        title: 'Hiện bài viết thành công!',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
      setJobDetails({ ...jobDetails, status: 2 }); // Cập nhật trạng thái thành "Đã đăng"
    } catch (error) {
      console.error("Failed to show post:", error);
      await Swal.fire({
        title: 'Hiện bài viết không thành công!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };


  // Định nghĩa ánh xạ trạng thái
  const statusLabels = {
    0: "Bản nháp",
    1: "Chờ phê duyệt",
    2: "Đã đăng",
    3: "Bị từ chối",
    4: "Đã xóa",
    5: "Đã ẩn",
    6: "Bị cấm"
  };

  const salaryTypeMap = {
    "Theo giờ": "giờ",
    "Theo ngày": "ngày",
    "Theo công việc": "công việc",
    "Theo tuần": "tuần",
    "Theo tháng": "tháng",
    "Lương cố định": "cố định",
  };

  const formatWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Hàm lấy nhãn trạng thái từ mã trạng thái
  const getStatusLabel = (status) => {
    return statusLabels[status] || "Không xác định";
  };

  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)` }}>
        <div className="container">
          <h1>{jobDetails.jobTitle}</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      {/* Nút Quay Lại */}
      <div className="container">
        <button
          className="btn back-btn"

          style={{
            margin: "20px 0",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Quay lại
        </button>
      </div>
      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={jobDetails.imagePostJobs[0]} className="img" alt="Company Logo" />
            </div>
            <div className="detail-status">
              <span>{getStatusLabel(jobDetails.status)}</span>
            </div>
          </div>

          <div className="row bottom-mrg">
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4>{jobDetails.jobCategoryName}</h4>
                <span></span>
                <ul>
                  <li><i className="fa fa-briefcase"></i><span>{jobDetails.numberPeople} người/{jobDetails.numberAppliedUser} đã ứng tuyển</span></li>
                  <li>
                    Mức lương: {formatWithCommas(jobDetails.salary)} VND/{salaryTypeMap[jobDetails.salaryTypeName]}
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="get-touch">
                <h4>Địa chỉ</h4>
                <ul>
                  <li><i className="fa fa-map-marker"></i><span>{jobDetails.address}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row no-padd">
            <div className="detail pannel-footer">
              <div className="col-md-5 col-sm-5">
                <h4 style={styles.expirationDate}>
                  Ngày hết hạn: {new Date(jobDetails.expirationDate).toLocaleDateString('en-GB')}
                </h4>
              </div>
              <div className="col-md-7 col-sm-7">
                <div className="detail-pannel-footer-btn pull-right">
                  {jobDetails.status === 0 && (
                    <>
                      <button
                        className="btn btn-primary"
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#007bff", // Xanh dương nhạt
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={handleRequestApproval}
                      >
                        Gửi yêu cầu duyệt bài
                      </button>
                      <button
                        className="btn btn-success"
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#28a745", // Xanh lá
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() => window.location.href = `/EditPostJob/${id}`}
                      >
                        Chỉnh sửa bài đăng
                      </button>
                    </>
                  )}

                  {jobDetails.status === 1 && (
                    <button
                      className="btn btn-warning"
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#ffc107", // Vàng
                        border: "none",
                        color: "#212529",
                      }}
                      onClick={handleCancelApprovalRequest}
                    >
                      Hủy yêu cầu duyệt bài
                    </button>
                  )}

                  {jobDetails.status === 2 && (
                    <>
                      <button
                        className="btn btn-info"
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#17a2b8", // Xanh cyan
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() => window.location.href = `/ViewAllJobseekerApply/${id}`}
                      >
                        Danh sách ứng viên đã ứng tuyển
                      </button>
                      <button
                        className="btn btn-danger"
                        style={{
                          backgroundColor: "#dc3545", // Đỏ
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={handleHidePost} // Hàm xử lý ẩn bài viết
                      >
                        Ẩn bài viết
                      </button>
                    </>
                  )}

                  {jobDetails.status === 5 && (
                    <>
                      <button
                        className="btn btn-info"
                        style={{
                          marginRight: "10px",
                          backgroundColor: "#17a2b8", // Xanh cyan
                          border: "none",
                          color: "#fff",
                        }}
                        onClick={() => window.location.href = `/ViewAllJobseekerApply/${id}`}
                      >
                        Danh sách ứng viên đã ứng tuyển
                      </button>
                      <button
                        className="btn btn-success"
                        style={{
                          backgroundColor: "#28a745", // Xanh lá sáng
                          border: "none",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                        onClick={handleShowPost} // Hàm xử lý hiện bài viết
                      >
                        Hiện bài viết
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Mô tả công việc</h2>
            <p>{jobDetails.jobDescription}</p>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Hình ảnh của công việc</h2>
            <ImageGallery imageUrls={jobDetails.imagePostJobs} />
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="detail-title">Vị trí công việc</h2>
          <Map
            latitude={jobDetails.latitude}
            longitude={jobDetails.longitude}
            employerLatitude={jobDetails.employerLatitude}
            employerLongitude={jobDetails.employerLongitude}
          />
        </div>
      </section>

      <section className="map-section">
        <div className="container">
          <h2 className="detail-title">Lịch Làm Việc</h2>
          {jobDetails.slotDTOs ? (
            <GenerateSlotDTOs slotDTOs={jobDetails.slotDTOs} />
          ) : (
            <p style={{ color: '#999' }}>Không có lịch làm việc</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableHeaderRow: {
    backgroundColor: "#3e8e41",
  },
  tableHeader: {
    padding: "12px",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    border: "1px solid #3e8e41",
  },
  tableRowEven: {
    backgroundColor: "#f9f9f9",
  },
  tableRowOdd: {
    backgroundColor: "#eaf2e3",
  },
  tableCell: {
    padding: "10px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    fontSize: "15px",
    color: "#555",
    borderRight: "1px solid #ddd",
  },
  expirationDate: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#d9534f',
  },
};


export default ViewJobCreatedDetail;
