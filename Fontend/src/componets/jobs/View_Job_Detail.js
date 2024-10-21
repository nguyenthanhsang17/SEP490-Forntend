import React from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';

function ViewJobDetail() {
  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})`  }}>
        <div className="container">
          <h1>Chi tiết công việc</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row">
            <div className="detail-pic">
              <img src="assets/img/com-2.jpg" className="img" alt="Company Logo" />
              <a href="#" className="detail-edit" title="Sửa"><i className="fa fa-pencil"></i></a>
            </div>
            <div className="detail-status">
              <span>2 Ngày trước</span>
            </div>
          </div>

          <div className="row bottom-mrg">
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4>Google</h4>
                <span className="designation">Công ty Phát triển Phần mềm</span>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <ul>
                  <li><i className="fa fa-briefcase"></i><span>Toàn thời gian</span></li>
                  <li><i className="fa fa-flask"></i><span>3 năm kinh nghiệm</span></li>
                </ul>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="get-touch">
                <h4>Liên hệ</h4>
                <ul>
                  <li><i className="fa fa-map-marker"></i><span>Menlo Park, CA</span></li>
                  <li><i className="fa fa-envelope"></i><span>danieldax704@gmail.com</span></li>
                  <li><i className="fa fa-globe"></i><span>microft.com</span></li>
                  <li><i className="fa fa-phone"></i><span>0 123 456 7859</span></li>
                  <li><i className="fa fa-money"></i><span>$1000 - $1200/Tháng</span></li>
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
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>

          <div className="row row-bottom">
            <h2 className="detail-title">Yêu cầu kỹ năng</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <ul className="detail-list">
              <li key="1">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</li>
              <li key="2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</li>
              <li key="7">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</li>
            </ul>
          </div>

          <div className="row row-bottom">
            <h2 className="detail-title">Bằng cấp</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <ul className="detail-list">
              <li key="8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</li>
              <li key="9">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="10">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="11">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</li>
              <li key="13">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</li>
              <li key="14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.</li>
              <li key="15">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ViewJobDetail;
