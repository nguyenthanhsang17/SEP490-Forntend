import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import '../assets/css/style.css'; // Import CSS tùy chỉnh
import logoImage from "../assets/img/banner-10.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Thêm FontAwesome
import { faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'; // Icon hiện/ẩn mật khẩu



const ViewAllPostJobInWishlist = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [Notfound, SetNofound] = useState("");
    const [Notfoundjob, SetNotfoundjob] = useState(false);
    const [pageNumber, SetpageNumber] = useState(1);
    // Search filter states
    const [jobKeyword, setJobKeyword] = useState('');
    const [salaryTypesId, setSalaryTypesId] = useState(0);
    const [rangeSalaryMin, setRangeSalaryMin] = useState('');
    const [rangeSalaryMax, setRangeSalaryMax] = useState('');
    const [address, setAddress] = useState('');
    const [jobCategoryId, setJobCategoryId] = useState(0);
    const [sortNumberApplied, setSortNumberApplied] = useState(0);
    const [isUrgentRecruitment, setIsUrgentRecruitment] = useState(-1);

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
                const response = await axios.get('https://localhost:7077/api/PostJobs', {
                    params: {
                        JobKeyWord: jobKeyword,
                        SalaryTypesId: salaryTypesId,
                        RangeSalaryMin: rangeSalaryMin,
                        RangeSalaryMax: rangeSalaryMax,
                        Address: address,
                        JobCategoryId: jobCategoryId,
                        SortNumberApplied: sortNumberApplied,
                        IsUrgentRecruitment: isUrgentRecruitment,
                        pageNumber: currentPage,
                        Latitude: userLocation.latitude,
                        Longitude: userLocation.longitude,
                    },
                });
                if (response.status === 200 && response.data.items) {
                    const fetchedJobs = response.data.items || [];
                    const jobsWithDistance = fetchedJobs.map(job => ({
                        ...job,
                        distance: calculateDistance(userLocation.latitude, userLocation.longitude, job.latitude, job.longitude),
                    }));
                    setJobs(jobsWithDistance);
                    setTotalPages(response.data.totalPages || 0);
                    SetNotfoundjob(false);
                    SetpageNumber(response.data.pageNumber);
                    setTotalPages(response.data.totalPages);
                    console.log(response.data.pageNumber, response.data.totalPages);
                } else {
                    SetNofound("Không tìm thấy công việc phù hợp");
                    SetNotfoundjob(true);
                    setJobs([]);
                }
            } catch (err) {
                if (err.response && err.response.status === 400) {
                    SetNofound("Không tìm thấy công việc phù hợp");
                    setJobs([]);
                } else {
                    setError('An error occurred while fetching jobs.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (userLocation.latitude && userLocation.longitude) {
            fetchJobs();
        }
    }, [currentPage, jobKeyword, salaryTypesId, rangeSalaryMin, rangeSalaryMax, address, jobCategoryId, sortNumberApplied, isUrgentRecruitment, userLocation]);

    const generatePagination = (pageNumber, totalPages) => {
        const paginationItems = [];

        // Thêm nút "Previous"
        paginationItems.push(
            <li key="prev" className={pageNumber === 1 ? 'disabled' : ''}>
                <a onClick={() => pageNumber > 1 && setCurrentPage(pageNumber - 1)}>&laquo;</a>
            </li>
        );

        // Tạo các nút phân trang
        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={pageNumber === i ? 'active' : ''}>
                    <a onClick={() => setCurrentPage(i)}>{i}</a>
                </li>
            );
        }

        // Thêm nút "Next"
        paginationItems.push(
            <li key="next" className={pageNumber === totalPages ? 'disabled' : ''}>
                <a onClick={() => pageNumber < totalPages && setCurrentPage(pageNumber + 1)}>&raquo;</a>
            </li>
        );

        return paginationItems;
    };


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
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to the first page on new search
        const params = {
            JobKeyWord: jobKeyword,
            SalaryTypesId: salaryTypesId,
            RangeSalaryMin: rangeSalaryMin,
            RangeSalaryMax: rangeSalaryMax,
            Address: address,
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


            <section className="inner-header-title" style={{ backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)` }}>
                <div className="container">
                    <h1>Công Việc đã lưu</h1>
                </div>
            </section>

            <section class="brows-job-category">
                <div class="container">
                    <div class="row extra-mrg">
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
                        {Notfoundjob ? (<div className="not-found-message">
                            <p>{Notfound}</p>
                        </div>) : (jobs.map((job) => (
                            <div class="item-click" key={job.postId}
                                onClick={() => handleJobClick(job.postId)}>
                                <article>
                                    <div class="brows-job-list">
                                        <div class="col-md-1 col-sm-2 small-padding">
                                            <div class="brows-job-company-img" style={{ backgroundColor: "white" }}>
                                                <a href=""><img style={{ width: "100px" }} src={job.thumbnail} class="img-responsive" alt="" /></a>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-5">
                                            <div class="brows-job-position">
                                                <a href=""><h3>{job.jobTitle}</h3></a>
                                                <p>
                                                    <span>{job.jobCategoryName}</span><span class="brows-job-sallery"><i class="fa fa-money"></i>{job.salary + " VND"}</span>
                                                    <span class="job-type cl-success bg-trans-success">Full Time</span>
                                                </p>
                                                <p>
                                                    <span>Số người cần tuyển: {job.numberPeople}</span><span class="brows-job-sallery">Số người đã ứng tuyển: {job.numberOfApplicants}</span>

                                                    <span class="job-type cl-success bg-trans-success">Cách bạn: {job.distance} km</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-3 col-sm-3">
                                            <div class="brows-job-location">
                                                <p><i class="fa fa-map-marker"></i>{job.address}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-sm-2">
                                            <div className="brows-job-link">
                                                <a href="" className="btn btn-apply"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện onClick của item-click
                                                    }}>
                                                    Ứng tuyển ngay
                                                </a>
                                                <div className="save-button-container">
                                                    <button
                                                        className="btn btn-save"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Ngăn sự kiện onClick của item-click
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} className="icon-spacing" />
                                                        Bỏ lưu
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    {job.isUrgentRecruitment ? <span class="tg-themetag tg-featuretag">Premium</span> : ""}
                                </article>
                            </div>
                        )))}




                        <div class="row">
                            <ul class="pagination">
                                {generatePagination(pageNumber, totalPages)}
                            </ul>
                        </div>
                    </div>
                </div>
            </section >
            <Footer />
        </>
    );
};

export default ViewAllPostJobInWishlist;
