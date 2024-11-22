import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";

const BlogDetail = () => {
  const { id } = useParams(); // Lấy ID blog từ URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/Blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog detail', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [id]);

  // Kiểm tra nếu dữ liệu chưa được tải xong
  if (loading) return <p>Loading...</p>;

  // Kiểm tra nếu không có blog
  if (!blog) return <p>Blog không tồn tại.</p>;

  // Xử lý trạng thái và hành động của nút
  const handleAction = async (newStatus) => {
    try {
      const endpoint = newStatus === 0 ? "show" : "hide"; // Chọn endpoint phù hợp
      const response = await axios.put(`https://localhost:7077/api/Blogs/${endpoint}?blogId=${id}`);
  
      if (response.status === 200) {
        if(endpoint==='show'){alert("ẩn thành công");}else{alert("hiện thành công") }

        setBlog((prev) => ({ ...prev, status: newStatus })); // Cập nhật trạng thái bài viết
      } else {
        alert('Không thể thay đổi trạng thái bài viết.');
      }
    } catch (error) {
      console.error('Error updating blog status', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const renderButton = () => {
    switch (blog.status) {
      case 0:
        return <button style={styles.actionButton} onClick={() => handleAction(1)}>Hiện</button>;
      case 1:
        return <button style={styles.actionButton} onClick={() => handleAction(0)}>Ẩn</button>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
      <div style={styles.container}>
      <div style={styles.blogDetail}>
        <h2 style={styles.blogTitle}>{blog.blogTitle}</h2>
        <p style={styles.author}>Tác giả: {blog.authorName}</p>
        <p style={styles.createDate}>Ngày tạo: {new Date(blog.createDate).toLocaleDateString()}</p>
        <img src={blog.thumbnail} alt={blog.blogTitle} style={styles.thumbnail} />
        <p style={styles.description}>{blog.blogDescription}</p>
        <div style={styles.buttonContainer}>{renderButton()}</div>
      </div>
    </div>
      </main>
    </div>
    
  );
};

const styles = {
  container: {
    padding: '0px',
    maxWidth: '100%',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  blogDetail: {
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  blogTitle: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  author: {
    fontStyle: 'italic',
    fontSize: '18px',
    color: '#555',
    marginBottom: '10px',
  },
  createDate: {
    fontSize: '18px',
    color: '#888',
    marginBottom: '20px',
  },
  thumbnail: {
    width: 'auto',
    maxWidth: 'auto',
    height: '300px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#333',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default BlogDetail;
