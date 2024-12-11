import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import Swal from 'sweetalert2';
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

    const { value: reason } = await Swal.fire({
      title: "Bạn có chắc chắn cấm người dùng này?",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off"
      },
      inputPlaceholder: "Nhập lý do cấm ở đây...", // Thêm placeholder
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      showLoaderOnConfirm: true,
    });

    if (reason !== undefined) {
      if (!reason) {
        await Swal.fire({
          title: 'Vui lòng nhập lý do cấm',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonText: 'OK',
        });
        return;
      }
      setBanReason(reason);
      try {
        const response = await axios.post(
          `https://localhost:7077/api/Users/Ban_Unban_user/${id}?ban=true`,
          reason,
          { headers: { "Content-Type": "application/json" } }
        );
        await Swal.fire({
          title: 'Cấm thành công!',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setIsBanned(true); // Cập nhật trạng thái cấm
      } catch (error) {
        await Swal.fire({
          title: "Có lỗi khi cấm người dùng",
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        console.error("Error banning user", error);
      }
    }


  };

  // Hàm xử lý hủy cấm người dùng
  const handleUnban = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn gỡ cấm người dùng này?",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
      showLoaderOnConfirm: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `https://localhost:7077/api/Users/Ban_Unban_user/${id}?ban=false`, // Không cần gửi body
          banReason,
          { headers: { "Content-Type": "application/json" } }
        );
        await Swal.fire({
          title: "Gỡ cấm thành công!",
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        setIsBanned(false); // Cập nhật trạng thái hủy cấm
      } catch (error) {
        await Swal.fire({
          title: "Có lỗi khi gỡ cấm người dùng",
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        console.error("Error unbanning user", error);
      }
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
                  : user.roleId === 3
                    ? "Nhân Viên Hệ Thống"
                    : "Quản Trị Viên"} </p>
              {user && user.roleId !== 3 ? (
                <>
                  <p><strong>Trạng thái công việc:</strong> {user.jobName}</p>
                  <p><strong>Mô Tả:</strong> {user.description}</p>
                </>
              ) : null}
              <p><strong>Địa Chỉ:</strong> {user.address}</p>
              <p><strong>Giới Tính:</strong> {user.gender ? "Nam" : "Nữ"}</p>
            </div>
          </div>

          <div style={styles.actionsContainer}>
            {isBanned ? (
              // Hiển thị nút Hủy cấm nếu người dùng đã bị cấm
              <button style={styles.button2} onClick={handleUnban}>Gỡ cấm người dùng</button>
            ) : (
              <>
                {/* Hiển thị nút Cấm và ô nhập lý do cấm nếu người dùng chưa bị cấm */}

                <button style={styles.button1} onClick={handleBan}>Cấm người dùng</button>
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
    padding: '20px',
    fontFamily: 'Roboto, sans-serif',
    backgroundColor: '#f9f9f9', // Màu nền nhẹ hơn
    borderRadius: '10px', // Bo tròn góc
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
    maxWidth: '800px', // Giới hạn chiều rộng
    margin: '20px auto', // Căn giữa
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#ffffff', // Màu nền trắng
    borderRadius: '10px', // Bo tròn góc
    padding: '20px', // Khoảng cách bên trong
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', // Đổ bóng nhẹ
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%', // Bo tròn hình ảnh
    marginRight: '20px', // Khoảng cách bên phải
    border: '3px solid #3498db', // Đường viền màu xanh
  },
  userInfo: {
    flex: 1, // Chiếm toàn bộ không gian còn lại
  },
  h2: {
    fontSize: '26px', // Kích thước chữ lớn hơn
    color: '#2c3e50', // Màu chữ tối
    marginBottom: '10px', // Khoảng cách dưới
  },
  p: {
    fontSize: '16px', // Kích thước chữ
    color: '#34495e', // Màu chữ tối
    margin: '5px 0', // Khoảng cách trên và dưới
  },
  actionsContainer: {
    marginTop: '20px',
    textAlign: 'center', // Căn giữa nội dung
  },
  button: {
    padding: '12px 20px', // Khoảng cách bên trong
    backgroundColor: '#3498db', // Màu nền nút
    color: 'white', // Màu chữ trắng
    border: 'none', // Không có đường viền
    borderRadius: '5px', // Bo tròn góc
    cursor: 'pointer', // Con trỏ tay
    fontSize: '16px', // Kích thước chữ
    transition: 'background-color 0.3s', // Hiệu ứng chuyển đổi
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  button1: {
    padding: '12px 20px', // Khoảng cách bên trong
    backgroundColor: '#DC143C', // Màu nền nút
    color: 'white', // Màu chữ trắng
    border: 'none', // Không có đường viền
    borderRadius: '5px', // Bo tròn góc
    cursor: 'pointer', // Con trỏ tay
    fontSize: '16px', // Kích thước chữ
    transition: 'background-color 0.3s', // Hiệu ứng chuyển đổi
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  button2: {
    padding: '12px 20px', // Khoảng cách bên trong
    backgroundColor: '#4682B4', // Màu nền nút
    color: 'white', // Màu chữ trắng
    border: 'none', // Không có đường viền
    borderRadius: '5px', // Bo tròn góc
    cursor: 'pointer', // Con trỏ tay
    fontSize: '16px', // Kích thước chữ
    transition: 'background-color 0.3s', // Hiệu ứng chuyển đổi
    width: '100%', // Chiếm toàn bộ chiều rộng
  },
  buttonHover: {
    backgroundColor: '#2980b9', // Màu nền khi hover
  },
  textarea: {
    width: '100%', // Chiếm toàn bộ chiều rộng
    height: '100px', // Chiều cao cố định
    marginBottom: '10px', // Khoảng cách dưới
    padding: '10px', // Khoảng cách bên trong
    borderRadius: '5px', // Bo tròn góc
    border: '1px solid #bdc3c7', // Đường viền nhẹ
    fontSize: '16px', // Kích thước chữ
    resize: 'none', // Không cho phép thay đổi kích thước
    transition: 'border-color 0.3s', // Hiệu ứng chuyển đổi
  },
  textareaFocus: {
    borderColor: '#3498db', // Đổi màu viền khi focus
  },
};

export default UserDetail;
