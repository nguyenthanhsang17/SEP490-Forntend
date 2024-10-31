import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import '../assets/css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const ViewListJobsCreated = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [notFoundMessage, setNotFoundMessage] = useState('');

    // Search filter states
    const [jobKeyword, setJobKeyword] = useState('');
    const [salaryTypesId, setSalaryTypesId] = useState(0);
    const [rangeSalaryMin, setRangeSalaryMin] = useState('');
    const [rangeSalaryMax, setRangeSalaryMax] = useState('');
    const [status, setStatus] = useState(-1);
    const [jobCategoryId, setJobCategoryId] = useState(0);
    const [sortNumberApplied, setSortNumberApplied] = useState(1);
    const [isUrgentRecruitment, setIsUrgentRecruitment] = useState(-1);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('https://localhost:7077/api/PostJobs/GetListJobsCreated', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        JobKeyWord: jobKeyword,
                        SalaryTypesId: salaryTypesId,
                        RangeSalaryMin: rangeSalaryMin,
                        RangeSalaryMax: rangeSalaryMax,
                        Status: status,
                        JobCategoryId: jobCategoryId,
                        SortNumberApplied: sortNumberApplied,
                        IsUrgentRecruitment: isUrgentRecruitment,
                        pageNumber: currentPage,
                        Latitude: userLocation.latitude,
                        Longitude: userLocation.longitude,
                    },
                });
                const fetchedJobs = response.data.items || [];
                setJobs(fetchedJobs);
                setTotalPages(response.data.totalPages || 0);
                setNotFoundMessage(fetchedJobs.length ? '' : 'Không tìm thấy công việc phù hợp');
            } catch (err) {
                setError('An error occurred while fetching jobs.');
            } finally {
                setLoading(false);
            }
        };

        if (userLocation.latitude && userLocation.longitude) {
            fetchJobs();
        }
    }, [currentPage, jobKeyword, salaryTypesId, rangeSalaryMin, rangeSalaryMax, status, jobCategoryId, sortNumberApplied, isUrgentRecruitment, userLocation]);

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

    const generatePagination = (pageNumber, totalPages) => {
        const paginationItems = [];
        paginationItems.push(
            <li key="prev" className={pageNumber === 1 ? 'disabled' : ''}>
                <a onClick={() => pageNumber > 1 && setCurrentPage(pageNumber - 1)}>&laquo;</a>
            </li>
        );

        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={pageNumber === i ? 'active' : ''}>
                    <a onClick={() => setCurrentPage(i)}>{i}</a>
                </li>
            );
        }

        paginationItems.push(
            <li key="next" className={pageNumber === totalPages ? 'disabled' : ''}>
                <a onClick={() => pageNumber < totalPages && setCurrentPage(pageNumber + 1)}>&raquo;</a>
            </li>
        );

        return paginationItems;
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to the first page on new search
        const params = {
            JobKeyWord: jobKeyword,
            SalaryTypesId: salaryTypesId,
            RangeSalaryMin: rangeSalaryMin,
            RangeSalaryMax: rangeSalaryMax,
            //   Address: address,
            JobCategoryId: jobCategoryId,
            SortNumberApplied: sortNumberApplied,
            IsUrgentRecruitment: isUrgentRecruitment,
            pageNumber: currentPage,
            Latitude: userLocation.latitude,
            Longitude: userLocation.longitude,
        };

        // In ra nội dung của params
        console.log(params);
    };
    const handleJobClick = (postId) => {
        navigate(`/viewJobCreatedDetail/${postId}`);
    };

    // Định nghĩa ánh xạ trạng thái
    const statusLabels = {
        0: "Bản nháp",
        1: "Chờ phê duyệt",
        2: "Đã đăng",
        3: "Bị từ chối",
        4: "Đã xóa",
        5: "Đã ẩn",
        6: "Bị cấm"
    };

    // Hàm lấy nhãn trạng thái từ mã trạng thái
    const getStatusLabel = (status) => {
        return statusLabels[status] || "Không xác định";
    };

    const togglePostVisibility = async (job) => {
        try {
            const token = localStorage.getItem("token");
            const apiEndpoint = job.isVisible
                ? `https://localhost:7077/api/PostJobs/HidePostJob/${job.postId}`
                : `https://localhost:7077/api/PostJobs/ShowPostJob/${job.postId}`;

            await axios.put(apiEndpoint, null, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Cập nhật trạng thái hiển thị của công việc sau khi gọi API thành công
            setJobs(jobs.map(j =>
                j.postId === job.postId ? { ...j, isVisible: !j.isVisible } : j
            ));
        } catch (error) {
            console.error("Failed to toggle job visibility:", error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <Header />
            <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
                <div className="container">
                    <h1>Các công việc đã tạo</h1>
                </div>
            </section>

            <section className="brows-job-category">
                <div className="container">
                    <div className="search-container">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="search-grid">
                                {/* Keyword Search */}
                                <div className="search-item">
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        placeholder="Từ khóa công việc..."
                                        value={jobKeyword}
                                        onChange={(e) => setJobKeyword(e.target.value)}
                                    />
                                </div>

                                {/* Job Category */}
                                <div className="search-item">
                                    <select
                                        className="form-control search-input"
                                        value={jobCategoryId}
                                        onChange={(e) => setJobCategoryId(parseInt(e.target.value))}
                                    >
                                        <option value="0">Loại công việc</option>
                                        <option value="1">Hành chính</option>
                                        <option value="2">Bán hàng & Tiếp thị</option>
                                        <option value="3">Dịch vụ khách hàng</option>
                                        <option value="4">Nhân viên sự kiện</option>
                                        <option value="5">Nhà hàng, khách sạn</option>
                                        <option value="6">Bán lẻ</option>
                                        <option value="7">Hậu cần & Giao hàng</option>
                                        <option value="8">Lao động chân tay</option>
                                        <option value="9">Sáng tạo & Truyền thông</option>
                                        <option value="10">Hỗ trợ kỹ thuật</option>
                                    </select>
                                </div>

                                {/* Salary Type */}
                                <div className="search-item">
                                    <select
                                        className="form-control search-input"
                                        value={salaryTypesId}
                                        onChange={(e) => setSalaryTypesId(parseInt(e.target.value))}
                                    >
                                        <option value="0">Tất cả các loại trả lương</option>
                                        <option value="1">Theo giờ</option>
                                        <option value="2">Theo ngày</option>
                                        <option value="3">Theo công việc</option>
                                        <option value="4">Theo tuần</option>
                                        <option value="5">Theo tháng</option>
                                        <option value="6">Lương cố định</option>
                                    </select>
                                </div>

                                {/* Salary Range */}
                                <div className="search-item">
                                    <input
                                        type="number"
                                        className="form-control search-input"
                                        placeholder="Lương tối thiểu"
                                        value={rangeSalaryMin}
                                        onChange={(e) => setRangeSalaryMin(e.target.value)}
                                    />
                                </div>
                                <div className="search-item">
                                    <input
                                        type="number"
                                        className="form-control search-input"
                                        placeholder="Lương tối đa"
                                        value={rangeSalaryMax}
                                        onChange={(e) => setRangeSalaryMax(e.target.value)}
                                    />
                                </div>

                                {/* Urgent Recruitment */}
                                <div className="search-item">
                                    <select
                                        className="form-control search-input"
                                        value={isUrgentRecruitment}
                                        onChange={(e) => setIsUrgentRecruitment(parseInt(e.target.value))}
                                    >
                                        <option value="-1">Tất cả</option>
                                        <option value="1">Tuyển gấp</option>
                                        <option value="0">Không tuyển gấp</option>
                                    </select>
                                </div>

                                {/* Urgent Recruitment */}
                                <div className="search-item">
                                    <select
                                        className="form-control search-input"
                                        value={status}
                                        onChange={(e) => setStatus(parseInt(e.target.value))}
                                    >
                                        <option value="-1">Tất cả trạng thái bài viết</option>
                                        <option value="0">Bản nháp</option>
                                        <option value="1">Chờ phê duyệt</option>
                                        <option value="2">Đã đăng</option>
                                        <option value="3">Bị từ chối</option>
                                        <option value="4">Đã xóa</option>
                                        <option value="5">Đã ẩn</option>
                                        <option value="6">Bị cấm</option>
                                    </select>
                                </div>

                                {/* Sort By */}
                                <div className="search-item">
                                    <select
                                        className="form-control search-input"
                                        value={sortNumberApplied}
                                        onChange={(e) => setSortNumberApplied(parseInt(e.target.value))}
                                    >
                                        <option value="0">Xắp xếp theo số người ứng tuyển</option>
                                        <option value="1">Ứng tuyển tăng dần</option>
                                        <option value="-1">Ứng tuyển giảm dần</option>
                                    </select>
                                </div>

                                {/* Search Button */}
                                <div className="search-item">
                                    <button type="submit" className="btn search-btn">
                                        <FontAwesomeIcon icon={faSearch} /> Tìm kiếm
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="create-item">
                        <button type="button" className="btn create-btn custom-create-btn">
                            <FontAwesomeIcon icon={faPlus} /> Tạo bài đăng
                        </button>
                    </div>


                    {jobs.length ? (
                        jobs.map((job) => (
                            <div className="item-click" key={job.postId} onClick={() => handleJobClick(job.postId)}>
                                <article>
                                    <div className="brows-job-list">
                                        <div className="col-md-1 col-sm-2 small-padding">
                                            <div className="brows-job-company-img">
                                                <img
                                                    src={job.thumbnail || 'https://via.placeholder.com/100'} // Ảnh mặc định nếu thiếu ảnh thumbnail
                                                    className="img-responsive"
                                                    alt={job.jobTitle}
                                                    style={{ width: "100px" }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-5">
                                            <div className="brows-job-position">
                                                <h3>{job.jobTitle}</h3>
                                                <p>
                                                    <span>{job.jobCategoryName}</span> |
                                                    <span> {job.salaryTypeName}: {job.salary.toLocaleString()} VND</span>
                                                </p>
                                                <p>
                                                    <span>Số người cần tuyển: {job.numberPeople}</span> |
                                                    <span> Số người đã ứng tuyển: {job.numberOfApplicants}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-sm-3">
                                            <div className="brows-job-location">
                                                <p><i className="fa fa-map-marker"></i> {job.address}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-sm-3">
                                            <div className="brows-job-location">
                                                {/* Hiển thị trạng thái công việc */}
                                                <p>{getStatusLabel(job.status)}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-sm-2">
                                            <div className="brows-job-link">
                                                <button
                                                    className="btn btn-default"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện onClick của item-click
                                                        togglePostVisibility(job); // Gọi hàm để ẩn/hiện bài viết
                                                    }}
                                                >
                                                    {/* Hiển thị nội dung nút dựa trên trạng thái và isVisible */}
                                                    {job.status === 2 ? "Ẩn bài viết" : "Hiện bài viết"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {job.isUrgentRecruitment && <span className="tg-themetag tg-featuretag">Tuyển gấp</span>}
                                </article>
                            </div>
                        ))
                    ) : (
                        <div>{notFoundMessage}</div>
                    )}


                    <ul className="pagination">{generatePagination(currentPage, totalPages)}</ul>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ViewListJobsCreated;
