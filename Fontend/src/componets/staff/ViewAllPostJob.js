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
        // Map through the jobs and add a reportCount property if reports exist
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
    setCurrentPage(1); // Reset to the first page when changing the filter
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
      <h1 style={styles.pageTitle}>Tất cả các Công việc</h1>
        <>
          {/* Filter Dropdown */}
          <div style={styles.filterContainer}>
            <label style={styles.filterLabel}>Lọc theo trạng thái </label>
            <select onChange={handleFilterChange} value={filterStatus} style={styles.filterSelect}>
              <option value={-1}>Tất cả</option>
              <option value={3}>Bị từ chối</option>
              <option value={2}>Đã phê duyệt</option>
              <option value={1}>Chờ phê duyệt</option>
              <option value={-2}>Bị báo cáo</option>
              <option value={6}>Bị cấm</option>
            </select>
          </div>

          <div style={styles.jobListContainer}>
            {jobs.map(job => (
              <div key={job.postId} style={styles.jobCard}>
                <div style={styles.jobImageContainer}>
                  <img
                    src={job.imagePostJobs[0] || 'default-image-url.jpg'}
                    alt={job.jobTitle}
                    style={styles.jobImage}
                  />
                </div>
                <div style={styles.jobDetails}>
                  <h2 style={styles.jobTitle}>{job.jobTitle}</h2>
                  <p style={styles.jobAddress}>Địa Chỉ: {job.address}</p>
                  <p style={styles.jobAuthor}>Người Đăng: {job.authorName}</p>
                  <p style={styles.jobDate}>Ngày Đăng: {new Date(job.createDate).toLocaleDateString()}</p>
                  <p style={styles.jobCategory}>Loại: {job.jobCategoryName}</p>
                </div>
                <div style={styles.jobStatus}>
                  <p>{filterStatus === -2 ? `Bị báo cáo: ${job.reportCount} lần` : statusMapping[job.status]}</p>
                </div>
                <div style={styles.viewDetailsContainer}>
                  <a href={'/ViewDetail/' + job.postId} >
                    <button style={styles.viewDetailsButton}>Xem Chi Tiết</button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.paginationContainer}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              style={styles.paginationButton}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={styles.paginationButton}
            >
              Next
            </button>
          </div>
        </>
      </main>
    </div>

  );
}

const styles = {
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
  },
  filterLabel: {
    marginRight: '15px',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '16px',
  },
  filterSelect: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #bdc3c7',
    backgroundColor: 'white',
    fontSize: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  jobListContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '92%',
    maxWidth: '1200px',
    margin: '10px auto',
    backgroundColor: '#f4f6f8',
    borderRadius: '15px',
  },
  jobCard: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 100px 120px',
    gap: '20px',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    }
  },
  jobImageContainer: {
    width: '150px',
    height: '150px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  jobImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    }
  },
  jobDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  jobTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '5px',
    lineHeight: '1.4',
  },
  jobMetaInfo: {
    color: '#7f8c8d',
    fontSize: '0.9em',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  jobStatus: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: '#f1f2f6',
    color: '#3498db',
  },
  viewDetailsButton: {
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
    }
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
    gap: '15px',
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '10px',
  },
  paginationButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:disabled': {
      backgroundColor: '#bdc3c7',
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      backgroundColor: '#2980b9',
    }
  },
  pageTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: '700',
    borderBottom: '3px solid #3498db',
    paddingBottom: '15px',
  },
};

export default ViewAllPostJob;
