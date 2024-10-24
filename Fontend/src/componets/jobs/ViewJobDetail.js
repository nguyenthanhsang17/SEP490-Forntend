import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import axios from 'axios';

function ViewJobDetail() {
  const { id } = useParams(); // Get job ID from the route
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/PostJobs/jobDetails/${id}`);
        setJobDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!jobDetails) {
    return <div>Job details not found</div>;
  }

  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1>Chi tiết công việc</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      
      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={jobDetails.companyLogo || "assets/img/com-2.jpg"} className="img" alt="Company Logo" />
              <a href="#" className="detail-edit" title="Sửa"><i className="fa fa-pencil"></i></a>
            </div>
            <div className="detail-status">
              <span>{jobDetails.postedDaysAgo} Ngày trước</span>
            </div>
          </div>

          <div className="row bottom-mrg">
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4>{jobDetails.companyName}</h4>
                <span className="designation">{jobDetails.companyDescription}</span>
                <p>{jobDetails.jobDescription}</p>
                <ul>
                  <li><i className="fa fa-briefcase"></i><span>{jobDetails.jobType}</span></li>
                  <li><i className="fa fa-flask"></i><span>{jobDetails.experience} năm kinh nghiệm</span></li>
                </ul>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="get-touch">
                <h4>Liên hệ</h4>
                <ul>
                  <li><i className="fa fa-map-marker"></i><span>{jobDetails.address}</span></li>
                  <li><i className="fa fa-envelope"></i><span>{jobDetails.email}</span></li>
                  <li><i className="fa fa-globe"></i><span>{jobDetails.website}</span></li>
                  <li><i className="fa fa-phone"></i><span>{jobDetails.phone}</span></li>
                  <li><i className="fa fa-money"></i><span>{jobDetails.salaryRange}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row no-padd">
            <div className="detail pannel-footer">
              <div className="col-md-5 col-sm-5">
                <ul className="detail-footer-social">
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                </ul>
              </div>
              <div className="col-md-7 col-sm-7">
                <div className="detail-pannel-footer-btn pull-right">
                  <a href="#" className="footer-btn grn-btn" title="">Ứng tuyển ngay</a>
                  <a href="#" className="footer-btn blu-btn" title="">Lưu bản nháp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Trách nhiệm công việc</h2>
            <p>{jobDetails.responsibilities}</p>
          </div>

          <div className="row row-bottom">
            <h2 className="detail-title">Yêu cầu kỹ năng</h2>
            <ul className="detail-list">
              {jobDetails.skills && jobDetails.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="row row-bottom">
            <h2 className="detail-title">Bằng cấp</h2>
            <ul className="detail-list">
              {jobDetails.qualifications && jobDetails.qualifications.map((qualification, index) => (
                <li key={index}>{qualification}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ViewJobDetail;
