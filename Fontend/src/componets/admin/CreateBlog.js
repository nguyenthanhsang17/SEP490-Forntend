import { useState } from "react";
import axios from "axios";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";

const CreateBlog = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  // Xử lý sự kiện gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra dữ liệu đầu vào
    if (!blogTitle.trim() || !blogDescription.trim()) {
      alert("Vui lòng nhập tiêu đề và mô tả.");
      return;
    }
  
    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append("BlogTitle", blogTitle);
    formData.append("BlogDescription", blogDescription);
    if (thumbnail) {
      formData.append("Thumbnail", thumbnail);
    }
  

    const token = localStorage.getItem("token");

    try {
    const response = await axios.post(
      "https://localhost:7077/api/Blogs/createblog",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    alert("Tạo thành công");

    } catch (error) {
      alert("Có lỗi trong quá trình tạo.");
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
      <h1 style={styles.heading}>Tạo bài viết mới</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tiêu đề bài viết:</label>
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            placeholder="Nhập tiêu đề bài viết"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mô tả bài viết:</label>
          <textarea
            value={blogDescription}
            onChange={(e) => setBlogDescription(e.target.value)}
            placeholder="Nhập mô tả bài viết"
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Ảnh Thumbnail:</label>
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Tạo bài viết
        </button>
      </form>
    </div>
      </main>
    </div>
    
  );
};

const styles = {
  container: {
    padding: "0px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    height: "300px",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    fontWeight: "bold",
    color: "#007bff",
  },
};

export default CreateBlog;
