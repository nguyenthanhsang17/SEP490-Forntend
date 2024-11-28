import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from "../assets/img/banner-10.jpg";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Thêm FontAwesome
import { faHeart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "notistack";

import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const ViewEmployerProfile = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [savedJobs, setSavedJobs] = useState({});
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();

  const fetchAuthorProfile = async (pageNumber = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!authorId) {
      console.error("Author ID không hợp lệ");
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7077/api/Employer/ViewEmployerProfile?Authorid=${authorId}&pagnumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Response:", response.data);

      setAuthorData(response.data);
      setCurrentPage(pageNumber); // Cập nhật trang hiện tại
      setTotalPages(response.data.postJobAuthors.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch author profile:", error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Khoảng cách (km)
    return distance.toFixed(2); // Làm tròn 2 chữ số thập phân
  };

  useEffect(() => {
    if (!authorData?.latitude || !authorData?.longitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setAuthorData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
      });
    }
  }, [authorData]);

  useEffect(() => {
    fetchAuthorProfile();
  }, [authorId]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchAuthorProfile(newPage); // Gọi lại API với trang mới
      setCurrentPage(newPage);     // Cập nhật trang hiện tại
    }
  };

  const salaryTypeMap = {
    "Theo giờ": "giờ",
    "Theo ngày": "ngày",
    "Theo công việc": "công việc",
    "Theo tuần": "tuần",
    "Theo tháng": "tháng",
    "Lương cố định": "cố định",
};

  const addwishlist = async (postJobId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("Vui lòng đăng nhập để lưu công việc.", {
        variant: "warning",
      });
      navigate("/login");
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

        // Gọi lại API để load lại danh sách công việc
        fetchAuthorProfile(currentPage);
      }
    } catch (error) {
      console.error(
        "Lỗi khi thêm vào mục yêu thích:",
        error.response?.data?.Message || error.message
      );
    }
  };

  return (
    <>
      <Header />
      <div className="clearfix"></div>

      <section
        className="inner-header-title"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="container">
          <h1>Thông Tin Nhà Tuyển Dụng</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row bottom-mrg align-items-center">
            <div className="col-md-4 col-sm-4 text-center">
              {authorData && (
                <img
                  src={authorData.avatarURL || "https://via.placeholder.com/150"}
                  alt={`${authorData.fullName || "Avatar"}'s avatar`}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ccc",
                  }}
                />
              )}
            </div>
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                {/* <h4 className="designation">Thông Tin Nhà Tuyển Dụng</h4> */}
                {authorData ? (
                  <ul className="job-seeker-info">
                    <li>
                      <strong>Tên:</strong> {authorData.fullName}
                    </li>
                    <li>
                      <strong>Tuổi:</strong> {authorData.age}
                    </li>
                    <li>
                      <strong>Giới tính:</strong>{" "}
                      {authorData.gender ? "Nam" : "Nữ"}
                    </li>
                    <li>
                      <strong>Địa chỉ:</strong> {authorData.address}
                    </li>
                    <li>
                      <strong>Mô tả:</strong> {authorData.description}
                    </li>
                  </ul>
                ) : (
                  <p>Đang tải thông tin nhà tuyển dụng...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">Tuyển dụng</h2>
            {authorData && authorData.postJobAuthors?.items?.length > 0 ? (
              authorData.postJobAuthors.items.map((job) => (
                <div
                  key={job.postId}
                  className="item-click job-post-detail"
                  onClick={() => navigate(`/viewJobDetail/${job.postId}`)}
                >
                  <article>
                    <div className="brows-job-list">
                      <div className="col-md-1 col-sm-2 small-padding">
                        <div
                          className="brows-job-company-img"
                          style={{ backgroundColor: "white" }}
                        >
                          <a href="">
                            <img
                              style={{ width: "100px" }}
                              src={job.thumbnail || "https://via.placeholder.com/100"}
                              className="img-responsive"
                              alt={job.jobTitle}
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
                              {job.salary.toLocaleString()} VND /{salaryTypeMap[job.salaryTypeName]}
                            </span>
                          </p>
                          <p>
                            <span>Số người cần tuyển: {job.numberPeople}</span>
                            <span className="brows-job-sallery">
                              Số người đã ứng tuyển: {job.numberOfApplicants}
                            </span>
                            <span className="job-type cl-success bg-trans-success">
                              {authorData.latitude && authorData.longitude && job.latitude && job.longitude
                                ? `Cách bạn: ${calculateDistance(
                                  authorData.latitude,
                                  authorData.longitude,
                                  job.latitude,
                                  job.longitude
                                )} km`
                                : "Khoảng cách không khả dụng"}
                            </span>

                          </p>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3">
                        <div className="brows-job-location">
                          <p>
                            <i className="fa fa-map-marker"></i> {job.address}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-2">
                        <div className="brows-job-link">
                          <button
                            className="btn btn-apply"
                            title="Xem Chi Tiết"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/viewJobDetail/${job.postId}`);
                            }}
                          >
                            Xem Chi Tiết
                          </button>

                          <div className="save-button-container">
                            {job.isWishlist === 1 ? (
                              <button
                                className="btn btn-save"
                                onClick={(e) => e.stopPropagation()}
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
                                  e.stopPropagation();
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
                    {job.isUrgentRecruitment && (
                      <span className="tg-themetag tg-featuretag">Premium</span>
                    )}
                  </article>
                </div>
              ))
            ) : (
              <p>Không có công việc nào được đăng tuyển.</p>
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

export default ViewEmployerProfile;