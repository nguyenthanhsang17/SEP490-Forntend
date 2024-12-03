import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();
  // Fetch data from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://localhost:7077/api/Blogs/GetAllBlog', {
          params: {
            pageNumber,
            pageSize: 10,
            title: searchTitle,
            status: statusFilter,
            sortOrder: sortOrder
          }
        });
        setBlogs(response.data.items);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching blogs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pageNumber, searchTitle, statusFilter, sortOrder]);

  // Handle next and previous page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };
  const handleViewDetail = (blogid) => {
    navigate(`/BlogDetailllll/${blogid}`); // Điều hướng đến trang chi tiết người dùng
  };

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="blog-list-container">
          <h2>Danh sách Blog</h2>

          {/* Search and filter controls */}
          <div className="filters">
            <div className="filter-item">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label htmlFor="statusFilter">Trạng thái:</label>
              <select id="statusFilter" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="">Tất cả </option>
                <option value="0">Hiện</option>
                <option value="1">Ẩn</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="sortOrder">Sắp xếp:</label>
              <select id="sortOrder" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                <option value="desc">Mới nhất</option>
                <option value="asc">Cũ nhất</option>
              </select>
            </div>
          </div>
          <div className="create-blog-container">
            <button onClick={() => navigate("/CreateBlog")} className="create-blog-button"><FontAwesomeIcon icon={faPlus} /> Tạo Blog</button>
          </div>
          {/* Displaying blogs as a table */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="blog-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Tác giả</th>
                  <th>Ngày tạo</th>
                  <th>Ảnh</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.blogId}>
                    <td>{blog.blogTitle}</td>
                    <td>{blog.authorName}</td>
                    <td>{new Date(blog.createDate).toLocaleDateString()}</td>
                    <td><img src={blog.thumbnail} alt={blog.blogTitle} className="thumbnail" /></td>
                    <td><button className="view-button" onClick={() => handleViewDetail(blog.blogId)}>Xem chi tiết</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            className="pagination-container mt-4 d-flex justify-content-center align-items-center"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              className="btn btn-light"
              disabled={pageNumber === 1}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                padding: "0",
              }}
            >
              &lt;
            </button>
            <span style={{ margin: "0 10px", fontSize: "16px" }}>
              {pageNumber} / {totalPages} trang
            </span>
            <button
              className="btn btn-light"
              disabled={pageNumber === totalPages}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                padding: "0",
              }}
            >
              &gt;
            </button>
          </div>



          <style jsx>{`
        .blog-list-container {
    padding: 30px;
    font-family: 'Inter', 'Roboto', sans-serif;
    max-width: 1400px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

h2 {
    text-align: center;
    margin-bottom: 40px;
    color: #2c3e50;
    font-weight: 700;
    position: relative;
    padding-bottom: 15px;
}

h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #3498db;
    border-radius: 2px;
}

.filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
}

.filter-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.filters input,
.filters select {
    padding: 12px 15px;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    outline: none;
}

.filters input:focus,
.filters select:focus {
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filters label {
    color: #2c3e50;
    font-weight: 600;
    white-space: nowrap;
}

.blog-table {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.blog-table thead {
    background-color: #f1f5f9;
}

.blog-table th,
.blog-table td {
    padding: 15px 20px;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.3s ease;
}

.blog-table th {
    color: #2c3e50;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.blog-table tr:hover {
    background-color: #f1f5f9;
}

.thumbnail {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s ease;
}

.thumbnail:hover {
    transform: scale(1.1);
}

.view-button {
    padding: 10px 15px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.view-button:hover {
    background-color: #2980b9;
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.view-button:active {
    transform: translateY(-1px);
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 15px;
}

.pagination-controls button {
    padding: 12px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.pagination-controls button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.pagination-controls button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.pagination-controls span {
    color: #2c3e50;
    font-weight: 500;
}
    .create-blog-container {
    display: flex;
    justify-content: center; /* Center horizontally */
    margin: 20px 0; /* Add some margin for spacing */
  }

  .create-blog-button {
    padding: 12px 20px; /* Add padding */
    background-color: #3498db; /* Button background color */
    color: white; /* Text color */
    border: none; /* Remove border */
    border-radius: 8px; /* Rounded corners */
    font-weight: 600; /* Font weight */
    transition: background-color 0.3s ease, transform 0.3s ease; /* Transition effects */
  }

  .create-blog-button:hover {
    background-color: #2980b9; /* Darker color on hover */
    transform: translateY(-2px); /* Slight lift effect */
  }

  .create-blog-button:active {
    transform: translateY(0); /* Reset on click */
  }
      `}</style>
        </div>
      </main>
    </div>

  );
};

export default BlogList;
