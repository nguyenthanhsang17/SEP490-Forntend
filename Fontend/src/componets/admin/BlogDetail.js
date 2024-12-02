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
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    padding: '20px',
  },
  blogDetail: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '40px',
    marginTop: '20px',
  },
  blogTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '15px',
    borderBottom: '3px solid #3498db',
    paddingBottom: '10px',
  },
  metaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    color: '#7f8c8d',
  },
  author: {
    fontSize: '16px',
    fontStyle: 'italic',
  },
  createDate: {
    fontSize: '16px',
  },
  thumbnail: {
    width: '100%',
    height: '400px',
    objectFit: 'cover',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#2c3e50',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  actionButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  actionButtonHover: {
    ':hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-3px)',
    }
  }
};

export default BlogDetail;
