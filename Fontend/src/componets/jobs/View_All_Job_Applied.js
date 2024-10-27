import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

function ViewAllJobApplied() {
  const { id } = useParams();
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState(''); 

  const fetchJobs = async () => { 
    try {
      const response = await axios.get(`https://localhost:7077/api/JobJobSeeker/GetAllJobApplied/${id}`);
      console.log("API response data:", response.data); 

      setJobs(response.data || []);
      setMessage(''); // Xóa thông báo khi tải lại danh sách công việc
    } catch (error) {
      console.error('Error fetching the job data:', error);
    }
  };

  useEffect(() => {
    fetchJobs(); 
  }, [id]);

  const handleCancelApply = async (jobId) => {
    console.log(`Hủy ứng tuyển cho công việc ID: ${jobId}`);
    
    const newStatus = 5; // trạng thái hủy ứng tuyển 

    try {
      const response = await axios.get(`https://localhost:7077/api/JobEmployer/ChangeStatusApplyJob`, {
        params: {
          JobSeekerApply_ID: jobId,
          newStatus: newStatus,
        }
      });

      if (response.data) {
        console.log('Thay đổi trạng thái thành công:', response.data);
        setMessage('Bạn đã hủy ứng tuyển thành công!'); // Thiết lập thông báo thành công
        fetchJobs(); // Gọi lại hàm fetchJobs để tải lại danh sách công việc
      } else {
        console.error('Không thể thay đổi trạng thái:', response.data);
        setMessage('Không thể hủy ứng tuyển.'); // Thông báo lỗi
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái ứng tuyển:', error);
      setMessage('Có lỗi xảy ra khi hủy ứng tuyển.'); // Thông báo lỗi
    }
  };

  const handleViewDetail = (jobId) => {
    
  };

  return (
    <>
      <Header />
      <div className="container job-list" style={{ paddingTop: '50px' }}>
        <h2 className="text-center">Danh sách công việc đã ứng tuyển</h2>
        {message && <div className="alert alert-info text-center">{message}</div>} {/* Hiển thị thông báo */}
        <div className="row justify-content-center">
          {Array.isArray(jobs) && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="col-md-6 d-flex align-items-stretch" style={{ margin: '16px 0' }}>
                <div 
                  className="card mb-4"
                  style={{
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '16px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div className="card-body">
                    <h3 className="card-title">{job.jobTitle}</h3>
                    <p className="card-text"><strong>Loại công việc:</strong> {job.jobCategory}</p>
                    <p className="card-text"><strong>Mức lương:</strong> {job.rangeSalaryMin || 0} - {job.rangeSalaryMax || "Thỏa thuận"} VNĐ</p>
                    <p className="card-text"><strong>Người đăng:</strong> {job.authorname}</p>
                    <p className="card-text"><strong>Trạng thái công việc:</strong> {job.statusJob === 1 ? 'Đang chờ ứng viên' : 'Hết hạn'}</p>
                    <p className="card-text">
                      <strong>Trạng thái đơn xin việc:</strong> {
                        (() => {
                          switch (job.statusApplyJob) {
                            case 0:
                              return "Đang ứng tuyển";
                            case 1:
                              return "Nhà tuyển dụng đánh giá bạn không phù hợp";
                            case 2:
                              return "Nhà tuyển dụng đang chuẩn bị liên lạc với bạn";
                            case 3:
                              return "Nhà tuyển dụng xác nhận bạn đã được nhận";
                            case 4:
                              return "Nhà tuyển dụng không phản hồi";
                            case 5:
                              return "Đã hủy ứng tuyển";
                            default:
                              return "Không xác định";
                          }
                        })()
                      }
                    </p>

                    {job.statusJob === 1 && job.statusApplyJob === 0 && (
                      <button
                      
                      className="btn btn-danger me-2" 
                      style={{ marginRight: '10px' }}
                        onClick={() => handleCancelApply(job.id)}
                      >
                        Hủy ứng tuyển
                      </button>
                    )}
                    <button
                      className="btn btn-primary" // Nút Xem Chi Tiết
                      
                      onClick={() => handleViewDetail(job.id)} // Hàm để xử lý khi nhấn nút
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Bạn chưa ứng tuyển công việc nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobApplied;
