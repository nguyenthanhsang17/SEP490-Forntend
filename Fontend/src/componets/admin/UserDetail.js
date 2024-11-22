import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";

const UserDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [banReason, setBanReason] = useState(""); // Lý do cấm
  const [isBanned, setIsBanned] = useState(false); // Trạng thái cấm

  // Lấy thông tin user từ API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://localhost:7077/api/Users/GetUserDetail?id=${id}`);
        setUser(response.data); // Cập nhật thông tin người dùng
        setIsBanned(response.data.status === 3); // Kiểm tra trạng thái cấm
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Hàm xử lý cấm người dùng
  const handleBan = async () => {
    if (!banReason.trim()) {
      alert("Vui lòng nhập lý do cấm."); // Nếu lý do trống
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7077/api/Users/Ban_Unban_user/${id}?ban=true`,
        banReason,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message); // Hiển thị thông báo thành công
      setIsBanned(true); // Cập nhật trạng thái cấm
    } catch (error) {
      console.error("Error banning user", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  // Hàm xử lý hủy cấm người dùng
const handleUnban = async () => {
    try {
      const response = await axios.post(
        `https://localhost:7077/api/Users/Ban_Unban_user/${id}?ban=false`, // Không cần gửi body
        banReason,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message); // Hiển thị thông báo thành công
      setIsBanned(false); // Cập nhật trạng thái hủy cấm
    } catch (error) {
      console.error("Error unbanning user", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };
  

  return (
    <div className="dashboard-grid-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="dashboard-content">
      <div style={styles.container}>
      <div style={styles.profileContainer}>
        {/* Hiển thị hình ảnh */}
        <img
          src={user.avatarURL || "default-avatar-url.jpg"}
          alt="User Avatar"
          style={styles.avatar}
        />
        <div style={styles.userInfo}>
          <h2>{user.fullName}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Số điện thoại:</strong> {user.phonenumber}</p>
          <p><strong>Vai trò:</strong> {user.roleId === 1 
              ? "Ứng Viên" 
              : user.roleId === 2 
              ? "Nhà tuyển dụng" 
              : user.roleId ===32 
              ? "Nhân Viên Hệ Thống" 
              : "Quản Trị Viên"} </p>
          <p><strong>Trạng thái công việc:</strong> {user.jobName}</p>
          <p><strong>Mô Tả:</strong> {user.description}</p>
          <p><strong>Địa Chỉ:</strong> {user.address}</p>
          <p><strong>Giới Tính:</strong> {user.gender ? "Nam" : "Nữ"}</p>
        </div>
      </div>

      <div style={styles.actionsContainer}>
        {isBanned ? (
          // Hiển thị nút Hủy cấm nếu người dùng đã bị cấm
          <button style={styles.button} onClick={handleUnban}>Unban User</button>
        ) : (
          <>
            {/* Hiển thị nút Cấm và ô nhập lý do cấm nếu người dùng chưa bị cấm */}
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Enter reason for banning..."
              style={styles.textarea}
            />
            <button style={styles.button} onClick={handleBan}>Ban User</button>
          </>
        )}
      </div>
    </div>
      </main>
    </div>
    
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    marginRight: "20px",
  },
  userInfo: {
    flex: 1,
  },
  actionsContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    height: "100px",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
    resize: "none",
  },
};

export default UserDetail;
