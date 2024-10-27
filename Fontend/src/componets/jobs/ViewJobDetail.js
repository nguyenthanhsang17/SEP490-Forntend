import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import Map from '../utils/Map';
import { useParams } from 'react-router-dom'; // Import useParams

function ViewJobDetail() {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error message
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Không thể tải chi tiết công việc. Vui lòng thử lại sau."); // Set error message
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
    return <div style={styles.noJob}>{error}</div>; // Hiển thị thông báo lỗi
  }

  if (!jobDetails) {
    return <div style={styles.noJob}>No job details found.</div>;
  }
  const ImageGallery = ({ imageUrls }) => {
    const galleryStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center', // Căn giữa các ảnh
    };
  
    const imageItemStyle = {
      margin: '10px', // Khoảng cách giữa các ảnh
      maxWidth: '200px', // Độ rộng tối đa của ảnh
      height: 'auto', // Chiều cao tự động
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
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Job Schedule</h2>
            {slotDTOs.map((slot, index) => (
                <div
                    key={slot.slotId}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <h3 style={{ color: '#4a90e2' }}>Slot {index + 1}</h3>
                    {slot.jobScheduleDTOs.length > 0 ? (
                        slot.jobScheduleDTOs.map((schedule) => (
                            <div
                                key={schedule.scheduleId}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                <h4>Day: {getDayOfWeek(schedule.dayOfWeek)}</h4>
                                {schedule.workingHourDTOs.length > 0 ? (
                                    <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                        {schedule.workingHourDTOs.map((workingHour) => (
                                            <li
                                                key={workingHour.workingHourId}
                                                style={{
                                                    backgroundColor: '#eaf3ff',
                                                    margin: '5px 0',
                                                    padding: '8px',
                                                    borderRadius: '5px',
                                                }}
                                            >
                                                {workingHour.startTime} - {workingHour.endTime}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: '#999' }}>No working hours available</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#999' }}>No schedules available for this slot</p>
                    )}
                </div>
            ))}
        </div>
    );
};

// Updated helper function to convert `dayOfWeek` to the actual Vietnamese day names
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
    return days[dayOfWeek] || 'Unknown Day';
};


  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)` }}>
        <div className="container">
          <h1>Chi tiết công việc</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={jobDetails.imagePostJobs[0]} className="img" alt="Company Logo" />
              <a href="#" className="detail-edit" title="Sửa"><i className="fa fa-pencil"></i></a>
            </div>
            <div className="detail-status">
              <span>{jobDetails.jobCategoryName}</span>
            </div>
          </div>

          <div className="row bottom-mrg">
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4>{jobDetails.jobTitle}</h4>
                <span className="designation">Người đăng: {jobDetails.authorName}</span>
                <ul>
                  <li><i className="fa fa-briefcase"></i><span>{jobDetails.numberPeople} người/{jobDetails.numberAppliedUser} đã ứng tuyển</span></li>
                  <li><i className="fa fa-money"></i><span>{jobDetails.salaryTypeName}: {jobDetails.salary} VND</span></li>
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
                  <a href="#" className="footer-btn grn-btn" title="">Ứng tuyển ngay</a>
                  <a href="#" className="footer-btn blu-btn" title="">Lưu tin</a>
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

      {/* Hiển thị bản đồ */}
      <section className="map-section">
        <div className="container">
          <h2 className="detail-title">Vị trí công việc</h2>
          <Map
            latitude={jobDetails.latitude}
            longitude={jobDetails.longitude}
            employerLatitude={jobDetails.employerLatitude} // Add this line
            employerLongitude={jobDetails.employerLongitude} // Add this line
          />
        </div>
      </section>
      <section className="map-section">
      <div className="container">
          <h2 className="detail-title">lịch làm việc</h2>
          <GenerateSlotDTOs slotDTOs={jobDetails.slotDTOs} />
        </div>
      </section>

      <Footer />
    </>
  );
}
<style jsx>{`
        /* src/ImageGallery.css */
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Căn giữa các ảnh */
}

.image-item {
  margin: 10px; /* Khoảng cách giữa các ảnh */
  max-width: 200px; /* Độ rộng tối đa của ảnh */
  height: auto; /* Chiều cao tự động */
}

      `}</style>

// Styles defined as an object
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
    color: '#e74c3c', // Màu đỏ cho thông báo không tìm thấy công việc
    margin: '2rem 0',
  },
  expirationDate: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#d9534f', // Màu đỏ đậm cho ngày hết hạn
  },
};

export default ViewJobDetail;
