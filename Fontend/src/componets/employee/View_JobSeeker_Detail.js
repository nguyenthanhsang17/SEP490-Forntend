import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewJobSeekerDetail() {
  const { id, apply_id } = useParams();

  const [jobSeeker, setJobSeeker] = useState(null);
  const [canViewDetails, setCanViewDetails] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(''); // Thêm state cho thông báo

  useEffect(() => {
    const fetchJobSeekerDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetDetailJobseekerApply/${id}/${apply_id}`);
        setJobSeeker(response.data);
        console.log(response.data.status);
        setStatus(response.data.status);
      } catch (error) {
        console.error('Error fetching the jobseeker detail data:', error);
      }
    };

    fetchJobSeekerDetail();
  }, [id, apply_id]);

  const handleEvaluation = async (evaluationType) => {
    let newStatus;
    switch (evaluationType) {
      case 'Không phù hợp':
        newStatus = 1; 
        alert("Bạn đã đánh dầu người này là không phù hợp");
        break;
      case 'Phù hợp':
        newStatus = 3; 
        alert("Thông tin liên lạc đã được hiển thị.");
        break;
      case 'Nhận':
        newStatus = 4; 
        setCanViewDetails(true);
        alert("Bạn đã nhận người này");
        break;
      case 'Không nhận':
        newStatus = 5;
        setCanViewDetails(true);
        alert("Bạn đã ko nhận người này");
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(`https://localhost:7077/api/JobEmployer/ChangeStatusApplyJob?Applyjob_Id=${apply_id}&newStatus=${newStatus}`);
      if (response.data) {
        setStatus(newStatus);
      } 
      window.location.reload()
    } catch (error) {
      console.error('Error changing the job seeker status:', error);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Đang chờ';
      case 1:
        return 'Không phù hợp';
      case 3:
        return 'Phù hợp';
      case 4:
        return 'Nhận';
      case 5:
        return 'Không nhận';
      default:
        return 'Không xác định';
    }
  };

  return (
    <>
      <Header />
      <div className="container my-5" style={{ paddingTop: '20px' }}>
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
                    <p style={{ color: '#000', opacity: 1 }}><strong>Email:</strong> {canViewDetails || status === 3 ? jobSeeker.email : 'xxxxxx'}</p>
                    <p style={{ color: '#000', opacity: 1 }}><strong>Số điện thoại:</strong> {canViewDetails || status === 3 ? jobSeeker.phonenumber : 'xxxxxx'}</p>
                    <p style={{ color: '#000', opacity: 1 }}> <strong>Địa chỉ:</strong> {canViewDetails || status === 3 ? jobSeeker.address : 'xxxxxx'}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-box">
                    <h5>Thông tin cá nhân</h5>
                    <p style={{ color: '#000', opacity: 1 }}><strong>Tuổi:</strong> {jobSeeker.age}</p>
                    <p style={{ color: '#000', opacity: 1 }}><strong>Giới tính:</strong> {jobSeeker.gender ? "Nam" : "Nữ"}</p>
                    <p style={{ color: '#000', opacity: 1 }}><strong>Mô tả:</strong> {jobSeeker.description}</p>
                    <p style={{ color: '#000', opacity: 1 }}><strong>Trạng thái:</strong>{getStatusLabel(jobSeeker.status)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="evaluation-buttons mt-4 text-center">
  {/* Kiểm tra trạng thái */}
  {status === 0 && (
    <>
      <button 
        className="btn btn-danger mx-2" 
        onClick={() => handleEvaluation('Không phù hợp')} 
        style={{ marginRight: '10px' }}
      >
        Không phù hợp
      </button>
      <button 
        className="btn btn-warning mx-2" 
        onClick={() => handleEvaluation('Phù hợp')} 
        style={{ marginRight: '10px' }}
      >
        Phù hợp
      </button>
    </>
  )}
  {status === 3 && (
    <>
      <button 
        className="btn btn-info mx-2" 
        onClick={() => handleEvaluation('Nhận')} 
        style={{ marginRight: '10px' }}
      >
        Nhận
      </button>
      <button 
        className="btn btn-success mx-2" 
        onClick={() => handleEvaluation('Không nhận')} 
      >
        Không nhận
      </button>

      <button 
        className="btn btn-success mx-2" 
      >
        Liên hệ ngay
      </button>
    </>
  )}
</div>


            {/* Thông báo */}
            {message && (
              <div className="alert alert-info mt-3" style={{textAlign: 'center', /* Căn giữa nội dung */}}>
                {message}
              </div>
            )}

            <div className="profile-cv mt-5">
              <h4>Chi tiết CV</h4>
              {jobSeeker.cvs && jobSeeker.cvs.length > 0 ? (
                jobSeeker.cvs.map((cv) => (
                  <div key={cv.cvId} className="cv-details mt-3">
                    <ul className="list-group">
                      {cv.itemOfCvs.map(item => (
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
