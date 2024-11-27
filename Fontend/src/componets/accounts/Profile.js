import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack"; // Import useSnackbar
import Footer from "../common/Footer";
import Header from "../common/Header";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateProfile, setIsUpdateProfile] = useState(false);
  const navigate = useNavigate();
  const [img, setimg] = useState("");
  const [file, setFile] = useState(null);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const { enqueueSnackbar } = useSnackbar(); // Initialize notistack
  const [serviceInfo, setServiceInfo] = useState(null); // Thêm state để lưu thông tin dịch vụ
  useEffect(() => {
    const fetchServiceInfo = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("https://localhost:7077/api/Service", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServiceInfo(response.data); // Lưu dữ liệu dịch vụ vào state
      } catch (err) {
        enqueueSnackbar("Không thể tải thông tin dịch vụ", {
          variant: "error",
        });
      }
    };

    fetchServiceInfo();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "https://localhost:7077/api/Users/Detail",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(response.data);
        setUpdatedProfile(response.data);
        setLoading(false);
        setimg(response.data.avatarURL);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          enqueueSnackbar(err.message, { variant: "error" }); // Show error notification
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate, enqueueSnackbar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  const validateFields = () => {
    const {
      fullName,
      age,
      phonenumber,
      address,
      description,
      gender,
      currentJob,
    } = updatedProfile;
    if (!fullName || !age || !phonenumber || !address || !description) {
      enqueueSnackbar("Vui lòng điền tất cả các trường bắt buộc.", {
        variant: "error",
      });
      return false;
    }

    if (gender == "" || gender == null) {
      enqueueSnackbar("Vui lòng chọn giới tính", {
        variant: "error",
      });
      return false;
    }

    if (currentJob == 0 || currentJob == null) {
      enqueueSnackbar("Vui lòng chọn tình trạng hiện tại", {
        variant: "error",
      });
      return false;
    }

    const phoneRegex = /^0\d{9}$/; // Example: 10-digit phone number
    if (!phoneRegex.test(phonenumber)) {
      enqueueSnackbar("Số điện thoại không hợp lệ. Vui lòng nhập lại.", {
        variant: "error",
      });
      return false;
    }

    if (age < 18 || age > 120) {
      enqueueSnackbar("Tuổi không hợp lệ. Vui lòng nhập lại.", {
        variant: "error",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    console.log(updatedProfile);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    // Add fields to FormData
    formData.append("FullName", updatedProfile.fullName);
    formData.append("Age", updatedProfile.age);
    formData.append("Phonenumber", updatedProfile.phonenumber);
    formData.append("address", updatedProfile.address);
    formData.append("gender", updatedProfile.gender);
    formData.append("currentJob", updatedProfile.currentJob);
    formData.append("description", updatedProfile.description);

    console.log(updatedProfile);
    // Add file if exists
    if (file) {
      formData.append("AvatarURL", file);
    }

    try {
      await axios.put(
        "https://localhost:7077/api/Users/UpdateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      enqueueSnackbar("Cập nhật hồ sơ thành công!", { variant: "success" }); // Show success notification
      setProfile(updatedProfile);
      localStorage.setItem("fullName", updatedProfile.fullName); // Update fullName in localStorage
      setIsUpdateProfile(false);
    } catch (err) {
      console.log(err.response.data);
      enqueueSnackbar("Không thể cập nhật hồ sơ. Vui lòng thử lại.", {
        variant: "error",
      }); // Show error notification
    } finally {
      setLoading(false);
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        "https://localhost:7077/api/Users/Detail",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
      setUpdatedProfile(response.data);
      setLoading(false);
      setimg(response.data.avatarURL);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/login");
      } else {
        enqueueSnackbar(err.message, { variant: "error" }); // Show error notification
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setimg(URL.createObjectURL(selectedFile)); // Create a temporary URL for the image
      setUpdatedProfile((prev) => ({
        ...prev,
        Avatar: selectedFile,
      }));
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!profile) return <div>No profile data</div>;
  return (
    <>
      <Header />
      <section
        className="inner-header-title"
        style={{
          backgroundImage: `url(https://ik.imagekit.io/ryf3sqxfn/banner-6.jpg)`,
        }}
      >
        <div className="container">
          <h1>Hồ sơ</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="detail-desc advance-detail-pr gray-bg">
        <div className="container white -shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={img} className="img" alt="" />
            </div>
            <div className="detail-status">
              <span>
                {profile.roleName === "Job seeker"
                  ? "Người tìm việc"
                  : "Tuyển dụng"}
              </span>
            </div>
          </div>
          <div className="row bottom-mrg">
            <div className="col-md-12 col-sm-12">
              <div className="advance-detail detail-desc-caption">
                <h4>{profile.fullName}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="full-detail-description full-detail gray-bg">
        <div className="container">
          <div className="col-md-12 col-sm-12">
            <div className="full-card">
              <div className="deatil-tab-employ tool-tab">
                <ul className="nav simple nav-tabs" id="simple-design-tab">
                  <li className="active">
                    <a href="#about">Thông tin chi tiết</a>
                  </li>
                </ul>
                <div className="tab-content">
                  {!isUpdateProfile ? (
                    <div id="address" className="tab-pane fade in active">
                      <ul className="job-detail-des">
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Họ và tên:
                          </span>{" "}
                          {profile.fullName}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Email:
                          </span>{" "}
                          {profile.email}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Số điện thoại:
                          </span>{" "}
                          {profile.phonenumber}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Vai trò:
                          </span>{" "}
                          {profile.roleName === "Employer"
                            ? "Nhà tuyển dụng"
                            : profile.roleName === "Job seeker"
                            ? "Người tìm việc"
                            : "Không xác định"}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Tình trạng hiện tại:
                          </span>{" "}
                          {profile.jobName ? profile.jobName : "Không xác định"}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Địa chỉ:
                          </span>{" "}
                          {profile.address}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Giới tính:
                          </span>{" "}
                          {(() => {
                            if (profile.gender === true) return "Nam";
                            if (profile.gender === false) return "Nữ";
                            return "Chưa xác định";
                          })()}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{ marginRight: 60, width: 150 }}
                          >
                            Tuổi:
                          </span>{" "}
                          {profile.age}
                        </li>
                        <li>
                          <span
                            className="label1"
                            style={{
                              marginRight: 60,
                              width: 150,
                              whiteSpace: "nowrap", // Đảm bảo tiêu đề không xuống dòng
                            }}
                          >
                            Miêu tả bản thân:
                          </span>
                          <span style={{ fontWeight: "normal" }}>
                            {profile.description}
                          </span>
                        </li>

                        {profile.registerEmployerStatus !== null && (
                          <li>
                            <span
                              className="label1"
                              style={{
                                marginRight: 60,
                                width: 150,
                                whiteSpace: "nowrap", // Đảm bảo không ngắt dòng
                                display: "inline-block", // Hiển thị trên cùng một dòng
                              }}
                            >
                              Trạng thái nhà tuyển dụng:
                            </span>
                            <span
                              style={{
                                color:
                                  profile.registerEmployerStatus === 0
                                    ? "orange" // Màu cam cho trạng thái "Đang chờ duyệt"
                                    : profile.registerEmployerStatus === 1
                                    ? "green" // Màu xanh lá cho trạng thái "Đã được phê duyệt"
                                    : profile.registerEmployerStatus === 2
                                    ? "red" // Màu đỏ cho trạng thái "Bị từ chối"
                                    : "black", // Mặc định
                                fontWeight: "bold",
                                whiteSpace: "nowrap", // Đảm bảo không ngắt dòng
                                display: "inline-block",
                              }}
                            >
                              {profile.registerEmployerStatus === 0
                                ? "Đang chờ duyệt"
                                : profile.registerEmployerStatus === 1
                                ? "Đã được phê duyệt"
                                : profile.registerEmployerStatus === 2
                                ? "Bị từ chối"
                                : "Không xác định"}
                            </span>
                          </li>
                        )}
                        {profile.roleId === 2 && serviceInfo && (
                          <li>
                            {serviceInfo.isFindJobseekers === 0 ? (
                              <span
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                  display: "inline-block",
                                }}
                              >
                                Tính năng tìm kiếm ứng viên chưa được kích hoạt
                              </span>
                            ) : serviceInfo.expirationDate &&
                              new Date(serviceInfo.expirationDate) <
                                new Date() ? (
                              <span
                                style={{
                                  color: "orange",
                                  fontWeight: "bold",
                                  display: "inline-block",
                                }}
                              >
                                Tính năng tìm kiếm ứng viên đã hết hạn vào ngày{" "}
                                {new Date(
                                  serviceInfo.expirationDate
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "green",
                                  fontWeight: "bold",
                                  display: "inline-block",
                                }}
                              >
                                Tính năng tìm kiếm ứng viên đã được bật và sẽ
                                hết hạn vào ngày{" "}
                                {new Date(
                                  serviceInfo.expirationDate
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </li>
                        )}
                      </ul>

                      {/* Nút ManageCV và Verify Employer Account */}
                      <div className="button-group">
                        <button
                          className="manage-btn"
                          onClick={() => navigate("/ManagementCV")}
                        >
                          Quản lý CV
                        </button>

                        {profile.roleId === 1 &&
                          profile.registerEmployerStatus !== 0 && (
                            <button
                              className="verify-btn"
                              onClick={() => navigate("/verifyEmployerAccount")}
                            >
                              Xác minh tài khoản nhà tuyển dụng
                            </button>
                          )}

                        <button
                          className="update-btn"
                          onClick={() => setIsUpdateProfile(true)}
                        >
                          Cập Nhật
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div id="settings" className="tab-pane fade in active">
                      <form onSubmit={handleSubmit}>
                        <div className="row no-mrg">
                          <div className="edit-pro">
                            <div className="col-md-4 col-sm-6">
                              <label>Ảnh đại diện</label>
                              <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                              />
                              <img
                                style={{ width: 250, height: 330 }}
                                src={img}
                                alt="Avatar Preview"
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Họ và tên</label>
                              <input
                                type="text"
                                name="fullName"
                                value={updatedProfile.fullName}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Tuổi</label>
                              <input
                                type="number"
                                min={1}
                                name="age"
                                value={updatedProfile.age}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Email</label>
                              <input
                                disabled
                                type="email"
                                name="email"
                                value={updatedProfile.email}
                                className="form-control"
                                onChange={handleInputChange}
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Số điện thoại</label>
                              <input
                                type="text"
                                name="phonenumber"
                                value={updatedProfile.phonenumber}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Địa chỉ</label>
                              <input
                                type="text"
                                name="address"
                                value={updatedProfile.address}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Giới tính</label>
                              <select
                                name="gender"
                                value={updatedProfile.gender ?? ""}
                                className="form-control"
                                onChange={handleInputChange}
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Tình trạng hiện tại</label>
                              <select
                                name="currentJob"
                                className="form-control"
                                value={updatedProfile.currentJob ?? ""}
                                onChange={handleInputChange}
                              >
                                <option value={0}>
                                  Chọn Tình trạng hiện tại
                                </option>
                                <option value={1}>Thất nghiệp</option>
                                <option value={2}>Đang đi học</option>
                                <option value={3}>Đang đi làm</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Miêu tả bản thân</label>
                              <textarea
                                name="description"
                                value={updatedProfile.description}
                                className="form-control"
                                onChange={handleInputChange}
                                required
                              ></textarea>
                            </div>
                            <div className="col-sm-2">
                              <button type="submit" className="update-btn1">
                                Cập nhật
                              </button>
                            </div>
                            <div className="col-sm-2">
                              <button
                                type="button"
                                className="update-btn1 cancel-btn"
                                onClick={() => setIsUpdateProfile(false)}
                              >
                                Hủy
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Profile;
