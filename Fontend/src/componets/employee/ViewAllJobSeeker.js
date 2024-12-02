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
  const [sort, setSort] = useState(1); // Giá trị mặc định của sort là 1
  const [currentJob, setCurrentJob] = useState(0);
  const [numberPage, setNumberPage] = useState(1);
  const [agemin, setAgemin] = useState("");
  const [agemax, setAgemax] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(-1); // -1 for all genders, 0 for female, 1 for male
  const [saved, setSaved] = useState({});
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang

  const showAlert2 = async (text) => {
    const result = await Swal.fire({
      title: text,
      showCancelButton: false,
      confirmButtonText: "Ok",
    });

    if (result.isConfirmed) {
      navigate("/viewAllPriceList");
    }
  };

  // Fetch data from API based on filters
  const fetchCandidates = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      console.log("Search Parameters:", {
        keyword,
        sort,
        currentJob,
        numberPage,
        agemin,
        agemax,
        address,
        gender,
      });
      const response = await axios.get(
        "https://localhost:7077/api/JobJobSeeker/GetAllJobSeeker",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            keyword,
            sort, // Giá trị sort mặc định là 1
            CurrentJob: currentJob,
            numberPage,
            agemin,
            agemax,
            address,
            gender,
          },
        }
      );

      if (response.data.message === "Bạn không dc phép truy cập hãy mua gói") {
        showAlert2("Bạn không dc phép truy cập hãy mua gói");
        return;
      }
      if (response.status === 200) {
        setCandidates(response.data.items || []);
        setTotalPages(response.data.totalPages || 1); // Gán tổng số trang từ API
      }
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

  useEffect(() => {
    fetchCandidates(); // Gọi API lần đầu với giá trị mặc định
  }, []); // Chỉ gọi một lần khi component được render

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

  const sendFirstTimeMessage = async (idto) => {
    try {
      const token = localStorage.getItem("token");
      const apiEndpoint = `https://localhost:7077/api/Chat/SendFisrtTime/${idto}`;
      const response = await axios.post(apiEndpoint, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire("Success", "Message sent successfully!", "success");
        window.open("/ChatList", "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
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
          <h1>Tất Cả Ứng Viên</h1>
        </div>
      </section>

      <section className="member-card gray">
        <div className="container">
          <div className="search-container">
            <div className="search-filter">
              <input
                type="text"
                className="form-control"
                placeholder="Từ khóa ứng viên..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <select
                className="form-control"
                onChange={(e) => setGender(parseInt(e.target.value))}
              >
                <option value="-1">Giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Tuổi tối thiểu"
                value={agemin}
                onChange={(e) => setAgemin(e.target.value)}
              />
              <input
                type="number"
                className="form-control"
                placeholder="Tuổi tối đa"
                value={agemax}
                onChange={(e) => setAgemax(e.target.value)}
              />
              <select
                className="form-control"
                onChange={(e) => setCurrentJob(parseInt(e.target.value))}
              >
                <option value="0">Công việc hiện tại</option>
                <option value="1">Thất nghiệp</option>
                <option value="2">Đang đi học</option>
                <option value="3">Đang đi làm</option>
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="Địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {/* <select
                className="form-control"
                onChange={(e) => setSort(parseInt(e.target.value))}
              >
                <option value="0">Sắp xếp</option>
                <option value="1">Nhiều lượt ứng tuyển nhất</option>
                <option value="2">Ít lượt ứng tuyển nhất</option>
              </select> */}
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
                  <div
                    key={candidate.userId}
                    className="col-md-12 mb-4"
                    onClick={() => handleViewDetail(candidate.userId)} // Sự kiện áp dụng cho cả thẻ
                  >
                    <div className="candidate-card shadow-effect d-flex align-items-center p-3">
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
                          }}
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
                          <strong>Tuổi:</strong> {candidate.age}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          <strong>Số Điện Thoại:</strong>{" "}
                          {candidate.phonenumber}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          <strong>Địa Chỉ:</strong> {candidate.address}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          <strong>Công Việc Hiện Tại:</strong>{" "}
                          {candidate.currentJob}
                        </p>
                        <p
                          style={{
                            color: "#666",
                            margin: "0",
                            fontSize: "14px",
                          }}
                        >
                          <strong>Giới Tính:</strong>{" "}
                          {candidate.gender ? "Nam" : "Nữ"}
                        </p>
                      </div>
                      <div
                        className="candidate-actions d-flex flex-column align-items-center"
                        style={{
                          display: "flex",
                          flexDirection: "column", // Sắp xếp theo cột
                          alignItems: "center", // Căn giữa theo chiều ngang
                          gap: "10px", // Khoảng cách giữa các nút
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            width: "200px", // Chiều rộng cố định
                            height: "40px", // Chiều cao cố định
                            display: "inline-flex", // Để căn giữa nội dung
                            alignItems: "center", // Căn giữa theo chiều dọc
                            justifyContent: "center", // Căn giữa theo chiều ngang
                            fontSize: "14px", // Cỡ chữ
                            borderRadius: "5px", // Bo tròn góc
                            border: "1px solid #ddd", // Viền
                            padding: "0", // Bỏ padding mặc định
                            backgroundColor: "#28a745", // Màu nền xanh
                            color: "white", // Màu chữ trắng
                          }}
                          onClick={() => {
                            sendFirstTimeMessage(candidate.userId);
                          }}
                        >
                          Liên Hệ Ngay
                        </button>
                        {saved[candidate.userId] ||
                        candidate.isFavorite === 1 ? (
                          <button
                            className="btn btn-save"
                            style={{
                              width: "200px", // Chiều rộng cố định
                              height: "40px", // Chiều cao cố định
                              display: "inline-flex", // Để căn giữa nội dung
                              alignItems: "center", // Căn giữa theo chiều dọc
                              justifyContent: "center", // Căn giữa theo chiều ngang
                              fontSize: "14px", // Cỡ chữ
                              borderRadius: "5px", // Bo tròn góc
                              border: "1px solid #ddd", // Viền
                              padding: "0", // Bỏ padding mặc định
                              backgroundColor: "white", // Màu nền trắng
                              color: "#666", // Màu chữ xám
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="icon-spacing"
                              style={{ color: "red", marginRight: "5px" }} // Cách icon với chữ
                            />
                            Đã lưu thông tin
                          </button>
                        ) : (
                          <button
                            className="btn btn-save"
                            style={{
                              width: "200px", // Chiều rộng cố định
                              height: "40px", // Chiều cao cố định
                              display: "inline-flex", // Để căn giữa nội dung
                              alignItems: "center", // Căn giữa theo chiều dọc
                              justifyContent: "center", // Căn giữa theo chiều ngang
                              fontSize: "14px", // Cỡ chữ
                              borderRadius: "5px", // Bo tròn góc
                              border: "1px solid #ddd", // Viền
                              padding: "0", // Bỏ padding mặc định
                              backgroundColor: "white", // Màu nền trắng
                              color: "#666", // Màu chữ xám
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToFavorites(candidate.userId);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="icon-spacing"
                              style={{ color: "gray", marginRight: "5px" }} // Cách icon với chữ
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
