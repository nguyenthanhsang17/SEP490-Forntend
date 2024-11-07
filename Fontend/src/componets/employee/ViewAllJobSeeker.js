import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MemberCard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Get the authentication token from localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get('https://localhost:7077/api/JobJobSeeker/GetAllJobSeeker', {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
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
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Please log in again.");
        // Optional: Redirect to login page or show a notification
      } else {
        console.error("Error fetching candidates:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchCandidates();
  }, []); // Empty dependency array to run once on mount

  return (
    <>
      <Header />
      <div className="clearfix"></div>
      
      <section className="member-card gray">
        <div className="container">
          <h1 className="text-center">Tất Cả Ứng Viên</h1>

          {/* Search Filters */}
          <div className="search-filter row">
            <div className="col-md-3 col-sm-6">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Keyword" 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <select className="form-control" onChange={(e) => setGender(parseInt(e.target.value))}>
                <option value="-1">Gender</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Min Age" 
                value={agemin} 
                onChange={(e) => setAgemin(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <input 
                type="number" 
                className="form-control" 
                placeholder="Max Age" 
                value={agemax} 
                onChange={(e) => setAgemax(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select className="form-control" onChange={(e) => setCurrentJob(parseInt(e.target.value))}>
                <option value="0">Current Job</option>
                <option value="1">Thất nghiệp</option>
                <option value="2">Đang đi học</option>
                <option value="3">Đang đi làm</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select className="form-control" onChange={(e) => setSort(parseInt(e.target.value))}>
                <option value="0">Sort</option>
                <option value="1">Most Applied</option>
                <option value="2">Least Applied</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <button type="button" className="btn btn-success" onClick={fetchCandidates}>
                Search
              </button>
            </div>
          </div>

          {/* Candidate Cards */}
          {loading ? (
            <p>Loading candidates...</p>
          ) : (
            <div className="row mt-4">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <div key={candidate.userId} className="col-md-4 col-sm-6 mb-4">
                    <div className="manage-cndt">
                      <div className="cndt-caption text-center">
                        <div className="cndt-pic">
                          <img 
                            src={candidate.avatarURL || "https://via.placeholder.com/100"} 
                            className="img-responsive" 
                            alt="Avatar" 
                          />
                        </div>
                        <h4>Name: {candidate.fullName}</h4>
                        <p>Age: {candidate.age}</p>
                        <p>Current Job: {candidate.currentJob}</p>
                        <p>Gender: {candidate.gender ? "Male" : "Female"}</p>
                        <button className="btn btn-info mt-2">View Detail</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No candidates found</p>
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
