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

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/JobJobSeeker/GetAllJobApplied/${id}`);
        
        // Truy cập $values từ response
        setJobs(response.data.$values || []); 
        
      } catch (error) {
        console.error('Error fetching the job data:', error);
      }
    };
  
    fetchJobs();
  }, [id]);

  const handleCancelApply = (jobId) => {
    console.log(`Hủy ứng tuyển cho công việc ID: ${jobId}`);
  };

  
  return (
    <>
      <Header />
      <div className="container job-list">
        <h2 className="text-center">Danh sách công việc đã ứng tuyển</h2>
        <div className="row justify-content-center">
          {jobs.length > 0 ? (
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
      <p className="card-text"><strong>Mức lương:</strong> {job.rangeSalaryMin} - {job.rangeSalaryMax} VNĐ</p>
      <p className="card-text"><strong>Người đăng:</strong> {job.authorname}</p>
      <p className="card-text"><strong>Trạng thái công việc:</strong> {job.statusJob === 1 ? 'Đang chờ ứng viên' : 'Hết hạn'}</p>
      <p className="card-text">
        <strong>Trạng thái đơn xin việc:</strong> {
          (() => {
            switch (job.statusApplyJob) {
              case 0:
                return "Đang ứng tuyển";
              case 1:
                return "Nhà tuyển dụng đã xem hồ sơ của bạn";
              case 2:
                return "Nhà tuyển dụng đang chuẩn bị liên lạc với bạn";
              case 3:
                return "Nhà tuyển dụng xác nhận bạn đã được nhận";
              case 4:
                return "Nhà tuyển dụng không phản hồi";
              default:
                return "Không xác định";
            }
          })()
        }
      </p>

      {job.statusJob === 1 && job.statusApplyJob < 2 && (
        <button
          className="btn btn-danger"
          onClick={() => handleCancelApply(job.id)}
        >
          Hủy ứng tuyển
        </button>
      )}
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
