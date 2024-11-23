import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom'; 

function ViewAllJobApplied() {
  
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust as needed
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchJobs = async (page = 1) => {
    const token = localStorage.getItem("token");
            console.log("Token:", token); // Kiểm tra giá trị token

            if (!token) {
                console.log("No token found, cannot fetch CVs.");
                navigate("/login");
                return; // Không làm gì cả nếu không có token
            }
            try {
              const response = await axios.get(`https://localhost:7077/api/JobJobSeeker/GetAllJobApplied/`, {
                  params: {
                      pageNumber: page,
                      pageSize,
                  },
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });
              
              console.log("API response data:", response.data);
              
              setJobs(response.data.items || []);
              setTotalPages(response.data.totalPages || 1);
              setMessage(''); // Clear message on successful fetch
            } catch (error) {
              console.error('Error fetching the job data:', error);
            }
  };

  useEffect(() => {
    fetchJobs(pageNumber); 
  }, [ pageNumber]);

  // const handleCancelApply = async (jobId) => {
  //   console.log(`Canceling application for job ID: ${jobId}`);
    
  //   const newStatus = 5;

  //   try {
  //     const response = await axios.get(`https://localhost:7077/api/JobEmployer/ChangeStatusApplyJob`, {
  //       params: {
  //         JobSeekerApply_ID: jobId,
  //         newStatus: newStatus,
  //       }
  //     });

  //     if (response.data) {
  //       console.log('Status updated successfully:', response.data);
  //       setMessage('Đã hủy ứng tuyển thành công.');
  //       fetchJobs(pageNumber);
  //     } else {
  //       console.error('Unable to update status:', response.data);
  //       setMessage('Không thể hủy đăng ký.');
  //     }
  //   } catch (error) {
  //     console.error('Error updating application status:', error);
  //     setMessage('Có lỗi xảy a khi hủy, hãy thử lại sau.');
  //   }
  // };

  const handleViewDetail = (jobId) => {
    // Add functionality for viewing job details if needed
    navigate("/viewJobDetail/"+jobId);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  return (
    <>
      <Header />
      <div className="container job-list" style={{ paddingTop: '30px' }}>
        <h2 className="text-center">Công việc đã ứng tuyển</h2>
        {message && <div className="alert alert-info text-center">{message}</div>}
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
                              return "Đã ứng tuyển";
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

                    {/* {job.statusJob === 1 && job.statusApplyJob === 0 && (
                      <button
                        className="btn btn-danger me-2" 
                        style={{ marginRight: '10px' }}
                        onClick={() => handleCancelApply(job.id)}
                      >
                        Hủy ứng tuyển
                      </button>
                    )} */}
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewDetail(job.id)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Bạn chưa ứng tuyển công viêvj nào , hãy bắt đầu ứng tuyển.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls text-center mt-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
          >
            Trước
          </button>
          <span>Trang {pageNumber} / {totalPages}</span>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobApplied;
