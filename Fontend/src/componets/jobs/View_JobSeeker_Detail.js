import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewJobSeekerDetail() {
  const { id } = useParams();
  const [jobSeeker, setJobSeeker] = useState(null);

  useEffect(() => {
    const fetchJobSeekerDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetDetailJobseekerApply/${id}`);
        setJobSeeker(response.data);
      } catch (error) {
        console.error('Error fetching the jobseeker detail data:', error);
      }
    };

    fetchJobSeekerDetail();
  }, [id]);

  return (
    <>
      <Header />
      <div className="container my-5"  style={{ paddingTop: '100px' }}>
        {jobSeeker ? (
          <div className="profile-container">
            <div className="profile-header text-center">
              <img 
                src={jobSeeker.avatarURL} 
                alt="Avatar" 
                className="img-fluid rounded-circle" 
                style={{ width: '150px', height: '150px', border: '3px solid #ddd' }} 
              />
              <h2 className="mt-3">{jobSeeker.fullName}</h2>
            </div>

            <div className="profile-info mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="info-box">
                    <h5>Thông tin liên hệ</h5>
                    <p><strong>Email:</strong> {jobSeeker.email}</p>
                    <p><strong>Số điện thoại:</strong> {jobSeeker.phonenumber}</p>
                    <p><strong>Địa chỉ:</strong> {jobSeeker.address}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-box">
                    <h5>Thông tin cá nhân</h5>
                    <p><strong>Tuổi:</strong> {jobSeeker.age}</p>
                    <p><strong>Giới tính:</strong> {jobSeeker.gender ? "Nam" : "Nữ"}</p>
                    <p><strong>Mô tả:</strong> {jobSeeker.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-cv mt-5">
              <h4>Chi tiết CV</h4>
              {jobSeeker.cvs && jobSeeker.cvs.$values.length > 0 ? (
                jobSeeker.cvs.$values.map((cv) => (
                  <div key={cv.cvId} className="cv-details mt-3">
                    <ul className="list-group">
                      {cv.itemOfCvs.$values.map(item => (
                        <li key={item.itemOfCvId} className="list-group-item">
                          <strong>{item.itemName}:</strong> {item.itemDescription}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>Chưa có thông tin CV.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Đang tải thông tin ứng viên...</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewJobSeekerDetail;
