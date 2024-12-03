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

const ViewRecommendedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(0);
  const [notFound, setNotFound] = useState("");
  const [notFoundJob, setNotFoundJob] = useState(false);
  const [savedJobs, setSavedJobs] = useState({});
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      enqueueSnackbar("Vui lòng đăng nhập để xem công việc được đề xuất.", {
        variant: "warning",
      });
      navigate("/login");
    }
  }, [isLoggedIn, enqueueSnackbar, navigate]);

  // Get user location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        setIsLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsLocationLoading(false);
          },
          () => {
            setUserLocation(null);
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

  // Fetch jobs based on page number and user location
  useEffect(() => {
    const fetchJobs = async () => {
      if (isLocationLoading) return; // Chờ hoàn thành lấy vị trí

      const token = localStorage.getItem("token");
      setLoading(true);

      try {
        const params = {
          // pagenumber: currentPage,
          userLatitude: userLocation?.latitude || null,
          userLongitude: userLocation?.longitude || null,
        };

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await axios.get(
          "https://localhost:7077/api/PostJobs/ViewRecommendedJobs",
          { headers, params }
        );

        if (response.status === 200 && response.data.items) {
          setJobs(response.data.items);
          // setTotalPages(response.data.totalPages || 0);
          setNotFoundJob(false);
        } else {
          setJobs([]);
          setNotFound("Không tìm thấy công việc phù hợp");
          setNotFoundJob(true);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [ userLocation, isLocationLoading]);

  const salaryTypeMap = {
    "Theo giờ": "giờ",
    "Theo ngày": "ngày",
    "Theo công việc": "công việc",
    "Theo tuần": "tuần",
    "Theo tháng": "tháng",
    "Lương cố định": "cố định",
  };


  // const handlePageChange = (newPage) => {
  //   if (newPage > 0 && newPage <= totalPages) {
  //     setCurrentPage(newPage);
  //   }
  // };

  const addWishlist = async (postJobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để lưu công việc.", {
        variant: "warning",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7077/api/WishJobs/AddWishJob",
        { PostJobId: postJobId },
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
      console.error("Error adding wishlist:", error);
    }
  };

  const handleJobClick = (postId) => {
    navigate(`/viewJobDetail/${postId}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Bán kính Trái đất (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Khoảng cách (km)
    return distance.toFixed(2); // Làm tròn 2 chữ số thập phân
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
          <h1>Top 10 công việc được đề xuất</h1>
        </div>
      </section>

      <section class="brows-job-category">
        <div class="container">
          <div class="row extra-mrg">
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
                              {job.salary.toLocaleString("vi-VN") + " VND"} / {salaryTypeMap[job.salaryTypeName]}
                            </span>
                          </p>
                          <p>
                            <span>Số người cần tuyển: {job.numberPeople}</span>
                            <span className="brows-job-sallery">
                              Số người đã ứng tuyển: {job.numberOfApplicants}
                            </span>

                            {/* Display distance if userLocation and job.distance are available */}
                            <span className="job-type cl-success bg-trans-success">
                              {isLocationLoading
                                ? "Đang tải vị trí..."
                                : userLocation && job.latitude && job.longitude
                                  ? `Cách bạn: ${calculateDistance(
                                    userLocation.latitude,
                                    userLocation.longitude,
                                    job.latitude,
                                    job.longitude
                                  )} km`
                                  : "Khoảng cách không khả dụng"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div class="col-md-3 col-sm-3">
                        <div class="brows-job-location">
                          <p title={job.address}>
                            <i className="fa fa-map-marker"></i>
                            {job.address.length > 30
                              ? `${job.address.slice(0, 30)}...`
                              : job.address}
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
                                  addWishlist(job.postId);
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
                      <span class="tg-themetag tg-featuretag">HOT</span>
                    ) : (
                      ""
                    )}
                  </article>
                </div>
              ))
            )}

            {/* <div
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
            </div> */}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ViewRecommendedJobs;
