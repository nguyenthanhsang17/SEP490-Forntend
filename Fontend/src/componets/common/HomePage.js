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
        console.error("Lỗi khi lấy bài viết:", error);
      });

    axios
      .get("https://localhost:7077/api/Home/getPopularJob")
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy công việc phổ biến:", error);
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
              
            </div>
          </div>
        </div>

        {/* Job List Section */}
        <section>
          <div className="container">
            <div className="row">
              <div className="main-heading">
                <p>Bài Viết Mới Nhất</p>
                <h2>
                  Blog Mới & Xu Hướng <span>Bài Viết</span>
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
                <p>Không có bài viết nào.</p>
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
                  <p>Quy Trình Làm Việc</p>
                  <h2>
                    Cách Hoạt Động <span>Quy Trình</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="row">
              {["Tạo Tài Khoản", "Tìm Kiếm Công Việc", "Lưu & Ứng Tuyển"].map(
                (step, index) => (
                  <div key={index} className="col-md-4 col-sm-4 mb-4">
                    <div className="working-process text-center">
                      <h4>{step}</h4>
                      <p>
                        {index === 0 &&
                          "Đăng ký tài khoản, xác minh và cập nhật hồ sơ cá nhân để sẵn sàng tìm kiếm công việc."}
                        {index === 1 &&
                          "Khám phá các công việc phù hợp, xem chi tiết và lưu những công việc yêu thích."}
                        {index === 2 &&
                          "Ứng tuyển nhanh chóng, theo dõi trạng thái và quản lý tiến trình ứng tuyển của bạn."}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Popular Jobs Section */}
        <section className="pricing">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="main-heading">
                  <p>Công Việc Hàng Đầu</p>
                  <h2>
                    Công Việc <span>Phổ Biến</span>
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
                          {job.isUrgentRecruitment ? "Khẩn Cấp" : "Có Sẵn"}
                        </span>
                        <h4 className="flc-rate">
                          ₫{job.salary.toLocaleString("vi-VN")} /{" "}
                          {job.salaryTypeName.replace(/^[Tt]heo\s/, "")}
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
                        href={`/viewJobDetail/${job.postId}`} // Sửa ở đây
                        className="btn btn-freelance-two bg-default"
                      >
                        Xem Chi Tiết
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có công việc phổ biến nào.</p>
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
            .freelance-status.urgent {
              background-color: #d9534f;
              color: #fff;
            }
            .freelance-box-extra {
              border-top: 1px solid #f5f5f5;
              padding: 20px;
              font-size: 14px;
              color: #777;
            }
          `}</style>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
