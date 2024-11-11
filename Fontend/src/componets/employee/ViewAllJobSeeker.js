import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import '../assets/css/colors/green-style.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MemberCard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for filter inputs
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState(0);
  const [currentJob, setCurrentJob] = useState(0);
  const [numberPage, setNumberPage] = useState(1);
  const [agemin, setAgemin] = useState("");
  const [agemax, setAgemax] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(-1); // -1 for all genders, 0 for female, 1 for male

  // Fetch data from API based on filters
  const fetchCandidates = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get('https://localhost:7077/api/JobJobSeeker/GetAllJobSeeker', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          sort,
          CurrentJob: currentJob,
          numberPage,
          agemin,
          agemax,
          address,
          gender
        }
      });

      setCandidates(response.data.items || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to candidate detail page
  const handleViewDetail = (id) => {
    navigate(`/viewDetailJobSeeker/${id}`);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <>
      <Header />
      <section className="inner-header-title" style={{ backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)` }}>
        <div className="container">
          <h1>Tất Cả Ứng Viên</h1>
        </div>
      </section>

      <section className="member-card gray">
        <div className="container">
          <div className="search-filter row">
            <div className="col-md-3 col-sm-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Từ khóa" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <select className="form-control" onChange={(e) => setGender(parseInt(e.target.value))}>
                <option value="-1">Giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Tuổi tối thiểu" 
                value={agemin} 
                onChange={(e) => setAgemin(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Tuổi tối đa" 
                value={agemax} 
                onChange={(e) => setAgemax(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select className="form-control" onChange={(e) => setCurrentJob(parseInt(e.target.value))}>
                <option value="0">Công việc hiện tại</option>
                <option value="1">Thất nghiệp</option>
                <option value="2">Đang đi học</option>
                <option value="3">Đang đi làm</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Địa chỉ" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select className="form-control" onChange={(e) => setSort(parseInt(e.target.value))}>
                <option value="0">Sắp xếp</option>
                <option value="1">Nhiều lượt ứng tuyển nhất</option>
                <option value="2">Ít lượt ứng tuyển nhất</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <button type="button" className="btn btn-success" onClick={fetchCandidates}>
                Tìm kiếm
              </button>
            </div>
          </div>

          {loading ? (
            <p>Đang tải ứng viên...</p>
          ) : (
            <div className="row mt-4">
  {candidates.length > 0 ? (
    candidates.map((candidate) => (
      <div key={candidate.userId} className="col-md-12 mb-4">
        <div className="candidate-card d-flex align-items-center p-3">
          <div className="candidate-image" style={{ marginRight: '20px' }}>
            <img 
              src={candidate.avatarURL || "https://via.placeholder.com/100"} 
              alt="Avatar" 
              style={{ width: '100px', height: '100px', borderRadius: '8px' }} // Increased size
            />
          </div>
          <div className="candidate-info" style={{ flex: 1 }}>
            <h5 className="mb-1" style={{ fontWeight: 'bold', color: '#333' }}>{candidate.fullName}</h5>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Tuổi: {candidate.age}</p>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Số Điện Thoại: {candidate.phonenumber}</p>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Địa Chỉ: {candidate.address}</p>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Công Việc Hiện Tại: {candidate.currentJob}</p>
            <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Giới Tính: {candidate.gender ? "Nam" : "Nữ"}</p>
          </div>
          <div className="candidate-actions d-flex flex-column align-items-end"> {/* Align buttons to the right */}
            <button 
              className="btn btn-primary mb-2"
              onClick={() => handleViewDetail(candidate.userId)}
            >
              Ứng tuyển ngay
            </button>
            <button 
              className="btn btn-secondary"
            >
              Lưu Tin
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center">Không có ứng viên nào</p>
  )}
</div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default MemberCard;
