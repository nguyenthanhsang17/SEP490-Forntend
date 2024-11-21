import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber <= 1}>Trước</button>
        <span>{pageNumber} / {totalPages}</span>
        <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber >= totalPages}>Sau</button>
      </div>

      <style jsx>{`
        .blog-list-container {
          padding: 20px;
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }

        .filters {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .filter-item {
          margin-bottom: 10px;
        }

        .filters input,
        .filters select {
          padding: 8px;
          margin-right: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .filters select {
          max-width: 150px;
        }

        .filters label {
          margin-right: 5px;
          font-weight: bold;
        }

        .blog-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .blog-table th,
        .blog-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .blog-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .blog-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 5px;
        }

        .view-button {
          padding: 8px 12px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-align: center;
        }

        .view-button:hover {
          background-color: #218838;
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .pagination-controls button {
          padding: 10px 15px;
          border-radius: 5px;
          background-color: #007bff;
          color: white;
          border: none;
          margin: 0 5px;
          cursor: pointer;
        }

        .pagination-controls button:disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }

        .pagination-controls span {
          margin: 0 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default BlogList;
