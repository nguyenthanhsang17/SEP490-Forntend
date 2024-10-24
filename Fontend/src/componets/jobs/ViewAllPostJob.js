import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [salaryTypesId, setSalaryTypesId] = useState(0);
  const [jobCategoryId, setJobCategoryId] = useState(0);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            setError('Unable to retrieve your location.');
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/PostJobs?SalaryTypesId=${salaryTypesId}&JobCategoryId=${jobCategoryId}&pageNumber=${currentPage}`);
        const fetchedJobs = response.data.items.$values || [];
        // Calculate distance for each job
        const jobsWithDistance = fetchedJobs.map(job => ({
          ...job,
          distance: calculateDistance(userLocation.latitude, userLocation.longitude, job.latitude, job.longitude) // Assuming job object contains latitude and longitude
        }));
        setJobs(jobsWithDistance);
        setTotalPages(response.data.totalPages || 0);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch jobs only if the user's location is available
    if (userLocation.latitude && userLocation.longitude) {
      fetchJobs();
    }
  }, [currentPage, salaryTypesId, jobCategoryId, userLocation]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };

  const handleJobClick = (postId) => {
    navigate(`/viewJobDetail/${postId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="clearfix"></div>
      <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="container">
          <h1>Tất Cả Các Công Việc</h1>
        </div>
      </section>
      <div className="clearfix"></div>
      <div className="job-list">
        {jobs.map((job) => (
          <div
            className="job-item"
            key={job.postId}
            onClick={() => handleJobClick(job.postId)}
          >
            <article>
              <div className="brows-job-list">
                <div className="job-thumbnail">
                  <img
                    src={job.thumbnail || 'path/to/fallback-image.jpg'}
                    className="img-responsive"
                    alt={job.jobTitle || 'Job Thumbnail'}
                  />
                </div>
                <div className="job-details">
                  <h3>{job.jobTitle}</h3>
                  <p>
                    <span>Nhà tuyển dụng: {job.authorName}</span>
                    <span className="brows-job-salary">
                      <i className="fa fa-money"></i>{job.salary} VND/ 
                    </span>
                    <span className="job-type">{job.salaryTypeName}</span>
                    <span className="job-distance">
                      <i className="fa fa-map-marker"></i> {job.distance} km away
                    </span>
                  </p>
                  <p className="job-location">
                    <i className="fa fa-map-marker"></i>{job.address}
                  </p>
                  <a href="#" className="apply-button">ỨNG TUYỂN NGAY</a>
                  <a href="#" className="apply-button">YÊU THÍCH</a>
                </div>
              </div>
              {job.isUrgentRecruitment && (
                <span className="urgent-tag">Premium</span>
              )}
            </article>
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      <Footer />
      
      {/* Style Block */}
      <style jsx>{`
  .job-list {
    margin: 20px;
  }

  .job-item {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px; /* Spacing between items */
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s; /* Smooth transition for hover effects */
    display: flex; /* Flexbox for inner elements */
    flex-direction: column; /* Stack items vertically */
    background-color: #fff; /* White background for job items */
  }

  .job-item:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  }

  .brows-job-list {
    display: flex;
    flex-direction: row; /* Row for thumbnail and details */
    align-items: center; /* Center align items */
  }

  .job-thumbnail {
    flex: 0 0 80px; /* Fixed width for thumbnail */
    margin-right: 15px; /* Space between thumbnail and details */
    overflow: hidden; /* Prevent image overflow */
    border-radius: 5px; /* Rounded corners for thumbnails */
  }

  .job-thumbnail img {
    width: 100%;
    height: auto;
    border-radius: 5px; /* Added rounded corners to images */
    object-fit: cover; /* Maintain aspect ratio */
  }

  .job-details {
    flex: 1;
  }

  .brows-job-salary {
    margin-left: 10px;
    font-weight: bold; /* Highlight salary */
  }

  .job-location {
    margin-top: 5px;
    color: #555; /* Slightly darker color for location text */
  }

  .job-distance {
    margin-top: 5px;
    color: #666; /* Optional: Different color for distance text */
  }

  .apply-button {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 15px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    text-decoration: none;
    transition: background-color 0.2s; /* Smooth transition for hover effect */
  }

  .apply-button:hover {
    background-color: #218838;
  }

  .urgent-tag {
    background-color: #ffc107;
    padding: 5px 10px;
    border-radius: 3px;
    margin-top: 10px;
    display: inline-block;
    font-weight: bold; /* Highlight urgent jobs */
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination button {
    margin: 0 10px;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s; /* Smooth transition for hover effect */
  }

  .pagination button:disabled {
    background-color: #ccc;
  }

  .pagination span {
    margin: 0 10px;
  }

  @media (max-width: 768px) {
    .brows-job-list {
      flex-direction: column; /* Stack thumbnail and details on smaller screens */
      align-items: flex-start; /* Align items to the start */
    }

    .job-thumbnail {
      margin-bottom: 10px; /* Space between thumbnail and details */
    }
  }
`}</style>

    </>
  );
};

export default JobListing;
