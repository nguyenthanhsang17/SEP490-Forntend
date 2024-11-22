import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  // Fetch user data
  const fetchUsers = async (pageNumber = 1, search = "", role = "", status = "") => {
    try {
      const queryParams = new URLSearchParams({
        pageNumber,
        pageSize,
        name: search,
        role: role || "",
        status: status || "",
      });

      const response = await fetch(`https://localhost:7077/api/Users/GetAllUsers?${queryParams}`);
      const data = await response.json();
      setUsers(data.items);
      setTotalPages(data.totalPages);
      setCurrentPage(data.pageNumber);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchTerm, selectedRole, selectedStatus); // Fetch users with filters
  };

  const handlePageChange = (pageNumber) => {
    fetchUsers(pageNumber, searchTerm, selectedRole, selectedStatus); // Fetch users for selected page
  };

  const handleViewDetail = (userId) => {
    navigate(`/user/${userId}`); // Điều hướng đến trang chi tiết người dùng
  };

  const styles = {
    container: {
      padding: "0px",
      fontFamily: "Arial, sans-serif",
    },
    searchBar: {
      marginBottom: "20px",
      display: "flex",
      gap: "10px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    select: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    th: {
        border: "1px solid #ddd",
        padding: "10px",
        backgroundColor: "#f4f4f4",
        textAlign: "center", // Căn giữa nội dung theo chiều ngang
    },
    td: {
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "center", // Căn giữa nội dung theo chiều ngang
        verticalAlign: "middle", // Căn giữa nội dung theo chiều dọc
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      gap: "5px",
    },
    pageButton: {
      padding: "10px 15px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      cursor: "pointer",
    },
    activePageButton: {
      backgroundColor: "#007bff",
      color: "white",
    },
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
      <h2>Quản lý người dùng</h2>

      {/* Search & Filters */}
      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={styles.select}
        >
          <option value="">Vai trò</option>
          <option value="1">Ứng Viên</option>
          <option value="2">Nhà Tuyển Dụng</option>
          <option value="3">Nhân Viên Hệ Thống</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={styles.select}
        >
          <option value="">Trạng thái</option>
          <option value="0">Chưa xác thực</option>
          <option value="3">Bị cấm</option>
        </select>
        <button type="submit" style={styles.button}>
          Tìm kiếm
        </button>
      </form>

      {/* User List */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Ảnh</th>
            <th style={styles.th}>Tên</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Số điện thoại</th>
            <th style={styles.th}>Vai trò</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td style={styles.td}>
                <img
                  src={user.avatarURL}
                  alt={user.fullName}
                  style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                />
              </td>
              <td style={styles.td}>{user.fullName}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{user.phonenumber}</td>
              <td style={styles.td}>
              {user.roleId === 1 
              ? "Ứng Viên" 
              : user.roleId === 2 
              ? "Nhà tuyển dụng" 
              : user.roleId ===32 
              ? "Nhân Viên Hệ Thống" 
              : "Quản Trị Viên"} 
              </td>
              <td style={styles.td}>
                <button style={styles.button} onClick={() => handleViewDetail(user.userId)} 
                    >Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            style={{
              ...styles.pageButton,
              ...(currentPage === index + 1 ? styles.activePageButton : {}),
            }}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
      </main>
    </div>
    
  );
};

export default ManageUser;