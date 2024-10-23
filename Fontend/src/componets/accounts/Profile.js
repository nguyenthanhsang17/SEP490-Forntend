import React, { useState, useEffect } from "react";
import axios from "axios";
import Map from "../utils/Map";
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
      const response = await axios.put(
        "https://localhost:7077/api/Users/UpdateProfile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Profile updated successfully!");
      setLoading(false);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      {profile && (
        <div className="profile-content">
          {editMode ? (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={updatedProfile.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={updatedProfile.age}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phonenumber"
                  value={updatedProfile.phonenumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Current Job:</label>
                <input
                  type="number"
                  name="currentJob"
                  value={updatedProfile.currentJob}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={updatedProfile.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={updatedProfile.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Latitude:</label>
                <input
                  type="number"
                  name="latitude"
                  value={updatedProfile.latitude}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Longitude:</label>
                <input
                  type="number"
                  name="longitude"
                  value={updatedProfile.longitude}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={updatedProfile.gender}
                  onChange={handleInputChange}
                >
                  <option value={true}>Male</option>
                  <option value={false}>Female</option>
                </select>
              </div>

              <div className="btn-group">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
                {/* Back to Profile button */}
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setEditMode(false)}
                >
                  Back to Profile
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
              <p><strong>Full Name:</strong> {profile.fullName}</p>
              <p><strong>Username:</strong> {profile.userName}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Age:</strong> {profile.age}</p>
              <p><strong>Phone Number:</strong> {profile.phonenumber}</p>
              <p><strong>Current Job:</strong> {profile.jobName}</p>
              <p><strong>Description:</strong> {profile.description}</p>
              <p><strong>Address:</strong> {profile.address}</p>
              <p><strong>Balance:</strong> {profile.balance} VND</p>
              <p><strong>Status:</strong> {profile.status === 1 ? "Active" : "Inactive"}</p>
              <p><strong>Gender:</strong> {profile.gender ? "Male" : "Female"}</p>
              <p><strong>Role:</strong> {profile.roleName}</p>
              <p><strong>Coordinates:</strong> {profile.latitude}, {profile.longitude}</p>
              <Map latitude={profile.latitude} longitude={profile.longitude} />

              <div className="btn-group">
              <button
                  type="button"
                  className="back-btn"
                  onClick={() => navigate("/")} // Adjust as needed
                >
                  Back
                </button>
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  Edit Profile
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

// Embedded CSS for the component
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
