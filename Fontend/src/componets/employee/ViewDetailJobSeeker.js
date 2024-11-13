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

  const handleContactNow = () => {
    if (jobSeeker) {
      alert(`Contacting ${jobSeeker.fullName}`);
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
        <div className="container white-shadow">
          <div className="row bottom-mrg align-items-center">
            <div className="col-md-4 col-sm-4 text-center">
              {jobSeeker && (
                <img
                  src={jobSeeker.avatarURL || ""}
                  alt={`${jobSeeker.fullName || "Avatar"}'s avatar`}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4 className="designation">Thông Tin Liên Hệ</h4>
                {jobSeeker ? (
                  <ul className="job-seeker-info">
                    <li>
                      <strong>Tên:</strong> {jobSeeker.fullName}
                    </li>
                    <li>
                      <strong>Tuổi:</strong> {jobSeeker.age}
                    </li>
                    <li>
                      <strong>Email:</strong> {jobSeeker.email}
                    </li>
                    <li>
                      <strong>Số điện thoại:</strong> {jobSeeker.phonenumber}
                    </li>
                    <li>
                      <strong>Địa chỉ:</strong> {jobSeeker.address}
                    </li>
                    <li>
                      <strong>Giới tính:</strong>{" "}
                      {jobSeeker.gender === "Male" ? "Nam" : "Nữ"}
                    </li>
                    <li>
                      <strong>Mô tả:</strong> {jobSeeker.description}
                    </li>
                  </ul>
                ) : (
                  <p>Đang tải thông tin ứng viên...</p>
                )}
                {/* Thêm nút "Liên hệ ngay" */}
                {jobSeeker && (
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => handleContactNow()}
                  >
                    Liên hệ ngay
                  </button>
                )}
                {jobSeeker &&
                (saved[jobSeeker.userId] || jobSeeker.isFavorite === 1) ? (
                  <button
                    className="btn btn-save"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="icon-spacing"
                      style={{ color: "red" }}
                    />
                    Đã lưu thông tin
                  </button>
                ) : (
                  jobSeeker && (
                    <button
                      className="btn btn-save"
                      onClick={() => handleAddToFavorites(jobSeeker.userId)}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="icon-spacing"
                        style={{ color: "gray" }}
                      />
                      Lưu thông tin liên hệ
                    </button>
                  )
                )}
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
