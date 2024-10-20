
import React from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from './Footer';
import bannerImage from '../assets/img/banner-9.jpg';
import Header from './Header';
class HomePage extends React.Component {
  render() {
    return (
        
      <div class="App">
        <Header />
        {/* Banner Section */}
        <div class="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
          <div class="container">
            <div class="banner-caption">
              <div class="col-md-12 col-sm-12 banner-text">
                <h1>7,000+ Browse Jobs</h1>
                <form class="form-horizontal">
                  <div class="col-md-4 no-padd">
                    <div class="input-group">
                      <input type="text" class="form-control right-bor" id="joblist" placeholder="Skills, Designations, Companies" />
                    </div>
                  </div>
                  <div class="col-md-3 no-padd">
                    <div class="input-group">
                      <input type="text" class="form-control right-bor" id="location" placeholder="Search By Location.." />
                    </div>
                  </div>
                  <div class="col-md-3 no-padd">
                    <div class="input-group">
                      <select id="choose-city" class="form-control">
                        <option>Choose City</option>
                        <option>Chandigarh</option>
                        <option>London</option>
                        <option>England</option>
                        <option>Pratapcity</option>
                        <option>Ukrain</option>
                        <option>Wilangana</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-2 no-padd">
                    <div class="input-group">
                      <button type="submit" class="btn btn-primary">Search Job</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Job List Section */}
        <section>
          <div class="container">
            <div class="row">
              <div class="main-heading">
                <p>200 New Jobs</p>
                <h2>New & Random <span>Jobs</span></h2>
              </div>
            </div>
            <div class="row extra-mrg">
              <div class="col-md-3 col-sm-6">
                <div class="grid-view brows-job-list">
                  <div class="brows-job-company-img">
                    <img src="assets/img/com-1.jpg" class="img-responsive" alt="" />
                  </div>
                  <div class="brows-job-position">
                    <h3><a href="job-detail.html">Web Developer</a></h3>
                    <p><span>Google</span></p>
                  </div>
                  <div class="job-position"><span class="job-num">5 Positions</span></div>
                  <div class="brows-job-type"><span class="part-time">Part Time</span></div>
                  <ul class="grid-view-caption">
                    <li>
                      <div class="brows-job-location">
                        <p><i class="fa fa-map-marker"></i>QBL Park, C40</p>
                      </div>
                    </li>
                    <li>
                      <p><span class="brows-job-sallery"><i class="fa fa-money"></i>$110 - 200</span></p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section class="video-sec dark" id="video" style={{ backgroundImage: 'url(assets/img/banner-10.jpg)' }}>
          <div class="container">
            <div class="row">
              <div class="main-heading">
                <p>Best For Your Projects</p>
                <h2>Watch Our <span>video</span></h2>
              </div>
            </div>
            <div class="video-part">
              <a href="#" data-toggle="modal" data-target="#my-video" class="video-btn">
                <i class="fa fa-play"></i>
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section class="how-it-works">
          <div class="container">
            <div class="row" data-aos="fade-up">
              <div class="col-md-12">
                <div class="main-heading">
                  <p>Working Process</p>
                  <h2>How It <span>Works</span></h2>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-4">
                <div class="working-process">
                  <span class="process-img">
                    <img src="assets/img/step-1.png" class="img-responsive" alt="" />
                    <span class="process-num">01</span>
                  </span>
                  <h4>Create An Account</h4>
                  <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                </div>
              </div>
              <div class="col-md-4 col-sm-4">
                <div class="working-process">
                  <span class="process-img">
                    <img src="assets/img/step-2.png" class="img-responsive" alt="" />
                    <span class="process-num">02</span>
                  </span>
                  <h4>Search Jobs</h4>
                  <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                </div>
              </div>
              <div class="col-md-4 col-sm-4">
                <div class="working-process">
                  <span class="process-img">
                    <img src="assets/img/step-3.png" class="img-responsive" alt="" />
                    <span class="process-num">03</span>
                  </span>
                  <h4>Save & Apply</h4>
                  <p>Post a job to tell us about your project. We'll quickly match you with the right freelancers find place best.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section class="pricing">
          <div class="container">
            <div class="row">
              <div class="col-md-12">
                <div class="main-heading">
                  <p>Top Freelancer</p>
                  <h2>Hire Expert <span>Freelancer</span></h2>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 col-sm-6">
                <div class="freelance-container style-2">
                  <div class="freelance-box">
                    <span class="freelance-status">Available</span>
                    <h4 class="flc-rate">$17/hr</h4>
                    <div class="freelance-inner-box">
                      <div class="freelance-box-thumb">
                        <img src="assets/img/can-5.jpg" class="img-responsive img-circle" alt="" />
                      </div>
                      <div class="freelance-box-detail">
                        <h4>Agustin L. Smith</h4>
                        <span class="location">Australia</span>
                      </div>
                      <div class="rattings">
                        <i class="fa fa-star fill"></i>
                        <i class="fa fa-star fill"></i>
                        <i class="fa fa-star fill"></i>
                        <i class="fa fa-star-half fill"></i>
                        <i class="fa fa-star"></i>
                      </div>
                    </div>
                    <div class="freelance-box-extra">
                      <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui.</p>
                      <ul>
                        <li>Php</li>
                        <li>Android</li>
                        <li>Html</li>
                        <li class="more-skill bg-primary">+3</li>
                      </ul>
                    </div>
                    <a href="freelancer-detail.html" class="btn btn-freelance-two bg-default">View Detail</a>
                    <a href="freelancer-detail.html" class="btn btn-freelance-two bg-info">View Detail</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12">
                <div class="text-center">
                  <a href="freelancers-2.html" class="btn btn-primary">Load More</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
      
    );
  }
}

export default HomePage;
