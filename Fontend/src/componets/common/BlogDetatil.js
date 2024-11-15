import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css";

const BlogDetatil = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchChiTietBlog();
  }, [id]);

  const fetchChiTietBlog = async () => {
    try {
      const response = await axios.get(`/api/blog/${id}`); // Thay bằng API endpoint của bạn
      setBlog(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bài viết:", error);
    }
  };

  return (
    <>
      <Header />
      {/* Tiêu đề trang */}
      <section className="inner-header-title" style={{ backgroundImage: "url(assets/img/banner-10.jpg)" }}>
        <div className="container">
          <h1>Chi Tiết Blog</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      {/* Chi tiết blog */}
      <section className="section">
        <div className="container">
          <div className="row no-mrg">
            <div className="col-md-12">
              {blog ? (
                <article className="blog-news">
                  <div className="full-blog">
                    <figure className="img-holder">
                      <img src={blog.image || "assets/img/blog/default.jpg"} className="img-responsive" alt="Hình ảnh bài viết" />
                      <div className="blog-post-date">
                        {new Date(blog.date).toLocaleDateString("vi-VN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </figure>
                    <div className="full blog-content">
                      <div className="post-meta">
                        Tác giả: <span className="author">{blog.author}</span>
                      </div>
                      <h2>{blog.title}</h2>
                      <div className="blog-text">
                        <p>{blog.content}</p>
                        <div className="post-meta">
                          Chủ đề: <span className="category">{blog.category}</span>
                        </div>
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

export default BlogDetatil;