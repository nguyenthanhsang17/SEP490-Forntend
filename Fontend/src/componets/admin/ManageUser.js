import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
    createBlogButton: { // camelCase tên key
      padding: "12px 20px", /* Add padding */
      backgroundColor: "#3498db", /* Button background color */
      color: "white", /* Text color */
      border: "none", /* Remove border */
      borderRadius: "8px", /* Rounded corners */
      fontWeight: 600, /* Font weight */
      transition: "background-color 0.3s ease, transform 0.3s ease", /* Transition effects */
    },
    createBlogContainer: {          // Đổi tên thuộc tính sang camelCase.
      display: "flex",              // Giá trị phải nằm trong dấu ngoặc kép.
      justifyContent: "center",     // Đổi "justifycontent" thành "justifyContent".
      margin: "20px 0",             // Giá trị phải là chuỗi.
    },
    
    container: {
      padding: "20px",
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    searchBar: {
      marginBottom: "20px",
      display: "flex",
      gap: "10px",
    },
    input: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
      width: "200px",
      transition: "border-color 0.3s",
    },
    inputFocus: {
      borderColor: "#007bff",
    },
    select: {
      padding: "12px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
      transition: "border-color 0.3s",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
    },
    th: {
      border: "1px solid #ddd",
      padding: "12px",
      backgroundColor: "#3498db",
      color: "white",
      textAlign: "center",
    },
    td: {
      border: "1px solid #ddd",
      padding: "12px",
      textAlign: "center",
      verticalAlign: "middle",
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
      transition: "background-color 0.3s",
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
          <h1 className='pageTitle' style={{
            textAlign: 'center',
            color: '#2c3e50',
            marginBottom: '20px',
            fontSize: '28px',
            fontWeight: '700',
            borderBottom: '3px solid #3498db',
            paddingBottom: '15px'
          }}>
            Quản lý người dùng
          </h1>

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
          <div style={styles.createBlogContainer}>
            <button onClick={() => navigate("/CreateStaffAccount")} style={styles.createBlogButton}><FontAwesomeIcon icon={faPlus} /> Tạo Tài khoản nhân viên hệ thống</button>
          </div>

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
                        : user.roleId === 3
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
