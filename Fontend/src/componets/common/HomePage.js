import React from 'react';
// import "../assets/css/style.css";
// import '../assets/plugins/css/plugins.css';
// import '../assets/css/colors/green-style.css';
import Footer from './Footer';
import bannerImage from '../assets/img/banner-9.jpg';
import Header from './Header';

class HomePage extends React.Component {
  render() {
    return (
      
      <div className="App">
        <Header/>
        <main>
          {/* Banner Section */}
          <div className="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
            <div className="container">
              <div className="banner-caption">
                <div className="col-md-12 col-sm-12 banner-text">
                  <h1>7,000+ Công Việc Được Chọn</h1>
                  <form className="form-horizontal">
                    <div className="col-md-4 no-padd">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control right-bor"
                          id="joblist"
                          placeholder="Skills, Designations, Companies"
                          aria-label="Job skills"
                        />
                      </div>
                    </div>
                    <div className="col-md-3 no-padd">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control right-bor"
                          id="location"
                          placeholder="Search By Location.."
                          aria-label="Location"
                        />
                      </div>
                    </div>
                    <div className="col-md-3 no-padd">
                      <div className="input-group">
                        <select id="choose-city" className="form-control" aria-label="Choose City">
                          <option value="">Chọn thành phố</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="London">London</option>
                          <option value="England">England</option>
                          <option value="Pratapcity">Pratapcity</option>
                          <option value="Ukrain">Ukrain</option>
                          <option value="Wilangana">Wilangana</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2 no-padd">
                      <div className="input-group">
                        <button type="submit" className="btn btn-primary">Tìm Kiếm</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Job List Section */}
          <section>
            <div className="container">
              <div className="row">
                <div className="main-heading">
                  <p>200 Công Việc Mới</p>
                  <h2>New & Random <span>Jobs</span></h2>
                </div>
              </div>
              <div className="row extra-mrg">
                <div className="col-md-3 col-sm-6">
                  <div className="grid-view brows-job-list">
                    <div className="brows-job-company-img">
                      <img src="assets/img/com-1.jpg" className="img-responsive" alt="Company Logo" />
                    </div>
                    <div className="brows-job-position">
                      <h3><a href="job-detail.html">Web Developer</a></h3>
                      <p><span>Google</span></p>
                    </div>
                    <div className="job-position"><span className="job-num">5 Positions</span></div>
                    <div className="brows-job-type"><span className="part-time">Part Time</span></div>
                    <ul className="grid-view-caption">
                      <li>
                        <div className="brows-job-location">
                          <p><i className="fa fa-map-marker"></i>QBL Park, C40</p>
                        </div>
                      </li>
                      <li>
                        <p><span className="brows-job-sallery"><i className="fa fa-money"></i>$110 - 200</span></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section className="video-sec dark" id="video" style={{ backgroundImage: 'url(assets/img/banner-10.jpg)' }}>
            <div className="container">
              <div className="row">
                <div className="main-heading">
                  <p>Best For Your Projects</p>
                  <h2>Watch Our <span>video</span></h2>
                </div>
              </div>
              <div className="video-part">
                <a href="#" data-toggle="modal" data-target="#my-video" className="video-btn">
                  <i className="fa fa-play"></i>
                </a>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="how-it-works">
            <div className="container">
              <div className="row" data-aos="fade-up">
                <div className="col-md-12">
                  <div className="main-heading">
                    <p>Working Process</p>
                    <h2>How It <span>Works</span></h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-4">
                  <div className="working-process">
                    <span className="process-img">
                      <img src="assets/img/step-1.png" className="img-responsive" alt="Step 1" />
                      <span className="process-num">01</span>
                    </span>
                    <h4>Create An Account</h4>
                    <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4">
                  <div className="working-process">
                    <span className="process-img">
                      <img src="assets/img/step-2.png" className="img-responsive" alt="Step 2" />
                      <span className="process-num">02</span>
                    </span>
                    <h4>Search Jobs</h4>
                    <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4">
                  <div className="working-process">
                    <span className="process-img">
                      <img src="assets/img/step-3.png" className="img-responsive" alt="Step 3" />
                      <span className="process-num">03</span>
                    </span>
                    <h4>Save & Apply</h4>
                    <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="pricing">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="main-heading">
                    <p>Top Freelancer</p>
                    <h2>Hire Expert <span>Freelancer</span></h2>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-6">
                  <div className="freelance-container style-2">
                    <div className="freelance-box">
                      <span className="freelance-status">Available</span>
                      <h4 className="flc-rate">$17/hr</h4>
                      <div className="freelance-inner-box">
                        <div className="freelance-box-thumb">
                          <img src="assets/img/can-5.jpg" className="img-responsive img-circle" alt="Freelancer" />
                        </div>
                        <div className="freelance-box-detail">
                          <h4>Agustin L. Smith</h4>
                          <span className="location">Australia</span>
                        </div>
                        <div className="ratings">
                          <i className="fa fa-star fill"></i>
                          <i className="fa fa-star fill"></i>
                          <i className="fa fa-star fill"></i>
                          <i className="fa fa-star-half fill"></i>
                          <i className="fa fa-star"></i>
                        </div>
                      </div>
                      <div className="freelance-box-extra">
                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui.</p>
                        <ul>
                          <li>Php</li>
                          <li>Android</li>
                          <li>Html</li>
                          <li className="more-skill bg-primary">+3</li>
                        </ul>
                      </div>
                      <a href="freelancer-detail.html" className="btn btn-freelance-two bg-default">View Detail</a>
                      <a href="freelancer-detail.html" className="btn btn-freelance-two bg-info">View Detail</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="text-center">
                    <a href="freelancers-2.html" className="btn btn-primary">Load More</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }
}

export default HomePage;
