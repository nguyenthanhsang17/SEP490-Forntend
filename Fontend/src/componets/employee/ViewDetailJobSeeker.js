import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from "../assets/img/banner-10.jpg";
import Footer from "../common/Footer";
import Header from "../common/Header";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const ViewJobDetailJobSeeker = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobSeeker, setJobSeeker] = useState(null);
  const [saved, setSaved] = useState({});

  // Fetch dữ liệu chi tiết ứng viên từ API và cập nhật trạng thái "saved" dựa trên isFavorite
  const fetchJobSeekerDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7077/api/JobJobSeeker/GetJobSeekerDetail/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const filteredData = {
          userId: data.userId,
          email: data.email,
          avatarURL: data.avatarURL,
          fullName: data.fullName,
          age: data.age,
          phonenumber: data.phonenumber,
          currentJob: data.currentJob,
          description: data.description,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          numberAppiled: data.numberAppiled,
          numberAppiledAccept: data.numberAppiledAccept,
          isFavorite: data.isFavorite,
          cvDTOs: data.cvDTOs.map((cv) => ({
            cvId: cv.cvId,
            userId: cv.userId,
            nameCv: cv.nameCv,
            itemOfCvs: cv.itemOfCvs.map((item) => ({
              itemOfCvId: item.itemOfCvId,
              cvId: item.cvId,
              itemName: item.itemName,
              itemDescription: item.itemDescription,
            })),
          })),
        };
        setJobSeeker(filteredData);

        // Cập nhật trạng thái "saved" nếu ứng viên đã được đánh dấu là yêu thích
        if (data.isFavorite === 1) {
          setSaved((prevSaved) => ({
            ...prevSaved,
            [data.userId]: true,
          }));
        }
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to fetch job seeker details:", error);
    }
  };

  useEffect(() => {
    fetchJobSeekerDetails();
  }, [id, navigate]);

  const handleContactNow = async () => {
    if (jobSeeker) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire(
            "Error",
            "You must be logged in to contact candidates.",
            "error"
          );
          return;
        }

        // API endpoint to send the first message
        const apiEndpoint = `https://localhost:7077/api/Chat/SendFisrtTime/${jobSeeker.userId}`;

        // API call
        const response = await axios.post(apiEndpoint, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Swal.fire(
            "Success",
            "Your message was successfully sent. Redirecting to the chat list...",
            "success"
          ).then(() => {
            window.open("/ChatList", "_blank");
          });
        }
      } catch (error) {
        if (error.response) {
          Swal.fire(
            "Error",
            error.response.data.message || "Failed to send the message.",
            "error"
          );
        } else {
          Swal.fire("Error", "An unexpected error occurred.", "error");
        }
      }
    }
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

          // Cập nhật trạng thái đã lưu thành công
          setSaved((prevSaved) => ({
            ...prevSaved,
            [id]: true,
          }));
        } catch (error) {
          Swal.showValidationMessage(`Không thể lưu ứng viên: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
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
          <h1>Thông Tin Ứng Viên</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="detail-desc">
        <div
          className="container white-shadow"
          style={{
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="row align-items-center">
            {/* Phần hình ảnh */}
            <div className="col-md-4 col-sm-4 text-center">
              {jobSeeker && (
                <img
                  src={jobSeeker.avatarURL || ""}
                  alt={`${jobSeeker.fullName || "Avatar"}'s avatar`}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "2px solid #28a745",
                  }}
                />
              )}
            </div>
            {/* Phần thông tin */}
            <div className="col-md-8 col-sm-8">
              <div
                className="detail-desc-content"
                style={{
                  padding: "10px 15px",
                  fontSize: "14px",
                  color: "#555",
                }}
              >
                <h4
                  className="designation"
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#333",
                    marginBottom: "15px",
                  }}
                >
                  Thông Tin Liên Hệ
                </h4>
                {jobSeeker ? (
                  <div
                    className="info-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "15px",
                    }}
                  >
                    {/* Cột bên trái */}
                    {/* Cột bên trái */}
                    <div className="info-left">
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Tên:</strong>{" "}
                        {jobSeeker.fullName}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Tuổi:</strong>{" "}
                        {jobSeeker.age}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Email:</strong>{" "}
                        {jobSeeker.email}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>
                          Số điện thoại:
                        </strong>{" "}
                        {jobSeeker.phonenumber}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>
                          Số Lượt Ứng Tuyển:
                        </strong>{" "}
                        {jobSeeker.numberAppiled ?? 0}
                      </p>
                    </div>
                    {/* Cột bên phải */}
                    <div className="info-right">
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Địa chỉ:</strong>{" "}
                        {jobSeeker.address}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Giới tính:</strong>{" "}
                        {jobSeeker.gender === "Male" ? "Nam" : "Nữ"}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>Mô tả:</strong>{" "}
                        {jobSeeker.description}
                      </p>
                      <p style={{ margin: "0" }}>
                        <strong style={{ color: "#333" }}>
                          Số Lượt Chấp Nhận:
                        </strong>{" "}
                        {jobSeeker.numberAppiledAccept ?? 0}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p>Đang tải thông tin ứng viên...</p>
                )}
                {/* Nút hành động */}
                <div
                  className="action-buttons mt-3"
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    justifyContent: "flex-start",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "150px",
                      height: "40px",
                      borderRadius: "5px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleContactNow()}
                  >
                    Liên hệ ngay
                  </button>
                  {jobSeeker &&
                  (saved[jobSeeker.userId] || jobSeeker.isFavorite === 1) ? (
                    <button
                      className="btn btn-save"
                      style={{
                        width: "200px",
                        height: "40px",
                        borderRadius: "5px",
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        border: "1px solid #ccc",
                        fontWeight: "bold",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="icon-spacing"
                        style={{ color: "red", marginRight: "5px" }}
                      />
                      Đã lưu thông tin
                    </button>
                  ) : (
                    <button
                      className="btn btn-save"
                      style={{
                        width: "250px",
                        height: "40px",
                        borderRadius: "5px",
                        backgroundColor: "#f5f5f5",
                        color: "#333",
                        border: "1px solid #ccc",
                        fontWeight: "bold",
                      }}
                      onClick={() => handleAddToFavorites(jobSeeker.userId)}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="icon-spacing"
                        style={{ color: "gray", marginRight: "5px" }}
                      />
                      Lưu thông tin liên hệ
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail">
        <div className="container">
          <div className="row row-bottom">
            <h2 className="detail-title">CV Ứng Viên</h2>
            {jobSeeker && jobSeeker.cvDTOs.length > 0 ? (
              jobSeeker.cvDTOs.map((cv) => (
                <div key={cv.cvId}>
                  <h4>{cv.nameCv}</h4>
                  <ul>
                    {cv.itemOfCvs.map((item) => (
                      <li key={item.itemOfCvId}>
                        <strong>{item.itemName}:</strong> {item.itemDescription}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p>Không có CV nào được tìm thấy.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ViewJobDetailJobSeeker;
