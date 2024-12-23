import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css";
import bannerImg from "../assets/img/banner-10.jpg";

const BlogDetail = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://localhost:7077/api/Blogs/GetDetailBlog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog details:", error.response || error.message);
    }
  };

  return (
    <>
      <Header />

      <section
        className="inner-header-title"
        style={{ backgroundImage: `url(${bannerImg})` }}
      >
        {blog ? (
          <div className="container">
            <h1>{blog.blogTitle}</h1>
          </div>
        ) : null}
      </section>

      <div className="clearfix"></div>

      <section className="section">
        <div className="container">
          <div className="row no-mrg">
            <div className="col-md-12">
              {blog ? (
                <article className="blog-news">
                  <div className="full-blog">
                    <figure className="img-holder">
                      <img
                        src={blog.thumbnail || "assets/img/blog/default.jpg"}
                        className="img-responsive"
                        alt="Hình ảnh bài viết"
                      />
                      <div className="blog-post-date">
                        {new Date(blog.createDate).toLocaleDateString("vi-VN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </figure>
                    <div className="full blog-content">
                      <h2 className="post-meta">
                        Tác giả: <span className="author">{blog.authorName}</span>
                      </h2>
                      <div className="blog-text">
                        <p>{blog.blogDescription}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <p>Đang tải chi tiết bài viết...</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogDetail;
