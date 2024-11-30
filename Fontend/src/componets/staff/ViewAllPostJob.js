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

// Inline CSS styles
const styles = {
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px 0',
  },
  filterLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  filterSelect: {
    padding: '8px',
    borderRadius: '5px',
  },
  jobListContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '92%',
    maxWidth: '1200px',
    margin: '10px auto',
    boxSizing: 'border-box',
  },
  jobCard: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 100px 120px',
    gap: '20px',
    alignItems: 'center',
    width: '100%',
    padding: '15px',
    marginBottom: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  jobImageContainer: {
    width: '100%',
    height: '150px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  jobImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  jobDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  jobTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  jobAddress: {
    color: '#666',
    marginBottom: '4px',
  },
  jobAuthor: {
    color: '#666',
    marginBottom: '4px',
  },
  jobDate: {
    color: '#666',
    marginBottom: '4px',
  },
  jobCategory: {
    color: '#666',
  },
  jobStatus: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#007bff',
  },
  viewDetailsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetailsButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
  },
  paginationButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 10px',
  },
};

export default ViewAllPostJob;
