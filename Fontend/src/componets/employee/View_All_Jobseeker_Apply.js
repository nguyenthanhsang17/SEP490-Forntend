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
  const [jobSeekers, setJobSeekers] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [applyFilter, setApplyFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchJobSeekers = async () => {
    console.log("Job ID:", id);  
    try {
      const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetAllJobseekerApply/${id}`, {
        params: {
          pageNumber: pageNumber,
          pageSize: 4, // Bạn có thể thay đổi kích thước trang nếu cần
          gender: genderFilter,
          age: ageFilter,
          jobName: jobFilter,
          applyStatus: applyFilter,
        }
      });
      console.log(response)
      setJobSeekers(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching the job seeker data:', error);
    }
  };

  useEffect(() => {
    fetchJobSeekers();
  }, [id, pageNumber, genderFilter, ageFilter, jobFilter, applyFilter]);

  const handleSearch = () => {
    setPageNumber(1); // Reset về trang 1 khi có bộ lọc mới
    fetchJobSeekers(); // Gọi lại hàm để fetch dữ liệu mới
  };

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
          <button onClick={handleSearch} className="btn btn-primary">Tìm kiếm</button>
        </div>

        <div className="row justify-content-center">
          {jobSeekers.length > 0 ? (
            jobSeekers.map((seeker) => (
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

        {/* Phân trang */}
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
  {Array.from({ length: totalPages }, (_, index) => (
    <button 
      key={index} 
      className={`btn ${pageNumber === index + 1 ? 'btn-primary' : 'btn-secondary'}`} 
      onClick={() => setPageNumber(index + 1)}
    >
      {index + 1}
    </button>
  ))}
</div>

      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobSeekerApply;
