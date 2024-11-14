import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import "../assets/css/colors/green-style.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MemberCard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for filter inputs
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState(0);
  const [currentJob, setCurrentJob] = useState(0);
  const [numberPage, setNumberPage] = useState(1);
  const [agemin, setAgemin] = useState("");
  const [agemax, setAgemax] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(-1); // -1 for all genders, 0 for female, 1 for male
  const [saved, setSaved] = useState({});
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  // Fetch data from API based on filters
  const fetchCandidates = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "https://localhost:7077/api/JobJobSeeker/GetAllJobSeeker",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            keyword,
            sort,
            CurrentJob: currentJob,
            numberPage,
            agemin,
            agemax,
            address,
            gender,
          },
        }
      );

      setCandidates(response.data.items || []);
      setTotalPages(response.data.totalPages || 1); // Gán tổng số trang từ API
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setNumberPage(newPage);
    }
  };
  useEffect(() => {
    fetchCandidates();
  }, [numberPage]); // Gọi lại API khi số trang thay đổi

  // Navigate to candidate detail page
  const handleViewDetail = (id) => {
    navigate(`/viewDetailJobSeeker/${id}`);
  };

  const handleAddToFavorites = async (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Lưu thông tin liên hệ",
      input: "text",
      inputLabel: "Nhập mô tả",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      showLoaderOnConfirm: true,
      preConfirm: async (description) => {
        try {
          const payload = {
            jobSeekerId: id,
            description: description,
          };
          await axios.post(
            "https://localhost:7077/api/FavoriteLists/AddFavorite",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire(
            "Thành công",
            "Ứng viên đã được lưu vào danh sách yêu thích",
            "success"
          );

          // Reload data after successful save
          fetchCandidates();
        } catch (error) {
          Swal.showValidationMessage(`Không thể lưu ứng viên: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  useEffect(() => {
    const initialSaved = {};
    candidates.forEach((candidates) => {
      if (candidates.isFavorite === 1) {
        initialSaved[candidates.userId] = true;
      }
    });
    setSaved(initialSaved);
  }, [candidates]);

  useEffect(() => {
    fetchCandidates();
  }, []);

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
          <h1>Tất Cả Ứng Viên</h1>
        </div>
      </section>

      <section className="member-card gray">
        <div className="container">
          <div className="search-filter row">
            <div className="col-md-3 col-sm-6">
              <input
                type="text"
                className="form-control"
                placeholder="Từ khóa"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <select
                className="form-control"
                onChange={(e) => setGender(parseInt(e.target.value))}
              >
                <option value="-1">Giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6">
              <input
                type="number"
                className="form-control"
                placeholder="Tuổi tối thiểu"
                value={agemin}
                onChange={(e) => setAgemin(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <input
                type="number"
                className="form-control"
                placeholder="Tuổi tối đa"
                value={agemax}
                onChange={(e) => setAgemax(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select
                className="form-control"
                onChange={(e) => setCurrentJob(parseInt(e.target.value))}
              >
                <option value="0">Công việc hiện tại</option>
                <option value="1">Thất nghiệp</option>
                <option value="2">Đang đi học</option>
                <option value="3">Đang đi làm</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <select
                className="form-control"
                onChange={(e) => setSort(parseInt(e.target.value))}
              >
                <option value="0">Sắp xếp</option>
                <option value="1">Nhiều lượt ứng tuyển nhất</option>
                <option value="2">Ít lượt ứng tuyển nhất</option>
              </select>
            </div>
            <div className="col-md-3 col-sm-6 mt-3">
              <button
                type="button"
                className="btn btn-success"
                onClick={fetchCandidates}
              >
                Tìm kiếm
              </button>
            </div>
          </div>

          {loading ? (
            <p>Đang tải ứng viên...</p>
          ) : (
            <div className="row mt-4">
              {candidates.length > 0 ? (
                candidates.map((candidate) => (
                  <div key={candidate.userId} className="col-md-12 mb-4">
                    <div className="candidate-card d-flex align-items-center p-3">
                      <div
                        className="candidate-image"
                        style={{ marginRight: "20px" }}
                      >
                        <img
                          src={
                            candidate.avatarURL ||
                            "https://via.placeholder.com/100"
                          }
                          alt="Avatar"
                          style={{
                            width: "100px",
                            height: "100px",
                            borderRadius: "8px",
                          }} // Increased size
                        />
                      </div>
                      <div className="candidate-info" style={{ flex: 1 }}>
                        <h5
                          className="mb-1"
                          style={{ fontWeight: "bold", color: "#333" }}
                        >
                          {candidate.fullName}
                        </h5>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          Tuổi: {candidate.age}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          Số Điện Thoại: {candidate.phonenumber}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          Địa Chỉ: {candidate.address}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          Công Việc Hiện Tại: {candidate.currentJob}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          Giới Tính: {candidate.gender ? "Nam" : "Nữ"}
                        </p>
                      </div>
                      <div className="candidate-actions d-flex flex-column align-items-end">
                        {" "}
                        {/* Align buttons to the right */}
                        <button
                          className="btn btn-primary mb-2"
                          onClick={() => handleViewDetail(candidate.userId)}
                        >
                          Liên Hệ Ngay
                        </button>
                        {/* <button
                          className="btn btn-secondary"
                          onClick={() => handleAddToFavorites(candidate.userId)}
                        >
                          Lưu thông tin liên hệ
                        </button> */}
                        {saved[candidate.userId] ||
                        candidate.isFavorite === 1 ? (
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
                            Đã lưu thông tin
                          </button>
                        ) : (
                          <button
                            className="btn btn-save"
                            onClick={() =>
                              handleAddToFavorites(candidate.userId)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="icon-spacing"
                              style={{ color: "gray" }}
                            />
                            Lưu thông tin liên hệ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">Không có ứng viên nào</p>
              )}
            </div>
          )}
        </div>
      </section>
      <div
        className="pagination-container mt-4 d-flex justify-content-center align-items-center"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button
          className="btn btn-light"
          disabled={numberPage === 1}
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: "0",
          }}
          onClick={() => handlePageChange(numberPage - 1)}
        >
          &lt;
        </button>
        <span style={{ margin: "0 10px", fontSize: "16px" }}>
          {numberPage} / {totalPages} trang
        </span>
        <button
          className="btn btn-light"
          disabled={numberPage === totalPages}
          style={{
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            padding: "0",
          }}
          onClick={() => handlePageChange(numberPage + 1)}
        >
          &gt;
        </button>
      </div>

      <Footer />
    </>
  );
};

export default MemberCard;
