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

  const toggleSaveJob = async () => {
    if (jobDetails) {
      try {
        const token = localStorage.getItem('token'); // Ensure token is correctly retrieved
  
        if (!token) {
          throw new Error("Authorization token not found. Please log in.");
        }
  
        const url = jobDetails.isSaved
          ? `https://localhost:7077/api/WishJobs/DeleteWishJob`
          : 'https://localhost:7077/api/WishJobs/AddWishJob';
  
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
        setJobDetails((prevDetails) => ({ ...prevDetails, isSaved: !prevDetails.isSaved }));
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
    const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

    const shiftTimes = {
      1: "08:00 - 12:00",
      2: "13:00 - 17:00",
      3: "17:30 - 21:30",
      4: "22:00 - 02:00",
    };

    const findSchedule = (slot, day) => {
      return slot.jobScheduleDTOs.find(
        (schedule) => getDayOfWeek(schedule.dayOfWeek) === day
      );
    };

    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#e0e0e0" }}>
              <th style={tableStyles.header}>Ca</th>
              {daysOfWeek.map((day, index) => (
                <th key={index} style={tableStyles.header}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slotDTOs.map((slot, index) => (
              <tr key={slot.slotId} style={tableStyles.row}>
                <td style={tableStyles.cell}>Ca {index + 1} ({shiftTimes[index + 1] || "Không xác định"})</td>
                {daysOfWeek.map((day) => {
                  const schedule = findSchedule(slot, day);
                  return (
                    <td key={day} style={tableStyles.cell}>
                      {schedule ? (
                        shiftTimes[index + 1] || "Không xác định"
                      ) : (
                        "-"
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getDayOfWeek = (dayOfWeek) => {
    const days = {
      2: 'Thứ 2',
      3: 'Thứ 3',
      4: 'Thứ 4',
      5: 'Thứ 5',
      6: 'Thứ 6',
      7: 'Thứ 7',
      8: 'Chủ Nhật',
    };
    return days[dayOfWeek] || 'Không xác định';
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
                  <button className="button apply-button" title="Apply Now">Ứng tuyển ngay</button>
                  <button onClick={toggleSaveJob} className="button save-button" title={jobDetails.isSaved ? "Unsave" : "Save"}>
                    <FontAwesomeIcon icon={jobDetails.isSaved ? faTrash : faHeart} /> {jobDetails.isSaved ? "Bỏ lưu" : "Lưu tin"}
                  </button>
                  <button onClick={() => navigate(`/reportPostJob/${id}`)} className="button report-button" title="Report">Báo cáo</button>
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

const tableStyles = {
  header: {
    padding: '10px',
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  cell: {
    padding: '10px',
  },
};

const styles = {
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#555',
    margin: '2rem 0',
  },
  noJob: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#e74c3c',
    margin: '2rem 0',
  },
  expirationDate: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#d9534f',
  },
};

export default ViewJobDetail;
