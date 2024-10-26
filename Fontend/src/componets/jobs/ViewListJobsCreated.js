import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';

const ViewListJobsCreated = () => {
    // Khởi tạo các state cần thiết
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [salaryTypesId, setSalaryTypesId] = useState(0);
    const [jobCategoryId, setJobCategoryId] = useState(0);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const navigate = useNavigate();

    // Hàm lấy vị trí của người dùng
    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    () => setError('Unable to retrieve your location.')
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        getLocation();
    }, []);

    // Hàm lấy dữ liệu công việc dựa vào trang hiện tại, loại lương và loại công việc
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://localhost:7077/api/PostJobs/GetListJobsCreated`, {
                    params: {
                        SalaryTypesId: salaryTypesId,
                        JobCategoryId: jobCategoryId,
                        pageNumber: currentPage,
                    },
                });

                const fetchedJobs = response.data.items.$values || [];
                const jobsWithDistance = fetchedJobs.map((job) => ({
                    ...job,
                    distance: calculateDistance(userLocation.latitude, userLocation.longitude, job.latitude, job.longitude),
                }));

                setJobs(jobsWithDistance);
                setTotalPages(response.data.totalPages || 1); // Đảm bảo totalPages không bị null hoặc undefined
            } catch {
                setError('Failed to fetch jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (userLocation.latitude && userLocation.longitude) {
            fetchJobs();
        }
    }, [currentPage, salaryTypesId, jobCategoryId, userLocation]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;

        const R = 6371; // Bán kính Trái Đất (km)
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(2);
    };

    const handleJobClick = (postId) => navigate(`/viewJobDetail/${postId}`);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="error">{error}</div>;

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
                    <div className="job-item" >
                        <article>
                            <div className="brows-job-list" key={job.postId} onClick={() => handleJobClick(job.postId)}>
                                <div className="job-thumbnail">
                                    <img src={job.thumbnail || 'path/to/fallback-image.jpg'} className="img-responsive" alt={job.jobTitle || 'Job Thumbnail'} />
                                </div>
                                <div className="job-details">
                                    <h3>{job.jobTitle}</h3>
                                    <p>
                                        <span className="job-author">
                                            <strong>Nhà tuyển dụng:</strong> {job.authorName}
                                        </span>
                                        <span className="brows-job-salary">
                                            <i className="fa fa-money"></i> {job.salary} VND /
                                        </span>
                                        <span className="job-type">{job.salaryTypeName}</span>
                                    </p>
                                    <p className="job-location">
                                        <i className="fa fa-map-marker"></i> {job.address}
                                    </p>
                                </div>
                            </div>
                            <div className="button-container">
                                <a href="#" className="apply-button">Chỉnh sửa bài đăng</a>
                                <a href="#" className="apply-button favorite-button" >Ẩn bài đăng</a>
                            </div>
                            {job.isUrgentRecruitment && <span className="urgent-tag">Premium</span>}
                        </article>
                    </div>

                ))}

                <div className="pagination">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Trang trước
                    </button>
                    <span>Trang {currentPage} trên {totalPages}</span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Trang tiếp theo
                    </button>
                </div>
            </div>

            <Footer />

            <style jsx>{`
        .job-list { margin: 20px auto; max-width: 800px; }
        .job-item { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); background-color: #fff; transition: box-shadow 0.3s; }
        .job-item:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15); }
        .brows-job-list { display: flex; align-items: flex-start; }
        .job-thumbnail { flex: 0 0 100px; margin-right: 15px; }
        .job-thumbnail img { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; }
        .job-details { flex: 1; }
        .job-details h3 { font-size: 1.25rem; margin-bottom: 5px; color: #333; }
        .brows-job-salary { margin-left: 10px; font-weight: 600; color: #28a745; }
        .job-location { color: #777; margin: 5px 0; }
        .job-distance { color: #666; }
        .button-container { display: flex; gap: 10px; }
        .apply-button { padding: 8px 16px; border-radius: 5px; background-color: #007bff; color: white; font-weight: 600; text-align: center; text-decoration: none; transition: background-color 0.2s; }
        .apply-button:hover { background-color: #0056b3; }
        .favorite-button { background-color: #ffc107; }
        .urgent-tag { background-color: #ffc107; padding: 5px 10px; border-radius: 3px; font-weight: 600; }
        .pagination { display: flex; justify-content: center; align-items: center; margin-top: 20px; }
        .pagination button { padding: 8px 12px; margin: 0 5px; border-radius: 5px; background-color: #007bff; color: #fff; font-weight: 600; }
        .pagination button:disabled { background-color: #ddd; color: #aaa; }
        .pagination span { margin: 0 10px; }
        .job-author,
.brows-job-salary,
.job-type,
.job-distance {
  display: inline-block;
  margin-right: 15px;
}

.job-location {
  color: #777;
  margin: 10px 0;
}

.job-distance {
  color: #666;
  font-style: italic;
}

      `}</style>
        </>
    );
};

export default ViewListJobsCreated;
