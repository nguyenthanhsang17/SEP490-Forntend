import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  const navigate = useNavigate();

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

  return (
    <div className="profile-container">
      <h1>Hồ sơ của bạn</h1>
      {profile && (
        <div className="profile-content">
          {editMode ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Họ và Tên:</label>
                <input
                  type="text"
                  name="fullName"
                  value={updatedProfile.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Tuổi:</label>
                <input
                  type="number"
                  name="age"
                  value={updatedProfile.age}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={updatedProfile.phonenumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Công việc hiện tại:</label>
                <input
                  type="number"
                  name="currentJob"
                  value={updatedProfile.currentJob}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={updatedProfile.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  value={updatedProfile.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Giới tính:</label>
                <select
                  name="gender"
                  value={updatedProfile.gender}
                  onChange={handleInputChange}
                >
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </select>
              </div>

              <div className="btn-group">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
                </button>
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setEditMode(false)}
                >
                  Trở về
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <img
                src={profile.avatarURL}
                alt="Avatar"
                width="150"
                className="avatar"
              />
              <p><strong>Họ và Tên:</strong> {profile.fullName}</p>
              <p><strong>Tên đăng nhập:</strong> {profile.userName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Tuổi:</strong> {profile.age}</p>
              <p><strong>Số điện thoại:</strong> {profile.phonenumber}</p>
              <p><strong>Công việc hiện tại:</strong> {profile.jobName}</p>
              <p><strong>Mô tả:</strong> {profile.description}</p>
              <p><strong>Địa chỉ:</strong> {profile.address}</p>
              <p><strong>Số dư:</strong> {profile.balance} VND</p>
              <p><strong>Trạng thái:</strong> {profile.status === 1 ? "Hoạt động" : "Không hoạt động"}</p>
              <p><strong>Giới tính:</strong> {profile.gender ? "Nam" : "Nữ"}</p>
              <p><strong>Vai trò:</strong> {profile.roleName}</p>

              <div className="btn-group">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/")}
                >
                  Quay lại
                </button>
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Chỉnh sửa hồ sơ
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}
    </div>
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
