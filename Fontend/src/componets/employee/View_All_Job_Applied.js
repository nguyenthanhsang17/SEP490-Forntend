import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/banner-10.jpg';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

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
  }, [pageNumber]);

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
    navigate("/viewJobDetail/" + jobId);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  return (
    <>
      <Header />
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1 className="text-center">Công việc đã ứng tuyển</h1>
        </div>
      </section>
      <div className="container job-list" style={{ paddingTop: '30px' }}>
        <div className="container">
          <h4 className="text-center" style={{color: "red"}}>Nếu công việc lừa đảo hãy báo cáo vị phạm cho hệ thống</h4>
        </div>
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
                    <p className="card-text"><strong>Mức lương:</strong> {job.fixSalary} VNĐ</p>
                    <p className="card-text"><strong>Người đăng:</strong> {job.authorname}</p>
                    <p className="card-text"><strong>Ngày hết hạn:</strong> {new Date(job.expirationDate).toLocaleDateString('vi-VN')}</p>
                    <p className="card-text"><strong>Loại công việc:</strong> {job.jobCategory}</p>
                    <p className="card-text"><strong>Tên cv ứng tuyển :</strong> {job.cVname}</p>
                    <p className="card-text">
                      <strong>Trạng thái đơn xin việc:</strong> {
                        (() => {
                          switch (job.statusApplyJob) {
                            case 0:
                              return "Chờ duyệt";
                            case 1:
                              return "Từ chối hồ sơ";
                            case 3:
                              return "Chấp nhận hồ sơ";
                            case 4:
                              return "Đồng ý tuyển";
                            case 5:
                              return "Từ chối tuyển";
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
                      onClick={() => handleViewDetail(job.postId)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
              <h2 className="text-center">Bạn chưa ứng tuyển công việc nào, hãy bắt đầu ứng tuyển. <a href={`/viewalljob`} >
                Xem tất cả công việc
              </a></h2>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {jobs.length > 0 && (
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              disabled={pageNumber === 1}
              onClick={() => handlePageChange(pageNumber - 1)}
            />
            <span style={{ margin: '0 10px', fontSize: '16px' }}>
              {pageNumber} / {totalPages} trang
            </span>
            <Button
              shape="circle"
              icon={<RightOutlined />}
              disabled={pageNumber === totalPages}
              onClick={() => handlePageChange(pageNumber + 1)}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobApplied;
