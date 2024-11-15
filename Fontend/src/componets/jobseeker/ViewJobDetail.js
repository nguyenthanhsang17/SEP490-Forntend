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
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';

function ViewJobDetail() {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate(); // Moved navigate to top-level only

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure token is correctly retrieved

       
        const headers = {
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        };
  
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`, { headers });
        setJobDetails(response.data); // Lưu dữ liệu công việc vào state
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
          <h1>{jobDetails.jobTitle}</h1>
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
                <h4 className="designation">Người đăng: {jobDetails.authorName}</h4>
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
                  {/* Nút Ứng tuyển ngay */}
                  <button
                    
                    className="button apply-button"
                    title="Ứng tuyển ngay"
                    onClick={() => {
                      const token = localStorage.getItem('token');
                      if (!token) {
                        navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
                      } else {
                        // Thêm logic để ứng tuyển vào công việc ở đây
                        navigate(`/ApplyJob/${id}`);
                        console.log("Đang ứng tuyển vào công việc...");
                      }
                    }}
                  >
                    Ứng tuyển ngay
                  </button>

                  {/* Nút Lưu tin */}
                  {jobDetails.isWishJob ? (
                    <button className="button save-button">
                      <FontAwesomeIcon style={{ color: "#ff6666" }} icon={jobDetails.isWishJob ? faHeart : faHeart} /> Đã Lưu
                    </button>
                  ) : (
                    <button onClick={toggleSaveJob} className="button save-button">
                      <FontAwesomeIcon icon={jobDetails.isWishJob ? faHeart : faHeart} /> Lưu tin
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
                    Báo cáo
                  </button>
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

export default ViewJobDetail;
