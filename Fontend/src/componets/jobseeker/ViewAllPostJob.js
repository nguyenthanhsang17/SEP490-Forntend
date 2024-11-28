import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css"; // Import CSS tùy chỉnh

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Thêm FontAwesome
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons"; // Icon hiện/ẩn mật khẩu
import { useSnackbar } from "notistack"; // Import useSnackbar
import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [notFound, setNotFound] = useState(""); // For not found message
  const [notFoundJob, setNotFoundJob] = useState(false); // For not found flag
  const [pageNumber, setPageNumber] = useState(1);
  // Search filter states
  const [jobKeyword, setJobKeyword] = useState("");
  const [salaryTypesId, setSalaryTypesId] = useState(0);

  const [address, setAddress] = useState("");
  const [jobCategoryId, setJobCategoryId] = useState(0);
  const [sortNumberApplied, setSortNumberApplied] = useState(0);

  const [distance, Setdistance] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [savedJobs, setSavedJobs] = useState({});
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const navigate = useNavigate();
  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  useEffect(() => {
    // Chỉ tính toán khi `userLocation` có đầy đủ thông tin
    if (userLocation.latitude && userLocation.longitude && jobs.length > 0) {
      const updatedJobs = jobs.map((job) => {
        if (job.latitude && job.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            job.latitude,
            job.longitude
          );
          return { ...job, distance };
        }
        return { ...job, distance: null }; // Nếu công việc không có tọa độ
      });

      setJobs((prevJobs) => {
        if (JSON.stringify(prevJobs) === JSON.stringify(updatedJobs)) {
          return prevJobs; // Ngăn cập nhật lại nếu không có thay đổi
        }
        return updatedJobs;
      });
    }
  }, [userLocation, jobs]); // Thêm `jobs` vào dependency để theo dõi thay đổi

  useEffect(() => {
    const initialSavedJobs = jobs.reduce((acc, job) => {
      if (job.isWishlist === 1) {
        acc[job.postId] = true;
      }
      return acc;
    }, {});
    setSavedJobs((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(initialSavedJobs)) {
        return prev; // Ngăn cập nhật nếu không có thay đổi
      }
      return initialSavedJobs;
    });
  }, [jobs]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        setIsLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            setUserLocation({
              latitude,
              longitude,
            });
            setIsLocationLoading(false);
          },
          (error) => {
            console.warn("Location access denied or unavailable.");
            setUserLocation(null); // Không thể lấy vị trí
            setIsLocationLoading(false);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
        setUserLocation(null);
        setIsLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    const initialSavedJobs = {};
    jobs.forEach((job) => {
      if (job.isWishlist === 1) {
        initialSavedJobs[job.postId] = true;
      }
    });
    setSavedJobs(initialSavedJobs);
  }, [jobs]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Check the token value

      try {
        // Set params based on whether userLocation is available
        const params = {
          JobKeyWord: jobKeyword,
          SalaryTypesId: salaryTypesId,
          Address: address,
          JobCategoryId: jobCategoryId,
          SortNumberApplied: sortNumberApplied,
          pageNumber: currentPage,
          ...(userLocation
            ? {
                Latitude: userLocation.latitude,
                Longitude: userLocation.longitude,
                distance: distance || "",
              }
            : {}),
        };

        // Prepare the headers object conditionally
        const headers = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios.get(
          "https://localhost:7077/api/PostJobs",
          {
            headers,
            params,
          }
        );

        if (response.status === 200 && response.data.items) {
          const fetchedJobs = response.data.items || [];
          setJobs(fetchedJobs);
          setTotalPages(response.data.totalPages || 0);
          setNotFoundJob(false);
          setPageNumber(response.data.pageNumber);
          console.log(response.data.pageNumber, response.data.totalPages);
        } else {
          setNotFound("Không tìm thấy công việc phù hợp");
          setNotFoundJob(true);
          setJobs([]);
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setNotFound("Không tìm thấy công việc phù hợp");
          setJobs([]);
        } else {
          setError("An error occurred while fetching jobs.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [
    currentPage,
    jobKeyword,
    salaryTypesId,
    address,
    jobCategoryId,
    sortNumberApplied,
    userLocation,
    distance,
  ]);

  const generatePagination = (pageNumber, totalPages) => {
    const paginationItems = [];

    // Thêm nút "Previous"
    paginationItems.push(
      <li key="prev" className={pageNumber === 1 ? "disabled" : ""}>
        <a onClick={() => pageNumber > 1 && setCurrentPage(pageNumber - 1)}>
          &laquo;
        </a>
      </li>
    );

    // Tạo các nút phân trang
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <li key={i} className={pageNumber === i ? "active" : ""}>
          <a onClick={() => setCurrentPage(i)}>{i}</a>
        </li>
      );
    }

    // Thêm nút "Next"
    paginationItems.push(
      <li key="next" className={pageNumber === totalPages ? "disabled" : ""}>
        <a
          onClick={() =>
            pageNumber < totalPages && setCurrentPage(pageNumber + 1)
          }
        >
          &raquo;
        </a>
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
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
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
      Address: address,
      JobCategoryId: jobCategoryId,
      SortNumberApplied: sortNumberApplied,
      pageNumber: currentPage,
      Latitude: userLocation.latitude,
      Longitude: userLocation.longitude,
      distance: distance,
    };

    // In ra nội dung của params
    console.log(params);
  };

  const addwishlist = async (postJobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để lưu công việc.", {
        variant: "warning",
      });
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }

    const data = {
      PostJobId: postJobId,
    };

    try {
      const response = await axios.post(
        "https://localhost:7077/api/WishJobs/AddWishJob",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        enqueueSnackbar("Đã thêm công việc vào mục yêu thích.", {
          variant: "success",
        });
        setSavedJobs((prev) => ({ ...prev, [postJobId]: true }));
      }
    } catch (error) {
      console.error(
        "Lỗi khi thêm vào mục yêu thích:",
        error.response?.data?.Message || error.message
      );
    }
  };

  const handleJobClick = (postId) => {
    navigate("/viewJobDetail/" + postId);
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  const ungtuyen = (postId) => {
    navigate(`/viewJobDetail/${postId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  const handleApplyClick = (postId) => {
    if (!isLoggedIn) {
      enqueueSnackbar("Vui lòng đăng nhập để ứng tuyển.", { variant: "info" });
      navigate("/login");
    } else {
      navigate(`/viewJobDetail/${postId}`);
    }
  };
  return (
    <>
      <Header />

      <section
        className="inner-header-title"
        style={{
          backgroundImage: `url(https://www.bamboohr.com/blog/media_1daae868cd79a86de31a4e676368a22d1d4c2cb22.jpeg?width=750&format=jpeg&optimize=medium)`,
        }}
      >
        <div className="container">
          <h1>Tất Cả Công Việc</h1>
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
                      onChange={(e) =>
                        setJobCategoryId(parseInt(e.target.value))
                      }
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
                      onChange={(e) =>
                        setSalaryTypesId(parseInt(e.target.value))
                      }
                    >
                      <option value="0">Tất cả các loại trả lương</option>
                      <option value="1">Theo giờ</option>
                      <option value="2">Theo ngày</option>            
                      <option value="4">Theo tuần</option>
                      <option value="5">Theo tháng</option>
                      <option value="3">Theo công việc</option>
                      <option value="6">Lương cố định</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="search-item">
                    <select
                      className="form-control search-input"
                      value={sortNumberApplied}
                      onChange={(e) =>
                        setSortNumberApplied(parseInt(e.target.value))
                      }
                    >
                      <option value="0">Xắp xếp theo số người ứng tuyển</option>
                      <option value="1">Ứng tuyển tăng dần</option>
                      <option value="-1">Ứng tuyển giảm dần</option>
                    </select>
                  </div>

                  <div className="search-item">
                    <input
                      type="number"
                      className="form-control search-input"
                      placeholder="Khoảng cách tối đa"
                      value={distance}
                      onChange={(e) => Setdistance(e.target.value)}
                      min="0"
                      step="0.5" // Giới hạn chỉ cho số nguyên
                    />
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
            {notFoundJob ? (
              <div className="not-found-message">
                <p>{notFound}</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  class="item-click"
                  key={job.postId}
                  onClick={() => handleJobClick(job.postId)}
                >
                  <article>
                    <div class="brows-job-list">
                      <div class="col-md-1 col-sm-2 small-padding">
                        <div
                          class="brows-job-company-img"
                          style={{ backgroundColor: "white" }}
                        >
                          <a href="">
                            <img
                              style={{ width: "100px" }}
                              src={job.thumbnail}
                              class="img-responsive"
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-5">
                        <div className="brows-job-position">
                          <a href="">
                            <h3>{job.jobTitle}</h3>
                          </a>
                          <p>
                            <span>{job.jobCategoryName}</span>
                            <span className="brows-job-sallery">
                              <i className="fa fa-money"></i>{" "}
                              {job.salary.toLocaleString("vi-VN")} VND /{" "}
                              {job.salaryTypeName.replace("Theo ", "")}
                            </span>
                          </p>
                          <p>
                            <span>Số người cần tuyển: {job.numberPeople}</span>
                            <span className="brows-job-sallery">
                              Số người đã ứng tuyển: {job.numberOfApplicants}
                            </span>

                            <span className="job-type cl-success bg-trans-success">
                              {isLocationLoading
                                ? "Đang tải vị trí..."
                                : userLocation && job.distance
                                ? `Cách bạn: ${job.distance} km`
                                : "Khoảng cách không khả dụng"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-3">
                        <div class="brows-job-location">
                          <p>
                            <i class="fa fa-map-marker"></i>
                            {job.address}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-2">
                        <div className="brows-job-link">
                          <button
                            className="btn btn-apply"
                            title="Xem Chi Tiết"
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
                              navigate(`/viewJobDetail/${job.postId}`); // Chuyển hướng đến trang chi tiết công việc với ID công việc
                            }}
                          >
                            Xem Chi Tiết
                          </button>

                          <div className="save-button-container">
                            {savedJobs[job.postId] || job.isWishlist === 1 ? (
                              <button
                                className="btn btn-save"
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện onClick của item-click
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  className="icon-spacing"
                                  style={{ color: "red" }}
                                />
                                Đã Lưu
                              </button>
                            ) : (
                              <button
                                className="btn btn-save"
                                onClick={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện onClick của item-click
                                  addwishlist(job.postId);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faHeart}
                                  className="icon-spacing"
                                  style={{ color: "gray" }}
                                />
                                Lưu Tin
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {job.isUrgentRecruitment ? (
                      <span class="tg-themetag tg-featuretag">Premium</span>
                    ) : (
                      ""
                    )}
                  </article>
                </div>
              ))
            )}

            <div
              className="pagination-container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Button
                shape="circle"
                icon={<LeftOutlined />}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              <span style={{ margin: "0 10px", fontSize: "16px" }}>
                {currentPage} / {totalPages} trang
              </span>
              <Button
                shape="circle"
                icon={<RightOutlined />}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default JobListing;
