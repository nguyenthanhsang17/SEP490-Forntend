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
  const navigate = useNavigate();
  const { id } = useParams();
  const [employer, setEmployer] = useState(null);
  const [saved, setSaved] = useState({});

  // Fetch dữ liệu chi tiết nhà tuyển dụng từ API và cập nhật trạng thái "saved" dựa trên isFavorite
  const fetchEmployerDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7077/api/Employers/GetEmployerDetail/${id}`,
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
          employerId: data.employerId,
          email: data.email,
          logoURL: data.logoURL,
          companyName: data.companyName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          industry: data.industry,
          description: data.description,
          website: data.website,
          isFavorite: data.isFavorite,
        };
        setEmployer(filteredData);

        // Cập nhật trạng thái "saved" nếu nhà tuyển dụng đã được đánh dấu là yêu thích
        if (data.isFavorite === 1) {
          setSaved((prevSaved) => ({
            ...prevSaved,
            [data.employerId]: true,
          }));
        }
      } else if (response.status === 401) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to fetch employer details:", error);
    }
  };

  useEffect(() => {
    fetchEmployerDetails();
  }, [id, navigate]);

  const handleAddToFavorites = async (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Lưu thông tin nhà tuyển dụng",
      input: "text",
      inputLabel: "Nhập mô tả",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      showLoaderOnConfirm: true,
      preConfirm: async (description) => {
        try {
          const payload = {
            employerId: id,
            description: description,
          };
          await axios.post(
            "https://localhost:7077/api/FavoriteLists/AddFavoriteEmployer",
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire(
            "Thành công",
            "Nhà tuyển dụng đã được lưu vào danh sách yêu thích",
            "success"
          );

          // Cập nhật trạng thái đã lưu thành công
          setSaved((prevSaved) => ({
            ...prevSaved,
            [id]: true,
          }));
        } catch (error) {
          Swal.showValidationMessage(`Không thể lưu nhà tuyển dụng: ${error}`);
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
          <h1>Thông Tin Nhà Tuyển Dụng</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="detail-desc">
        <div className="container white-shadow">
          <div className="row bottom-mrg align-items-center">
            <div className="col-md-4 col-sm-4 text-center">
              {employer && (
                <img
                  src={employer.logoURL || ""}
                  alt={`${employer.companyName || "Logo"}'s logo`}
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "10%",
                  }}
                />
              )}
            </div>
            <div className="col-md-8 col-sm-8">
              <div className="detail-desc-caption">
                <h4 className="designation">Thông Tin Liên Hệ</h4>
                {employer ? (
                  <ul className="employer-info">
                    <li>
                      <strong>Tên Công Ty:</strong> {employer.companyName}
                    </li>
                    <li>
                      <strong>Email:</strong> {employer.email}
                    </li>
                    <li>
                      <strong>Số điện thoại:</strong> {employer.phoneNumber}
                    </li>
                    <li>
                      <strong>Địa chỉ:</strong> {employer.address}
                    </li>
                    <li>
                      <strong>Ngành nghề:</strong> {employer.industry}
                    </li>
                    <li>
                      <strong>Website:</strong>{" "}
                      <a href={employer.website} target="_blank" rel="noopener noreferrer">
                        {employer.website}
                      </a>
                    </li>
                    <li>
                      <strong>Mô tả:</strong> {employer.description}
                    </li>
                  </ul>
                ) : (
                  <p>Đang tải thông tin nhà tuyển dụng...</p>
                )}
                {employer &&
                (saved[employer.employerId] || employer.isFavorite === 1) ? (
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
                  employer && (
                    <button
                      className="btn btn-save"
                      onClick={() => handleAddToFavorites(employer.employerId)}
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="icon-spacing"
                        style={{ color: "gray" }}
                      />
                      Lưu thông tin nhà tuyển dụng
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ViewEmployerProfile;