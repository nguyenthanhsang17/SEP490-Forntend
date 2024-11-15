import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css"; // Import CSS tùy chỉnh
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ViewBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const fetchBlogs = async (page) => {
        try {
            const response = await axios.get(`/api/blogs?page=${page}`);
            setBlogs(response.data.blogs);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách blog:", error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleBlogClick = (blogId) => {
        navigate(`/blogDetail/${blogId}`);
    };

    return (
        <>
            <Header />

            {/* Tiêu đề trang bắt đầu */}
            <section className="inner-header-title" style={{ backgroundImage: "url(assets/img/banner-10.jpg)" }}>
                <div className="container">
                    <h1>Trang Blog</h1>
                </div>
            </section>
            <div className="clearfix"></div>
            {/* Tiêu đề trang kết thúc */}

            {/* Danh sách Blog bắt đầu */}
            <section className="section">
                <div className="container">
                    <div className="row no-mrg">
                        {/* Danh sách Blog */}
                        <div className="col-md-8">
                            {blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <article className="blog-news" key={blog.id}>
                                        <div className="short-blog">
                                            <figure className="img-holder">
                                                <a onClick={() => handleBlogClick(blog.id)}>
                                                    <img src={blog.image || "assets/img/blog/default.jpg"} className="img-responsive" alt="Blog" />
                                                </a>
                                                <div className="blog-post-date">
                                                    {new Date(blog.date).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" })}
                                                </div>
                                            </figure>
                                            <div className="blog-content">
                                                <div className="post-meta">Bởi: <span className="author">{blog.author}</span></div>
                                                <a onClick={() => handleBlogClick(blog.id)}>
                                                    <h2>{blog.title}</h2>
                                                </a>
                                                <div className="blog-text">
                                                    <p>{blog.summary}</p>
                                                    <div className="post-meta">Danh mục: <span className="category"><a href="#">{blog.category}</a></span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p>Không có bài viết nào.</p>
                            )}
                        </div>
                        {/* Kết thúc danh sách Blog */}
                    </div>

                    {/* Phân trang */}
                    <div className="row">
                        <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
                            <Button
                                shape="circle"
                                icon={<LeftOutlined />}
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            />
                            <span style={{ margin: '0 10px', fontSize: '16px' }}>
                                {currentPage} / {totalPages} trang
                            </span>
                            <Button
                                shape="circle"
                                icon={<RightOutlined />}
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default ViewBlogList;
