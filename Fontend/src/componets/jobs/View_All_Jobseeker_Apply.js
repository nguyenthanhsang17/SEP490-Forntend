import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 

function ViewAllJobSeekerApply() {
  const { id } = useParams();
  const [JobSeeker, setJobSeeker] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetAllJobseekerApply/${id}`);
        setJobSeeker(response.data.$values || []);
      } catch (error) {
        console.error('Error fetching the jobseeker data:', error);
      }
    };

    fetchJobs();
  }, [id]);

  return (
    <>
      <Header />
      <div className="container job-seeker-list">
        <h2 className="text-center">Danh sách ứng viên</h2>
        <div className="row justify-content-center">
          {JobSeeker.length > 0 ? (
            JobSeeker.map((seeker) => (
              <div key={seeker.userId} className="col-md-6 mb-4" style={{ margin: '16px 0' }}>
                <div 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    border: '1px solid #ddd', // Thêm border
                    borderRadius: '8px', // Bo tròn các góc
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Thêm bóng đổ
                    transition: '0.3s', // Hiệu ứng chuyển tiếp
                  }}
                >
                  <img 
                    src={seeker.avatarURL} 
                    alt={`${seeker.fullName}'s avatar`} 
                    className="card-img-top" 
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '5px', 
                      marginRight: '20px', 
                      marginLeft: '10px' 
                    }} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{seeker.fullName}</h5>
                    <p className="card-text"><strong>Tuổi:</strong> {seeker.age}</p>
                    <p className="card-text"><strong>Công việc hiện tại:</strong> {seeker.jobName}</p>
                    <p className="card-text"><strong>Giới tính:</strong> {seeker.gender ? 'Nam' : 'Nữ'}</p>
                    <a href={`/jobseeker/${seeker.userId}`} className="btn btn-primary">
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Không có ứng viên nào.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobSeekerApply;
