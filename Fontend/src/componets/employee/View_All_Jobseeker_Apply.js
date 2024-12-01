import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function ViewAllJobSeekerApply() {
  const { id } = useParams();
  const [jobSeekers, setJobSeekers] = useState([]);
  const [genderFilter, setGenderFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [ageFilter2, setAgeFilter2] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [applyFilter, setApplyFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const fetchJobSeekers = async () => {

    try {
      setJobSeekers([]);
      const response = await axios.get(`https://localhost:7077/api/JobEmployer/GetAllJobseekerApply/${id}`, {
        params: {
          pageNumber: pageNumber,
          pageSize: 4, // Bạn có thể thay đổi kích thước trang nếu cần
          gender: genderFilter,
          agemin: ageFilter,
          agemax: ageFilter2,
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
    // Chỉ gọi fetch khi trang hoặc id thay đổi
    fetchJobSeekers();
  }, [id, pageNumber]);

  const handleSearch = () => {
    // Đặt trang về 1 và gọi fetch khi bấm tìm kiếm
    setPageNumber(1);
    fetchJobSeekers();
  };
  const statusMapping = {
    0: 'Đang chờ',
    1: 'Không phù hợp',
    3: 'Đã xem thông tin liên lạc',
    4: 'Đã nhận',
    5: 'Không nhận'
  };

  return (
    <>
      <Header />
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1 className="text-center">Danh sách ứng viên</h1>
        </div>
      </section>
      <div className="container job-seeker-list" style={{ paddingTop: '100px' }}>
        {/* Ô tìm kiếm */}
        <div
          className="filter-section"
          style={{
            backgroundColor: '#f9fbfc',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
          }}
        >
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
              <label htmlFor="ageFilter">Tuổi từ:</label>
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
              <label htmlFor="ageFilter2">Tuổi đến:</label>
              <input
                type="number"
                id="ageFilter2"
                className="form-control"
                value={ageFilter2}
                onChange={e => setAgeFilter2(e.target.value)}
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
                <option value="0">Đang chờ</option>
                <option value="1">Không phù hợp</option>
                <option value="3">Đã xem thông tin liên lạc</option>
                <option value="4">Đã nhận</option>
                <option value="5">Không nhận</option>
              </select>
            </div>
            <button onClick={handleSearch} className="btn btn-primary">Tìm kiếm</button>
          </div>
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
                    <p className="card-text">
                      <strong>Trạng thái: </strong>
                      {statusMapping[seeker.applyStatus] || 'Không xác định'}
                    </p>
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

        {jobSeekers.length > 0 && (
          <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            <span style={{ margin: '0 10px', fontSize: '16px' }}>
              {currentPage} / {totalPages} trang
            </span>
            <Button
              shape="circle"
              icon={<RightOutlined />}
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ViewAllJobSeekerApply;