import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from 'notistack'; // Import useSnackbar
const ManagementCV = () => {
    const [cvs, setCvs] = useState([]); // Danh sách CV đã lưu
    const [cvForms, setCvForms] = useState([]); // Danh sách form đang mở
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        // Fetch API khi component mount
        fetchCVs();
    }, []);

    const fetchCVs = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('https://localhost:7077/api/Cvs/GetCvByUID', {
                method: 'GET', // hoặc 'POST', 'PUT', 'DELETE' tùy vào API của bạn
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Thêm token vào header
                }
            });
            const data = await response.json();
            setCvs(data);
        } catch (error) {
            console.error("Error fetching CVs:", error);
        }
    };

    const handleCreateNewCV = () => {
        setCvForms([...cvForms, {
            id: Date.now(),
            nameCv: "",
            itemOfCvs: [{ itemName: "", itemDescription: "" }]
        }]);
    };

    const handleAddItem = (formIndex) => {
        const newForms = [...cvForms];
        newForms[formIndex].itemOfCvs.push({ itemName: "", itemDescription: "" });
        setCvForms(newForms);
    };

    const handleRemoveItem = (formIndex, itemIndex) => {
        const newForms = [...cvForms];
        newForms[formIndex].itemOfCvs = newForms[formIndex].itemOfCvs.filter((_, idx) => idx !== itemIndex);
        setCvForms(newForms);
    };

    const handleItemChange = (formIndex, itemIndex, field, value) => {
        const newForms = [...cvForms];
        newForms[formIndex].itemOfCvs[itemIndex][field] = value;
        setCvForms(newForms);
    };

    const handleSaveCV = (formIndex) => {
        const cvData = {
            ...cvForms[formIndex],
            cvId: Date.now()
        };
        setCvs([...cvs, cvData]);
        // Remove the form after saving
        const newForms = cvForms.filter((_, idx) => idx !== formIndex);
        setCvForms(newForms);
    };

    const handleDelete = (cvId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa CV này không?")) {
            const updatedCvs = cvs.filter((cv) => cv.cvId !== cvId);
            setCvs(updatedCvs);
        }
    };

    const handleEdit = (cv) => {
        setCvForms([...cvForms, {
            id: cv.cvId,
            nameCv: cv.nameCv,
            itemOfCvs: cv.itemOfCvs
        }]);
    };

    const LuuVaoDB = async  () =>{
        console.log(JSON.stringify(cvs, null, 2));
        try {
            const token = localStorage.getItem("token"); // Giả sử bạn lưu JWT token trong localStorage
            const response = await axios.put(
              'https://localhost:7077/api/Cvs/UpdateCv',  // Thay bằng URL thực tế của API
              cvs,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',  // Đảm bảo gửi dữ liệu dưới dạng JSON
                }
              }
            );
            // Xử lý phản hồi từ API nếu thành công
            console.log('CV updated successfully:', response.data);
            //return response.data; // Hoặc bạn có thể xử lý theo cách khác tùy nhu cầu
            enqueueSnackbar("đã thêm việc làm đã lưu, Vui lòng truy cập Công việc đã lưu", { variant: 'success' });
          } catch (error) {
            // Xử lý lỗi
            console.error('Error updating CV:', error);
            throw error; // Hoặc xử lý thông báo lỗi tùy nhu cầu
          }
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "2rem" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ backgroundColor: "#1e40af", padding: "2rem", color: "white" }}>
                    <h2 style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Quản lý CV của bạn</h2>
                    <p style={{ marginTop: "0.5rem", opacity: 0.8 }}>Tạo và quản lý CV chuyên nghiệp</p>
                </div>

                {/* Main Content */}
                <div style={{ padding: "2rem" }}>
                    {/* Nút Tạo CV mới */}
                    <button
                        onClick={handleCreateNewCV}
                        style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "500",
                            marginBottom: "1rem",
                        }}
                    >
                        Tạo CV mới
                    </button>

                    <button
                        onClick={LuuVaoDB}
                        style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "500",
                            marginBottom: "1rem",
                        }}
                    >
                        Lưu tất cả
                    </button>

                    {/* CV Forms */}
                    {cvForms.map((form, formIndex) => (
                        <div key={form.id} style={{ marginBottom: "2rem", backgroundColor: "#f8fafc", padding: "2rem", borderRadius: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                                    Tạo CV mới
                                </h3>
                                <button
                                    onClick={() => {
                                        const newForms = cvForms.filter((_, idx) => idx !== formIndex);
                                        setCvForms(newForms);
                                    }}
                                    style={{
                                        backgroundColor: "#ef4444",
                                        color: "white",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    Đóng
                                </button>
                            </div>

                            <input
                                type="text"
                                placeholder="Tên CV"
                                value={form.nameCv}
                                onChange={(e) => {
                                    const newForms = [...cvForms];
                                    newForms[formIndex].nameCv = e.target.value;
                                    setCvForms(newForms);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1.1rem",
                                    border: "2px solid #e2e8f0",
                                    borderRadius: "8px",
                                    marginBottom: "1rem",
                                }}
                            />

                            {form.itemOfCvs.map((item, itemIndex) => (
                                <div key={itemIndex} style={{ marginBottom: "1rem" }}>
                                    <input
                                        type="text"
                                        placeholder="Tiêu đề mục"
                                        value={item.itemName}
                                        onChange={(e) => handleItemChange(formIndex, itemIndex, "itemName", e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "8px",
                                            border: "2px solid #e2e8f0",
                                            marginBottom: "0.5rem",
                                        }}
                                    />
                                    <textarea
                                        placeholder="Mô tả chi tiết"
                                        value={item.itemDescription}
                                        onChange={(e) => handleItemChange(formIndex, itemIndex, "itemDescription", e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem",
                                            borderRadius: "8px",
                                            border: "2px solid #e2e8f0",
                                            minHeight: "100px",
                                        }}
                                    />
                                    <button
                                        onClick={() => handleRemoveItem(formIndex, itemIndex)}
                                        style={{
                                            backgroundColor: "#ef4444",
                                            color: "white",
                                            padding: "0.5rem 1rem",
                                            borderRadius: "8px",
                                            border: "none", cursor: "pointer",
                                            fontSize: "0.9rem",
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        Xóa mục
                                    </button>
                                </div>
                            ))}

                            <div style={{ display: "flex", gap: "1rem" }}>
                                <button
                                    onClick={() => handleAddItem(formIndex)}
                                    style={{
                                        backgroundColor: "#3b82f6",
                                        color: "white",
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Thêm mục mới
                                </button>
                                <button
                                    onClick={() => handleSaveCV(formIndex)}
                                    style={{
                                        backgroundColor: "#10b981",
                                        color: "white",
                                        padding: "0.75rem 1.5rem",
                                        borderRadius: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Lưu CV
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* CV List */}
                    <div style={{ marginTop: "2rem" }}>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                            Danh sách CV
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                            {cvs.map((cv) => (
                                <div
                                    key={cv.cvId}
                                    style={{
                                        backgroundColor: "white",
                                        padding: "1.5rem",
                                        borderRadius: "12px",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                                    }}
                                >
                                    <h4 style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{cv.nameCv}</h4>
                                    <div style={{ marginTop: "1rem" }}>
                                        <button
                                            onClick={() => handleEdit(cv)}
                                            style={{
                                                backgroundColor: "#fbbf24",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                marginRight: "0.5rem",
                                                transition: "background-color 0.2s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = "#f59e0b")}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = "#fbbf24")}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cv.cvId)}
                                            style={{
                                                backgroundColor: "#ef4444",
                                                color: "white",
                                                padding: "0.5rem 1rem",
                                                borderRadius: "8px",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                transition: "background-color 0.2s",
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagementCV;