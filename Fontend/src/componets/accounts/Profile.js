import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from '../common/Footer';
import Header from '../common/Header';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';



const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  const [issupdateProfile, setissupdateProfile] = useState(false);

  //=======================================
  //=======================================

  const navigate = useNavigate();
  //==========================================
  //==========================================
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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
        setUpdatedProfile(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("token");

    try {
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
      setSuccess("Cập nhật hồ sơ thành công!");
      setLoading(false);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (err) {
      setError("Không thể cập nhật hồ sơ. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;

  const handleissupdateProfile = () => {
    setissupdateProfile(true);
  }

  const handleissupdateProfileCancel = () => {
    setissupdateProfile(false);
  }

  const sang=()=>{
    
  }


  return (
    <>
      <Header />
      <section class="inner-header-title" style={{ backgroundImage: `url(https://ik.imagekit.io/ryf3sqxfn/banner-6.jpg)` }}>
        <div class="container">
          <h1>Hồ sơ</h1>
        </div>
      </section>
      <div class="clearfix"></div>

      <section class="detail-desc advance-detail-pr gray-bg">
        <div class="container white-shadow">

          <div class="row">
            <div class="detail-pic"><img src={profile.avatarURL} class="img" alt="" /><a href="#" class="detail-edit" title="edit"><i class="fa fa-pencil"></i></a></div>
            <div class="detail-status"><span>{profile.roleName === 'Job seeker' ? ("người tìm việc") : ("Tuyển dụng")}</span></div>
          </div>

          <div class="row bottom-mrg">
            <div class="col-md-12 col-sm-12">
              <div class="advance-detail detail-desc-caption">
                <h4>{profile.fullName}</h4>
              </div>
            </div>
          </div>

          <div class="row no-padd">
            <div class="detail pannel-footer">
              <div class="col-md-10 col-sm-10">
                <div class="detail-pannel-footer-btn pull-left">
                  <a href="javascript:void(0)" data-toggle="modal" data-target="#apply-job" class="footer-btn grn-btn" title="">Lịch sử ứng tuyển</a>
                  <a href="#" class="footer-btn blu-btn" title="">Đăng ký nhà tuyển dụng</a>
                  <a href="#" style={{ backgroundColor: "red" }} class="footer-btn blu-btn" title="">Quản lý CV</a>

                </div>
              </div>
              <div class="col-md-7 col-sm-7">
                <div class="detail-pannel-footer-btn pull-right">
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="full-detail-description full-detail gray-bg">
        <div class="container">
          <div class="col-md-12 col-sm-12">
            <div class="full-card">
              <div class="deatil-tab-employ tool-tab">
                <ul class="nav simple nav-tabs" id="simple-design-tab">
                  <li class="active"><a href="#about">Thông tin chi tiết</a></li>
                </ul>

                <div class="tab-content">
                  {!issupdateProfile ? (<div id="address" class="tab-pane fade in active">
                    <ul class="job-detail-des">
                      <li><span style={{ marginRight: 60, width: 150 }}>Họ và tên:</span>{profile.fullName}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Email:</span>{profile.email}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Số điện thoại:</span>{profile.phonenumber}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Công việc hiện tại:</span>{profile.jobName}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Địa chỉ:</span>{profile.address}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>giới tính:</span>{profile.gender ? ("Nam") : ("Nữ")}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Tuổi:</span>{profile.age}</li>
                      <li><span style={{ marginRight: 60, width: 150 }}>Miêu tả bản thân:</span><textarea>{profile.description}</textarea></li>
                    </ul>
                    <div class="col-sm-12">
                      <button type="button" onClick={handleissupdateProfile} class="update-btn">Cập nhật thông tin cá nhân</button>
                    </div>
                  </div>) : (<div id="settings" class="tab-pane fade in active">
                    <div class="row no-mrg">
                      <div class="edit-pro">
                        <div class="col-md-4 col-sm-6">
                          <label>Ảnh đại diện</label>
                          <input type="file" class="form-control" placeholder="Matthew" />
                          <img src={profile.avatarURL} />
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Họ và tên</label>
                          <input type="text" value={updatedProfile.fullName} class="form-control" placeholder="Họ và tên" onChange={handleInputChange}/>
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Tuổi</label>
                          <input min={1} type="number" class="form-control" placeholder="tuổi" value={updatedProfile.age} />
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Email</label>
                          <input type="email" class="form-control" placeholder="abc@gmail.com" value={updatedProfile.email} />
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Số điện thoại</label>
                          <input type="text" class="form-control" placeholder="+84 xxx xxx xxx" value={updatedProfile.phonenumber} />
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Chọn địa chỉ</label>
                          <input type="text" class="form-control" placeholder="địa chỉ" value={updatedProfile.address} />
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>Giới tính</label>
                          <select class="form-control">
                            <option>Nam</option>
                            <option>Nữ</option>
                          </select>
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>tình trạng hiện tại</label>
                          <select class="form-control">
                            <option>Thất nghiệp</option>
                            <option>Đang đi học</option>
                            <option>Đang đi làm</option>
                          </select>
                        </div>
                        <div class="col-md-4 col-sm-6">
                          <label>About you</label>
                          <textarea class="form-control" value={updatedProfile.description} placeholder="Write Something"></textarea>
                        </div>

                        <div class="col-sm-2">
                          <button type="button" class="update-btn">Cập nhật</button>
                        </div>
                        <div class="col-sm-2">
                          <button type="button" style={{backgroundColor: "red"}} class="update-btn" onClick={handleissupdateProfileCancel}>Hủy</button>
                        </div>
                      </div>
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

// CSS for the component
const css = `
.profile-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-details,
.profile-form {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}

textarea {
  resize: none;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.submit-btn, .edit-btn, .back-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover, .edit-btn:hover, .back-btn:hover {
  background-color: #0056b3;
}

.loading, .error, .success-msg, .error-msg {
  text-align: center;
  margin: 20px;
}

.avatar {
  display: block;
  margin: 0 auto 20px;
  border-radius: 50%;
}

.success-msg {
  color: green;
}

.error-msg {
  color: red;
}
`;

// Inject the CSS styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = css;
document.head.appendChild(styleSheet);
