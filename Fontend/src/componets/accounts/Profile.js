import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack'; // Import useSnackbar
import Footer from '../common/Footer';
import Header from '../common/Header';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';

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
          enqueueSnackbar(err.message, { variant: 'error' }); // Show error notification
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");

    try {
      if (file) {
        await handleUpload();
      }

      await axios.put(
        "https://localhost:7077/api/Users/UpdateProfile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      enqueueSnackbar("Cập nhật hồ sơ thành công!", { variant: 'success' }); // Show success notification
      setProfile(updatedProfile);
      localStorage.setItem("fullName", updatedProfile.fullName); // Update fullName in localStorage
      setIsUpdateProfile(false);
    } catch (err) {
      enqueueSnackbar("Không thể cập nhật hồ sơ. Vui lòng thử lại.", { variant: 'error' }); // Show error notification
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setimg(URL.createObjectURL(selectedFile)); // Create a temporary URL for the image
    }
  };

  const handleUpload = async () => {
    if (!file) {
      enqueueSnackbar("Please select a file first.", { variant: 'error' }); // Show error notification
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("https://localhost:7077/api/Upload/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const mediaId = response.data.mediaid;

      setUpdatedProfile(prev => ({
        ...prev,
        avatar: mediaId
      }));
      enqueueSnackbar("Upload successful!", { variant: 'success' }); // Show success notification
      return mediaId;
    } catch (error) {
      enqueueSnackbar(`Upload failed: ${error.response?.data || error.message}`, { variant: 'error' }); //Show error notification
      throw error;
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!profile) return <div>No profile data</div>;
  return (
    <>
      <Header />
      <section className="inner-header-title" style={{ backgroundImage: `url(https://ik.imagekit.io/ryf3sqxfn/banner-6.jpg)` }}>
        <div className="container">
          <h1>Hồ sơ</h1>
        </div>
      </section>
      <div className="clearfix"></div>

      <section className="detail-desc advance-detail-pr gray-bg">
        <div className="container white -shadow">
          <div className="row">
            <div className="detail-pic">
              <img src={profile.avatarURL} className="img" alt="" />
              <a href="#" className="detail-edit" title="edit"><i className="fa fa-pencil"></i></a>
            </div>
            <div className="detail-status">
              <span>{profile.roleName === 'Job seeker' ? "Người tìm việc" : "Tuyển dụng"}</span>
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
                  <li className="active"><a href="#about">Thông tin chi tiết</a></li>
                </ul>
                <div className="tab-content">
                  {!isUpdateProfile ? (
                    <div id="address" className="tab-pane fade in active">
                      <ul className="job-detail-des">
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Họ và tên:</span> {profile.fullName}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Email:</span> {profile.email}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Số điện thoại:</span> {profile.phonenumber}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Công việc hiện tại:</span> {profile.jobName}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Địa chỉ:</span> {profile.address}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Giới tính:</span> {profile.gender ? "Nam" : "Nữ"}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Tuổi:</span> {profile.age}</li>
                        <li><span className="label1" style={{ marginRight: 60, width: 150 }}>Miêu tả bản thân:</span> <textarea disabled>{profile.description}</textarea></li>
                      </ul>
                      <button type="button" onClick={() => setIsUpdateProfile(true)} className="update-btn">Cập nhật thông tin cá nhân</button>
                    </div>
                  ) : (
                    <div id="settings" className="tab-pane fade in active">
                      <form onSubmit={handleSubmit}>
                        <div className="row no-mrg">
                          <div className="edit-pro">
                            <div className="col-md-4 col-sm-6">
                              <label>Ảnh đại diện</label>
                              <input type="file" className="form-control" onChange={handleFileChange} />
                              <img style={{ width: 250, height: 330 }} src={img} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Họ và tên</label>
                              <input type="text" name="fullName" value={updatedProfile.fullName} className="form-control" onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Tuổi</label>
                              <input type="number" min={1} name="age" value={updatedProfile.age} className="form-control" onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Email</label>
                              <input disabled type="email" name="email" value={updatedProfile.email} className="form-control" onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Số điện thoại</label>
                              <input type="text" name="phonenumber" value={updatedProfile.phonenumber} className="form-control" onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Địa chỉ</label>
                              <input type="text" name="address" value={updatedProfile.address} className="form-control" onChange={handleInputChange} />
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Giới tính</label>
                              <select name="gender" value={updatedProfile.gender} className="form-control" onChange={handleInputChange}>
                                <option value="true">Nam</option>
                                <option value="false">Nữ</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Tình trạng hiện tại</label>
                              <select name="currentJob" className="form-control" value={profile.currentJob} onChange={handleInputChange}>
                                <option value={1} >Thất nghiệp</option>
                                <option value={2} >Đang đi học</option>
                                <option value={3} >Đang đi làm</option>
                              </select>
                            </div>
                            <div className="col-md-4 col-sm-6">
                              <label>Miêu tả bản thân</label>
                              <textarea name="description" value={updatedProfile.description} className="form-control" onChange={handleInputChange}></textarea>
                            </div>
                            <div className="col-sm-2">
                              <button type="submit" className="update-btn">Cập nhật</button>
                            </div>
                            <div className="col-sm-2">
                              <button type="button" className="update-btn cancel-btn" onClick={() => setIsUpdateProfile(false)}>Hủy</button>
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