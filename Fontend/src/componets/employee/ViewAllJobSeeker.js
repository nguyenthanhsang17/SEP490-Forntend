import React from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Header from '../common/Header';
import Footer from '../common/Footer';

const MemberCard = () => {
  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)` }}>
        <div className="container">
          <h1>Tất Cả Ứng Viên</h1>
        </div>
      </section>

      <section className="member-card gray">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="search-filter">
                <div className="col-md-4 col-sm-5">
                  <div className="filter-form">
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="Search…" />
                      <span className="input-group-btn">
                        <button type="button" className="btn btn-default">Go</button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 col-sm-7">
                  <div className="short-by pull-right">
                    Short By
                    <div className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown">Dropdown <i className="fa fa-angle-down" aria-hidden="true" /></a>
                      <ul className="dropdown-menu">
                        <li><a href="#">Short By Date</a></li>
                        <li><a href="#">Short By Views</a></li>
                        <li><a href="#">Short By Popular</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 col-sm-4">
              <div className="manage-cndt">
                <div className="cndt-status pending">Pending</div>
                <div className="cndt-caption">
                  <div className="cndt-pic">
                    <img src="assets/img/client-1.jpg" className="img-responsive" alt="" />
                  </div>
                  <h4>Charles Hopman</h4>
                  <span>Web designer</span>
                  <p>Our analysis team at Megriosft use end to end innovation process.</p>
                </div>
                <a href="#" title="" className="cndt-profile-btn">View Profile</a>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="manage-cndt">
                <div className="cndt-status available">Available</div>
                <div className="cndt-caption">
                  <div className="cndt-pic">
                    <img src="assets/img/client-2.jpg" className="img-responsive" alt="" />
                  </div>
                  <h4>Ethan Marion</h4>
                  <span>IOS designer</span>
                  <p>Our analysis team at Megriosft use end to end innovation process.</p>
                </div>
                <a href="#" title="" className="cndt-profile-btn">View Profile</a>
              </div>
            </div>

            <div className="col-md-4 col-sm-4">
              <div className="manage-cndt">
                <div className="cndt-status pending">Pending</div>
                <div className="cndt-caption">
                  <div className="cndt-pic">
                    <img src="assets/img/client-3.jpg" className="img-responsive" alt="" />
                  </div>
                  <h4>Zara Clow</h4>
                  <span>UI/UX designer</span>
                  <p>Our analysis team at Megriosft use end to end innovation process.</p>
                </div>
                <a href="#" title="" className="cndt-profile-btn">View Profile</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default MemberCard;