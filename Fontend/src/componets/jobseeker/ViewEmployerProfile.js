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

const ViewEmployerProfile = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const navigate = useNavigate();

  const fetchAuthorProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7077/api/Employer/ViewEmployerProfile/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAuthorData(response.data);
    } catch (error) {
      console.error("Failed to fetch author profile:", error);
    }
  };

  useEffect(() => {
    fetchAuthorProfile();
  }, [authorId]);
  return (
    <>
      <Header />
      <div>
      <h1>Thông Tin Tác Giả</h1>
      {authorData ? (
        <div>
          <div>
            <h2>Thông Tin Cá Nhân</h2>
            <p><strong>Họ Tên:</strong> {authorData.fullName}</p>
            <p><strong>Tuổi:</strong> {authorData.age}</p>
            <p><strong>Giới Tính:</strong> {authorData.gender ? "Nam" : "Nữ"}</p>
            <p><strong>Địa Chỉ:</strong> {authorData.address}</p>
            <p><strong>Mô Tả:</strong> {authorData.description}</p>
          </div>

          <div>
            <h2>Bài Đăng Công Việc</h2>
            {authorData.postJobAuthors && authorData.postJobAuthors.length > 0 ? (
              <ul>
                {authorData.postJobAuthors.map((job) => (
                  <li key={job.postId}>
                    <h3>{job.jobTitle}</h3>
                    <img
                      src={job.thumbnail || "https://via.placeholder.com/150"}
                      alt={job.jobTitle}
                      style={{ width: "150px", height: "100px", objectFit: "cover" }}
                    />
                    <p><strong>Địa Chỉ:</strong> {job.address}</p>
                    <p><strong>Lương:</strong> {job.salary} VND ({job.salaryTypeName})</p>
                    <p><strong>Ngành Nghề:</strong> {job.jobCategoryName}</p>
                    <p>
                      <strong>Số Ứng Viên:</strong> {job.numberOfApplicants}
                    </p>
                    <p>
                      <strong>Hạn Nộp Hồ Sơ:</strong>{" "}
                      {job.expirationDate ? new Date(job.expirationDate).toLocaleDateString() : "Không có"}
                    </p>
                    <p>
                      <strong>Trạng Thái:</strong>{" "}
                      {job.isWishlist ? "Đã lưu vào danh sách yêu thích" : "Chưa lưu"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có bài đăng công việc nào.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>

      <Footer />
    </>
  );
};

export default ViewEmployerProfile;