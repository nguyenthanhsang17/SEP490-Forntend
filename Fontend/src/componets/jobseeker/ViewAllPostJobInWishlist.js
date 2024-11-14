import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Footer from '../common/Footer';
import Header from '../common/Header';
import '../assets/css/style.css'; // Import CSS tùy chỉnh
import { useSnackbar } from 'notistack'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Thêm FontAwesome
import { faHeart, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons'; // Icon hiện/ẩn mật khẩu
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const ViewAllPostJobInWishlist = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [jobs, setJobs] = useState([]);
    const [sort, setSort] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [notFound, setNotFound] = useState(""); // Correct variable
    const [notFoundJob, setNotFoundJob] = useState(false); // Correct variable
    const [pageNumber, setPageNumber] = useState(1);// Fixed to camelCase
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

    const handleSortChange = (e) => {
        setSort(parseInt(e.target.value));
        setCurrentPage(1); // Reset về trang đầu khi thay đổi sắp xếp
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

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
                    () => setError('Unable to retrieve your location.')
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
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('https://localhost:7077/api/WishJobs/getAllWishListJob', {
                    headers: { Authorization: `Bearer ${token}` },
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
                        sort,
                    },
                });
    
                if (response.status === 200 && response.data.items) {
                    setJobs(response.data.items);
                    setTotalPages(response.data.totalPages || 0);
                    setNotFoundJob(false);
                } else {
                    setNotFound("Không tìm thấy công việc phù hợp"); // Use `setNotFound`
                    setNotFoundJob(true);
                    setJobs([]);
                }
            } catch (err) {
                console.error("Error fetching jobs:", err);
                enqueueSnackbar("An error occurred while fetching jobs.", { variant: 'error' });
                setError(err.message || 'An unknown error occurred.');
            } finally {
                setLoading(false);
            }
        };

        if (userLocation.latitude && userLocation.longitude) {
            fetchJobs();
        }
    }, [
        currentPage, 
        sort, 
        jobKeyword, 
        salaryTypesId, 
        rangeSalaryMin, 
        rangeSalaryMax, 
        address, 
        jobCategoryId, 
        sortNumberApplied, 
        isUrgentRecruitment, 
        userLocation.latitude, 
        userLocation.longitude,
    ]);
    

    const handleRemoveFromWishlist = async (postJobId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const response = await axios.delete('https://localhost:7077/api/WishJobs/DeleteWishJob', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json',
                },
                data: { postJobId },
            });

            if (response.status === 200) {
                enqueueSnackbar(response.data.message, { variant: 'success' });
                setJobs(jobs.filter((job) => job.postId !== postJobId));
            }
        } catch (error) {
            enqueueSnackbar("Xóa công việc khỏi danh sách mong muốn thất bại.", { variant: 'error' });
        }
    };

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
    const handleJobClick = (postId) => {
        navigate(`/viewJobDetail/${postId}`);
    };

    const searchContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px',
    };

    const prioritySortStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '10px 15px',
        borderRadius: '8px',
    };

    const prioritySortLabelStyle = {
        margin: '0 15px',
        fontSize: '14px',
        color: '#666',
        cursor: 'pointer',
    };

    const prioritySortSpanStyle = {
        marginRight: '10px',
        fontWeight: 'bold',
        color: '#333',
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
                        <div className="search-container" style={searchContainerStyle}>
                            <div className="priority-sort" style={prioritySortStyle}>
                                <h4 style={prioritySortSpanStyle}>Ưu tiên hiển thị:</h4>
                                <label style={prioritySortLabelStyle}>
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="0"
                                        checked={sort === 0}
                                        onChange={handleSortChange}
                                    />
                                    Ưu tiên công việc phổ biến
                                </label>
                                <label style={prioritySortLabelStyle}>
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="1"
                                        checked={sort === 1}
                                        onChange={handleSortChange}
                                    />
                                    Ưu tiên công việc lương cao
                                </label>
                                
                                <label style={prioritySortLabelStyle}>
                                    <input
                                        type="radio"
                                        name="sort"
                                        value="3"
                                        checked={sort === 3}
                                        onChange={handleSortChange}
                                    />
                                    Ưu tiên công việc khoảng cách gần nhất
                                </label>
                            </div>
                        </div>
                        {notFoundJob ? (<div className="not-found-message">
                            <p>{notFound}</p>
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
                                                <a href={`/ApplyJob/${job.postId}`} className="btn btn-apply"
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
                                                            handleRemoveFromWishlist(job.postId); // Gọi hàm xóa công việc
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



{jobs.length > 0 && (
    <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
        <Button
            shape="circle"
            icon={<LeftOutlined />}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
        />
        <span style={{ margin: '0 10px', fontSize: '16px' }}>
            {currentPage} / {totalPages} trang
        </span>
        <Button
            shape="circle"
            icon={<RightOutlined />}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
        />
    </div>
)}



                    </div>
                </div>
            </section >
            <Footer />
        </>
    );
};

export default ViewAllPostJobInWishlist;
