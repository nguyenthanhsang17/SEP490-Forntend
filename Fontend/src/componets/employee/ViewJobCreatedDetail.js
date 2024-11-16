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
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`);
        setJobDetails(response.data);
        if (response.data.slotDTOs && response.data.slotDTOs.length > 0) {
          setSchedules(response.data.slotDTOs);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Không thể tải chi tiết công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

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
        {jobDetails.slotDTOs ? (
          <div style={styles.container}>
            {schedules.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                  <thead>
                    <tr>
                      {daysOfWeek.map((day, index) => (
                        <th key={index} style={{
                          border: '1px solid #ddd',
                          padding: '12px 8px',
                          backgroundColor: '#f2f2f2',
                          minWidth: '200px'
                        }}>
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
                            <td key={dayIndex} style={{
                              border: '1px solid #ddd',
                              padding: '8px',
                              verticalAlign: 'top'
                            }}>
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

        {jobDetails.jobPostDateDTOs ? (<div className="container">
          {jobDetails.jobPostDateDTOs ? (<div style={styles.dateGrid}>
            {jobDetails.jobPostDateDTOs.map((date, index) => (
              <div key={index} style={styles.dateCard}>
                <h3 style={styles.cardTitle}>Ngày làm việc {index + 1}</h3>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Ngày:</label>
                  <input
                    type="date"
                    value={date.eventDate ? date.eventDate.slice(0, 10) : new Date().toISOString().split('T')[0]}
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}  // Giới hạn ngày chọn chỉ có thể là ngày hiện tại trở đi
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
          </div>) : (<p style={{ color: '#999' }}>Không có lịch làm việc</p>)}
        </div>) : ("")}
      </section>
      <Footer />
    </>
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


export default ViewJobCreatedDetail;
