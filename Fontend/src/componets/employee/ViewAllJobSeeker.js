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
      
      <section className="member-card gray">
        <div className="container">
          <h1 className="text-center">Tất Cả Ứng Viên</h1>

          {/* Search Filters */}
          <div className="search-filter row">
            <div className="col-md-3 col-sm-6">
              <select className="form-control">
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <input type="text" className="form-control" placeholder="Enter Age" />
            </div>
            <div className="col-md-3 col-sm-6">
              <select className="form-control">
                <option>Current Job</option>
                <option>Designer</option>
                <option>Developer</option>
                <option>Manager</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <select className="form-control">
                <option>Status</option>
                <option>Available</option>
                <option>Pending</option>
              </select>
            </div>
            <div className="col-md-12 text-center mt-3">
              <button type="button" className="btn btn-success">Search</button>
            </div>
          </div>

          {/* Candidate Cards */}
          <div className="row mt-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <div className="manage-cndt">
                  <div className="cndt-caption text-center">
                    <div className="cndt-pic">
                      <img src="https://via.placeholder.com/100" className="img-responsive" alt="Avatar" />
                    </div>
                    <h4>Name: Mr. A</h4>
                    <p>Age: 22</p>
                    <p>Current Job: XXX</p>
                    <p>Gender: Male</p>
                    <button className="btn btn-info mt-2">View Detail</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default MemberCard;
