import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css"; // Import CSS tùy chỉnh
import { Card, Row, Col, Pagination, Spin, Alert } from 'antd';
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import bannerImg from "../assets/img/banner-10.jpg";
const { Meta } = Card;

const ViewBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBlogs = async (page) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token'); // Hoặc nơi bạn lưu token
            const response = await axios.get(`https://localhost:7077/api/Blogs/GetAllBlog/${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const { items, pageNumber, totalPages } = response.data;
            setBlogs(items);
            setCurrentPage(pageNumber);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error loading blog list:", error.response?.data || error.message);
            setError("Đã xảy ra lỗi khi tải danh sách bài viết.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBlogClick = (id) => {
        navigate(`/blogDetail/${id}`);
    };

    return (
        <>
            <Header />

            {/* Tiêu đề trang bắt đầu */}
            <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImg})`, padding: '50px 0', textAlign: 'center', color: '#fff' }}>
                <div className="container">
                    <h1 style={{ fontSize: '48px', fontWeight: '700' }}>Trang Blog</h1>
                </div>
            </section>
            <div className="clearfix"></div>
            {/* Tiêu đề trang kết thúc */}

            {/* Danh sách Blog bắt đầu */}
            <section className="section" style={{ padding: '50px 0' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px 0' }}>
                            <Spin size="large" tip="Đang tải bài viết..." />
                        </div>
                    ) : error ? (
                        <Alert message="Lỗi" description={error} type="error" showIcon />
                    ) : (
                        <>
                            <Row gutter={[24, 24]}>
                                {blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <Col key={blog.blogId} xs={24} sm={12} md={12} lg={8}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        alt={blog.blogTitle}
                                                        src={blog.thumbnail || "assets/img/blog/default.jpg"}
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                        onClick={() => handleBlogClick(blog.blogId)}
                                                    />
                                                }
                                                onClick={() => handleBlogClick(blog.blogId)}
                                            >
                                                <Meta
                                                    title={blog.blogTitle}
                                                    description={
                                                        <>
                                                            <p style={{ color: '#888', fontSize: '14px' }}>
                                                                {new Date(blog.createDate).toLocaleDateString("vi-VN", {
                                                                    day: "numeric",
                                                                    month: "numeric",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                            <p style={{ fontSize: '16px', marginTop: '10px' }}>
                                                                {blog.blogDescription.length > 100
                                                                    ? `${blog.blogDescription.substring(0, 100)}...`
                                                                    : blog.blogDescription}
                                                            </p>
                                                        </>
                                                    }
                                                />
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <Alert message="Không có bài viết nào." type="info" showIcon />
                                    </Col>
                                )}
                            </Row>

                            {/* Phân trang */}
                            <div
                                className="pagination-container"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                }}
                            >
                                <Button
                                    shape="circle"
                                    icon={<LeftOutlined />}
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                />
                                <span style={{ margin: "0 10px", fontSize: "16px" }}>
                                    {currentPage} / {totalPages} trang
                                </span>
                                <Button
                                    shape="circle"
                                    icon={<RightOutlined />}
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
};

export default ViewBlogList;
