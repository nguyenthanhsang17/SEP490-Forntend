import React, { useEffect, useState } from "react";
import "../assets/css/colors/green-style.css";
import Footer from "./Footer";
import bannerImage from "../assets/img/banner-9.jpg";
import Header from "./Header";
import axios from "axios";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7077/api/Home/getThreeBlogNews")
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
      });

    axios
      .get("https://localhost:7077/api/Home/getPopularJob")
      .then((response) => {
        setJobs(response.data);
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
                  <div className="row">
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
                  <div key={blog.blogId} className="col-md-4 col-sm-6 mb-4">
                    <div className="grid-view brows-job-list">
                      <div className="brows-job-company-img">
                        <img
                          src={`${blog.thumbnail}`}
                          className="img-responsive"
                        />
                      </div>
                      <div className="brows-job-position">
                        <h3>
                          <a href={`/blogDetail/${blog.blogId}`}>
                            {blog.blogTitle}
                          </a>
                        </h3>
                        <p>{blog.blogDescription.substring(0, 150)}...</p>
                      </div>
                      <div className="blog-meta">
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
              {["Create An Account", "Search Jobs", "Save & Apply"].map((step, index) => (
                <div key={index} className="col-md-4 col-sm-4 mb-4">
                  <div className="working-process text-center">
                    
                    <h4>{step}</h4>
                    <p>
                      Post a job to tell us about your project. We'll quickly
                      match you with the right freelancers find place best.
                    </p>
                  </div>
                </div>
              ))}
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
                  <div key={job.postId} className="col-md-4 col-sm-6 mb-4">
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
                          ₫{job.salary.toLocaleString()} / {job.salaryTypeName}
                        </h4>
                        <div className="freelance-inner-box">
                          <div className="freelance-box-thumb">
                            <img
                              src={job.thumnail || "path/to/default-image.jpg"}
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

          {/* Inline styling for the component */}
          <style jsx>{`
            .freelance-container {
              margin-bottom: 30px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              border-radius: 10px;
              overflow: hidden;
              background-color: #fff;
              transition: transform 0.3s ease;
            }
            .freelance-container:hover {
              transform: translateY(-5px);
            }
            .banner {
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-size: cover;
              color: #fff;
            }
            .banner-caption {
              text-align: center;
            }
            .banner-caption h1 {
              margin-bottom: 20px;
            }
            .row.extra-mrg {
              margin-top: 40px;
            }
            .how-it-works {
              margin: 60px 0;
            }
            .pricing {
              margin: 60px 0;
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
