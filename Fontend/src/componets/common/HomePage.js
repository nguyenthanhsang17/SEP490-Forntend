import React, { useEffect, useState } from "react";
// import "../assets/css/style.css";
// import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';
import Footer from "./Footer";
import bannerImage from "../assets/img/banner-9.jpg";
import Header from "./Header";
import axios from "axios";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Fetch blogs from the provided API
  useEffect(() => {
    axios
      .get("https://localhost:7077/api/Home/getThreeBlogNews")
      .then((response) => {
        setBlogs(response.data); // Assuming response.data contains an array of blog objects
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });

    // Fetch popular jobs from the provided API
    axios
      .get("https://localhost:7077/api/Home/getPopularJob")
      .then((response) => {
        setJobs(response.data); // Assuming response.data contains an array of job objects
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        {/* Banner Section */}
        <div
          className="banner"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
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
                      <select
                        id="choose-city"
                        className="form-control"
                        aria-label="Choose City"
                      >
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
                      <button type="submit" className="btn btn-primary">
                        Tìm Kiếm
                      </button>
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
                <p>Latest Blogs</p>
                <h2>
                  New & Trending <span>Blogs</span>
                </h2>
              </div>
            </div>
            <div className="row extra-mrg">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div key={blog.blogId} className="col-md-4 col-sm-6">
                    <div className="grid-view brows-job-list">
                      <div className="brows-job-company-img">
                        <img
                          src={`assets/img/blog-${blog.thumbnail}.jpg`} // Assuming blog images are named like 'blog-3.jpg'
                          className="img-responsive"
                          // alt={blog.blogTitle}
                        />
                      </div>
                      <div className="brows-job-position">
                        <h3>
                          <a href={`/blogDetail/${blog.blogId}`}>
                            {blog.blogTitle}
                          </a>{" "}
                          {/* Blog title with dynamic link */}
                        </h3>
                        <p>{blog.blogDescription.substring(0, 150)}...</p>{" "}
                        {/* Show a short preview of the description */}
                      </div>
                      <div className="blog-meta">
                        <span className="author">
                          <i className="fa fa-user"></i> Author ID:{" "}
                          {blog.authorId}
                        </span>
                        <span className="create-date">
                          <i className="fa fa-calendar"></i>{" "}
                          {new Date(blog.createDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No blogs available.</p>
              )}
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
                  <h2>
                    How It <span>Works</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col-sm-4">
                <div className="working-process">
                  <span className="process-img">
                    <img
                      src="assets/img/step-1.png"
                      className="img-responsive"
                      alt="Step 1"
                    />
                    <span className="process-num">01</span>
                  </span>
                  <h4>Create An Account</h4>
                  <p>
                    Post a job to tell us about your project. We'll quickly
                    match you with the right freelancers find place best.
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="working-process">
                  <span className="process-img">
                    <img
                      src="assets/img/step-2.png"
                      className="img-responsive"
                      alt="Step 2"
                    />
                    <span className="process-num">02</span>
                  </span>
                  <h4>Search Jobs</h4>
                  <p>
                    Post a job to tell us about your project. We'll quickly
                    match you with the right freelancers find place best.
                  </p>
                </div>
              </div>
              <div className="col-md-4 col-sm-4">
                <div className="working-process">
                  <span className="process-img">
                    <img
                      src="assets/img/step-3.png"
                      className="img-responsive"
                      alt="Step 3"
                    />
                    <span className="process-num">03</span>
                  </span>
                  <h4>Save & Apply</h4>
                  <p>
                    Post a job to tell us about your project. We'll quickly
                    match you with the right freelancers find place best.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Jobs Section */}
        <section className="pricing">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="main-heading">
                  <p>Top Jobs</p>
                  <h2>
                    Popular <span>Jobs</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="row">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job.postId} className="col-md-4 col-sm-6">
                    <div className="freelance-container style-2">
                      <div className="freelance-box">
                        <span
                          className={`freelance-status ${
                            job.isUrgentRecruitment ? "urgent" : ""
                          }`}
                        >
                          {job.isUrgentRecruitment ? "Urgent" : "Available"}
                        </span>
                        <h4 className="flc-rate">
                          {job.fixSalary !== null
                            ? `₫${job.fixSalary.toLocaleString()} / ${
                                job.salaryTypeName
                              }`
                            : `₫${job.rangeSalaryMin.toLocaleString()} - ₫${job.rangeSalaryMax.toLocaleString()} / ${
                                job.salaryTypeName
                              }`}
                        </h4>
                        <div className="freelance-inner-box">
                          <div className="freelance-box-thumb">
                            <img
                              src={job.thumnail}
                              className="img-responsive img-circle"
                              alt={job.jobTitle}
                            />
                          </div>
                          <div className="freelance-box-detail">
                            <h4>{job.jobTitle}</h4>
                            <span className="location">{job.address}</span>
                          </div>
                        </div>
                        <div className="freelance-box-extra">
                          <p>{job.jobDescription}</p>
                          <ul>
                            <li>{job.jobCategoryName}</li>
                          </ul>
                          <div className="clearfix"></div>
                        </div>
                      </div>
                      <a
                        href={`/jobDetail/${job.postId}`}
                        className="btn btn-freelance-two bg-default"
                      >
                        View Detail
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p>No popular jobs available.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
