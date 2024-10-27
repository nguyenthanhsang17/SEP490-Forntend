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
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [applyFilter, setApplyFilter] = useState('');

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetAllJobseekerApply/${id}`);
      setJobSeeker(response.data);
    } catch (error) {
      console.error('Error fetching the jobseeker data:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [id]);

  const handleSearch = () => {
    return JobSeeker.filter(seeker => {
      const matchesGender = genderFilter ? (seeker.gender ? 'Nam' : 'Nữ') === genderFilter : true;
      const matchesAge = ageFilter ? seeker.age.toString() === ageFilter : true;
      const matchesJob = jobFilter ? seeker.jobName === jobFilter : true;
      const matchesApplyStatus = applyFilter ? seeker.apply_id.toString() === applyFilter : true;
      
      return matchesGender && matchesAge && matchesJob && matchesApplyStatus;
    });
  };

  const filteredJobSeekers = handleSearch();

  return (
    <>
      <Header />
      <div className="container job-seeker-list" style={{ paddingTop: '100px' }}>
        <h2 className="text-center">Danh sách ứng viên</h2>
        
        {/* Ô tìm kiếm */}
        <div className="mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="form-group" style={{ flex: '1', marginRight: '10px' }}>
            <label htmlFor="genderFilter">Giới tính:</label>
            <select 
              id="genderFilter" 
              className="form-control" 
              value={genderFilter} 
              onChange={e => setGenderFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '1', marginRight: '10px' }}>
            <label htmlFor="ageFilter">Tuổi:</label>
            <input 
              type="number" 
              id="ageFilter" 
              className="form-control" 
              value={ageFilter} 
              onChange={e => setAgeFilter(e.target.value)}
              placeholder="Nhập tuổi"
            />
          </div>
          <div className="form-group" style={{ flex: '1', marginRight: '10px' }}>
            <label htmlFor="jobFilter">Công việc hiện tại:</label>
            <select 
              id="jobFilter" 
              className="form-control" 
              value={jobFilter} 
              onChange={e => setJobFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Đang đi học">Đang đi học</option>
              <option value="Đang đi làm">Đang đi làm</option>
              <option value="Thất nghiệp">Thất nghiệp</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: '1', marginRight: '10px' }}>
            <label htmlFor="applyFilter">Trạng thái ứng tuyển:</label>
            <select 
              id="applyFilter" 
              className="form-control" 
              value={applyFilter} 
              onChange={e => setApplyFilter(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="6">Không phù hợp</option>
              <option value="7">Xem lại sau</option>
              <option value="2">Đã xem thông tin liên lạc</option>
              <option value="3">Đã nhận</option>
            </select>
          </div>
        </div>

        <div className="row justify-content-center">
          {filteredJobSeekers.length > 0 ? (
            filteredJobSeekers.map((seeker) => (
              <div key={seeker.userId} className="col-md-6 mb-4" style={{ margin: '16px 0' }}>
                <div 
                  className="card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                    transition: '0.3s', 
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
                    <a href={`/ViewJobSeekerDetail/${seeker.userId}/${seeker.apply_id}`} className="btn btn-primary">
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
