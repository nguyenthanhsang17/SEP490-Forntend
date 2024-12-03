import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Map from '../utils/Map';
import { useParams, useNavigate } from 'react-router-dom'; // Single import statement
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRotateRight, faPaperPlane, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function ViewJobDetail() {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // Moved navigate to top-level only
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
        const token = localStorage.getItem('token'); // Ensure token is correctly retrieved
        const headers = {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        };
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`, { headers });
        setJobDetails(response.data); // Lưu dữ liệu công việc vào state
        if (response.data.slotDTOs && response.data.slotDTOs.length > 0) {
          setSchedules(response.data.slotDTOs);
        }
        console.log(response.data.isWishJob);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Không thể tải chi tiết công việc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

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

  const applyJob = () => {
    console.log("Ứng tuyển công việc...");
    // Gọi API hoặc logic xử lý ứng tuyển
    // Sau đó, cập nhật trạng thái:
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      isAppliedJob: true, // Đánh dấu trạng thái đã ứng tuyển
    }));
  };

  const toggleSaveJob = async () => {

    if (jobDetails) {
      try {
        const token = localStorage.getItem('token'); // Ensure token is correctly retrieved

        if (!token) {
          navigate("/login");
        }

        const url = 'https://localhost:7077/api/WishJobs/AddWishJob';

        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        };

        const data = { postJobId: id };

        // Log the data being sent to verify its structure
        console.log("Requesting URL:", url);
        console.log("Headers:", headers);
        console.log("Data:", data);

        await axios.post(url, data, { headers });
        setJobDetails((prevDetails) => ({ ...prevDetails, isWishJob: true }));
      } catch (error) {
        console.error("Error toggling save status:", error);
        setError("Không thể cập nhật trạng thái lưu. Vui lòng thử lại sau.");
      }
    }
  };



  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.noJob}>{error}</div>;
  }

  if (!jobDetails) {
    return <div style={styles.noJob}>No job details found.</div>;
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

  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1 style={{marginBottom: '60px'}}>{jobDetails.jobTitle}</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={jobDetails.imagePostJobs[0]} className="img" alt="Company Logo" />
            </div>
            <div className="detail-status">
              <span>{jobDetails.jobCategoryName}</span>
            </div>
          </div>

          <div className="row bottom-mrg">
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4 className="designation">
                  Người đăng:
                  <a
                    href={`/viewEmployerProfile/${jobDetails.authorId}`}
                    style={{
                      color: '#4caf50',  // Màu xanh dương nổi bật
                      textDecoration: 'none',  // Loại bỏ gạch dưới mặc định
                      fontWeight: 'bold',  // Làm đậm tên người đăng
                      padding: '5px 10px',  // Thêm khoảng cách để tạo cảm giác dễ bấm
                      borderRadius: '5px',  // Bo góc để làm nút mềm mại
                      transition: 'all 0.3s ease',  // Hiệu ứng chuyển động mượt mà khi hover
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#e7f3ff'}  // Hiệu ứng khi hover
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}  // Quay lại trạng thái ban đầu khi không hover
                  >
                    {jobDetails.authorName}
                  </a>
                </h4>
                <ul>
                  <li><i className="fa fa-briefcase"></i><span>Số người cần tuyển : {jobDetails.numberPeople} người</span></li>
                  <li>
                  <i className="fa fa-money"></i>Mức lương: {formatWithCommas(jobDetails.salary)} VND/{salaryTypeMap[jobDetails.salaryTypeName]}
                  </li>
                  <li><i className="fa fa-user"></i><span> {jobDetails.numberAppliedUser} lượt đã ứng tuyển</span></li>
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
                {jobDetails.owner === 0 && ( // Chỉ hiển thị khi owner === 0
                  <div className="detail-pannel-footer-btn pull-right">
                    {/* Nút Ứng tuyển ngay hoặc Ứng tuyển lại */}
                    <button
                      className="button apply-button"
                      title={jobDetails.isAppliedJob ? "Ứng tuyển lại" : "Ứng tuyển ngay"}
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
                        } else {
                          // Logic ứng tuyển hoặc ứng tuyển lại
                          if (!jobDetails.isAppliedJob) {
                            navigate(`/ApplyJob/${id}`);
                          } else {
                            navigate(`/ReApplyJob/${id}`);
                          }
                          console.log(jobDetails.isAppliedJob ? "Ứng tuyển lại công việc..." : "Ứng tuyển ngay...");
                          applyJob(); // Hàm để xử lý ứng tuyển hoặc ứng tuyển lại
                        }
                      }}
                    >
                      {jobDetails.isAppliedJob ? (
                        <>
                          <FontAwesomeIcon icon={faRotateRight} style={{ marginRight: "5px" }} />
                          Ứng tuyển lại
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: "5px" }} />
                          Ứng tuyển ngay
                        </>
                      )}
                    </button>

                    {/* Nút Lưu tin */}
                    {jobDetails.isWishJob ? (
                      <button className="button save-button">
                        <FontAwesomeIcon style={{ color: "#ff6666" }} icon={faHeart} /> Đã Lưu
                      </button>
                    ) : (
                      <button onClick={toggleSaveJob} className="button save-button">
                        <FontAwesomeIcon icon={faHeart} /> Lưu tin
                      </button>
                    )}

                    {/* Nút Báo cáo */}
                    <button
                      onClick={() => {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
                        } else {
                          navigate(`/reportPostJob/${id}`);
                        }
                      }}
                      className="button report-button"
                      title="Báo cáo"
                    >
                      <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: "5px" }} />
                      Báo vi phạm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Lịch làm việc</h2>
            {jobDetails.slotDTOs ? (
              <div style={styles.container}>
                {schedules.length > 0 && (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                      <thead>
                        <tr>
                          {daysOfWeek.map((day, index) => (
                            <th
                              key={index}
                              style={{
                                border: '1px solid #ddd',
                                padding: '12px 8px',
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

            {jobDetails.jobPostDateDTOs ? (
              <div className="container">
                {jobDetails.jobPostDateDTOs ? (
                  <div style={styles.dateGrid}>
                    {jobDetails.jobPostDateDTOs.map((date, index) => (
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

export default ViewJobDetail;
