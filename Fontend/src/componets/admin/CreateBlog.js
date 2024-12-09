import { useState } from "react";
import axios from "axios";
import Sidebar from "./SidebarAdmin";
import Header from "./HeaderAdmin";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const styles = {
  container: {
    padding: "30px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f6f7",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "600",
    borderBottom: "3px solid #3498db",
    paddingBottom: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  label: {
    marginBottom: "10px",
    fontWeight: "600",
    color: "#34495e",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #bdc3c7",
    transition: "all 0.3s ease",
    backgroundColor: "#f8f9fa",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #bdc3c7",
    height: "350px",
    resize: "vertical",
    lineHeight: "1.6",
    backgroundColor: "#f8f9fa",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  previewContainer: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed #bdc3c7",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f1f2f6"
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "6px"
  }
};

const CreateBlog = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [BamNut, SetBamNut] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Lưu file
      setThumbnail(file);

      // Tạo URL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Xử lý sự kiện gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    SetBamNut(true);

    try {
      const result = await Swal.fire({
        title: 'Bạn chắc chắn muốn tạo Blog?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có',
        cancelButtonText: 'Không',
      });

      if (result.isConfirmed) {
        // Kiểm tra dữ liệu đầu vào
        if (!blogTitle.trim() || !blogDescription.trim()) {
          //alert("Vui lòng nhập tiêu đề và mô tả.");
          await Swal.fire({
            title: 'Vui lòng nhập tiêu đề và mô tả.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ok',
          });
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
          console.log("Tạo thành công");
          await Swal.fire({
            title: 'Tạo thành công!',
            icon: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false, // Ngăn đóng cảnh báo bằng cách nhấp bên ngoài
            allowEscapeKey: false,
          });

          navigate('/BlogList');
        } catch (error) {
          console.log("Lỗi khi tạo");
          await Swal.fire({
            title: "Có lỗi trong quá trình tạo.",
            icon: 'error',
            confirmButtonText: 'Ok',
            allowOutsideClick: false, // Ngăn đóng cảnh báo bằng cách nhấp bên ngoài
            allowEscapeKey: false,
          });
        }
      }
    } catch (error) {
      console.error("Failed to send request approval:", error);
      await Swal.fire({
        title: error.response.data.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
    SetBamNut(false);
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
          <h1 style={styles.heading}>Tạo Blog mới</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tiêu đề: <span style={{ color: "red" }}>(*)</span></label>
              <input
                type="text"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Nhập tiêu đề ..."
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mô tả: <span style={{ color: "red" }}>(*)</span></label>
              <textarea
                value={blogDescription}
                onChange={(e) => setBlogDescription(e.target.value)}
                placeholder="Nhập mô tả "
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Ảnh Thumbnail: <span style={{ color: "red" }}>(*)</span></label>
              <input
                type="file"
                onChange={handleFileChange}
                style={styles.input}
                accept="image/*"  // Chỉ chấp nhận file ảnh
              />
              {/* Thêm phần preview ảnh */}
              {thumbnailPreview && (
                <div style={styles.previewContainer}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={styles.previewImage}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              style={{
                ...styles.button,
                backgroundColor: BamNut ? "gray" : styles.button.backgroundColor,
                cursor: BamNut ? "not-allowed" : "pointer"
              }}
              disabled={BamNut}
              onClick={!BamNut ? handleSubmit : null}
            >
              {BamNut ? "Đang tạo blog ..." : "Tạo Blog"}
            </button>
          </form>
        </div>
      </main>
    </div>

  );
};

export default CreateBlog;
