import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../admin/SidebarAdmin";
import Header from "../admin/HeaderAdmin";

function ViewAllPostJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState(-1);

  const statusMapping = {
    0: 'Nháp',
    1: 'Chờ Duyệt',
    2: 'Đã duyệt',
    3: 'Bị từ chối',
    4: 'Đã xóa',
    5: 'Đã ẩn',
    6: 'Bị Cấm',
  };

  const fetchJobs = (pageNumber) => {
    setLoading(true);
    axios.get(`https://localhost:7077/api/PostJobs/GetAllPostJobs?status=${filterStatus}&pageNumber=${pageNumber}&pageSize=10`)
      .then(response => {
        const updatedJobs = response.data.items.map(job => ({
          ...job,
          reportCount: job.reports ? job.reports.length : 0,
        }));
        setJobs(updatedJobs);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching job posts:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, filterStatus]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(Number(e.target.value));
    setCurrentPage(1);
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="dashboard-grid-container">
      <Sidebar />
      <Header />
      <main className="dashboard-content">
        <div className="container">
          <h1 className='pageTitle' style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '28px',
            fontWeight: '700',
            borderBottom: '3px solid #3498db',
            paddingBottom: '15px'
          }}>
            Tất cả các Công việc
          </h1>

          <div className="filter-container">
            <label className="filterLabel">Lọc theo trạng thái</label>
            <select onChange={handleFilterChange} value={filterStatus} className="filterSelect">
              <option value={-1}>Tất cả</option>
              <option value={3}>Bị từ chối</option>
              <option value={2}>Đã phê duyệt</option>
              <option value={1}>Chờ phê duyệt</option>
              <option value={-2}>Bị báo cáo</option>
              <option value={6}>Bị cấm</option>
            </select>
          </div>

          <table className="job-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Địa chỉ</th>
                <th>Người đăng</th>
                <th>Ngày đăng</th>
                <th>Loại</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.postId}>
                  <td>
                    <img
                      src={job.imagePostJobs[0] || 'default-image-url.jpg'}
                      alt={job.jobTitle}
                      className="job-image"
                    />
                  </td>
                  <td>{job.jobTitle}</td>
                  <td>{job.address}</td>
                  <td>{job.authorName}</td>
                  <td>{new Date(job.createDate).toLocaleDateString()}</td>
                  <td>{job.jobCategoryName}</td>
                  <td>{filterStatus === -2 ? `Bị báo cáo: ${job.reportCount} lần` : statusMapping[job.status]}</td>
                  <td>
                    <div className="action-container">
                      <a href={'/ViewDetail/' + job.postId} className="view-detail-button">
                        Chi tiết
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Trang trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Trang sau
            </button>
          </div>
        </div>

        <style jsx>{`
          .container {
            max-width: 90%;
            margin: 0 auto;
            padding: 10px;
            background-color: #f4f6f8;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .pageTitle {
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
            font-size: 28px;
            font-weight: 700;
            border-bottom: 3px solid #3498db;
            padding-bottom: 15px;
          }

          .filter-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
          }

          .filterLabel {
            font-weight: 500;
            color: #34495e;
            font-size: 14px;
          }

          .filterSelect {
            padding: 10px;
            border: 1px solid #bdc3c7;
            border-radius: 8px;
            font-size: 15px;
          }

          .job-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
            background-color: white;
          }

          .job-table th {
            background-color: #f8f9fa;
            color: #2c3e50;
            font-weight: bold;
            text-align: left;
            padding: 15px;
            border-bottom: 2px solid #e0e0e0;
          }

          .job-table td {
            padding: 15px;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }

          .job-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 10px;
            background-color: #e0e0e0;
          }

          .action-container {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .view-detail-button {
            display: inline-block;
            padding: 8px 15px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }

          .view-detail-button:hover {
            background-color: #2980b9;
          }

          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 15px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
          }

          .pagination-button {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .pagination-button:disabled {
            background-color: #bdc3c7;
            cursor: not-allowed;
          }

          .pagination-button:hover:not(:disabled) {
            background-color: #2980b9;
          }
        `}</style>
      </main>
    </div>
  );
}

export default ViewAllPostJob;
