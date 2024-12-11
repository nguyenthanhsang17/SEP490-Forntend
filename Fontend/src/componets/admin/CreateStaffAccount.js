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
const CreateStaffAccount = () => {
    const [BamNut, SetBamNut] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState(true); // Mặc định là "Nam"
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Nhân viên hỗ trợ'); // Mặc định là "Nhân viên hỗ trợ"
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [isActive, setIsActive] = useState(true); // Mặc định là "Kích hoạt"
    const navigate = useNavigate();
    const handleFullNameChange = (e) => {
        setFullName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    const handleSubmit = async (e) => {
        SetBamNut(true);
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form

        // Kiểm tra các trường bắt buộc
        if (!fullName || !email || !phoneNumber || !address || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng điền đầy đủ thông tin bắt buộc!',
            });
            SetBamNut(false);
            return; // Dừng hàm nếu có trường không hợp lệ
        }

        // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp nhau không
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Mật khẩu và xác nhận mật khẩu không khớp!',
            });
            SetBamNut(false);
            return; // Dừng hàm nếu mật khẩu không khớp
        }

        // Nếu tất cả các điều kiện đều hợp lệ, thực hiện logic tạo tài khoản
        try {
            const apiUrl = "https://localhost:7077/api/Users/CreateStaffAccount"; // Thay bằng URL API thực tế
            const staffData = {
                Email: email,       // Địa chỉ email của nhân viên
                FullName: fullName,           // Họ và tên nhân viên
                Password: password,    // Mật khẩu
                Phonenumber: phoneNumber,        // Số điện thoại
                Address: address,       // Địa chỉ
                Gender: gender,                     // Giới tính (true: nam, false: nữ)
            };
            // Gọi API để tạo tài khoản
            const response = await axios.post(apiUrl, staffData, {
                headers: {
                    "Content-Type": "application/json", // Đảm bảo header đúng
                },
            });
            if (response.data.message === "tao thanh cong") {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Tài khoản đã được tạo thành công!',
                    allowOutsideClick: false, // Ngăn đóng cảnh báo bằng cách nhấp bên ngoài
                    allowEscapeKey: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Điều hướng sang trang khác khi người dùng bấm OK
                        navigate('/ManageUser')
                    }
                });;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'thất bại',
                    text: 'Tài khoản đã tồn tại',
                });
                SetBamNut(false);
            }
            // Hiển thị thông báo thành công


            // Reset form hoặc điều hướng đến trang khác nếu cần
        } catch (error) {
            // Xử lý lỗi nếu có
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi tạo tài khoản!',
            });
            SetBamNut(false);
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
                    <h1 style={styles.heading}>Tạo tài khoản nhân viên hỗ trợ</h1>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Họ và tên: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="text"
                                placeholder="Họ và tên ..."
                                style={styles.input}
                                value={fullName}
                                onChange={handleFullNameChange}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Email: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="text"
                                placeholder="Email ..."
                                style={styles.input}
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Số điện thoại: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="text"
                                placeholder="Số điện thoại ..."
                                style={styles.input}
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Địa chỉ: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="text"
                                placeholder="Địa chỉ ..."
                                value={address}
                                style={styles.input}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Giới tính: <span style={{ color: "red" }}>(*)</span></label>
                            <select style={styles.input} onChange={handleGenderChange} value={gender}>
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Mật khẩu: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="password"
                                placeholder=""
                                style={styles.input}
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Xác nhận mật khẩu: <span style={{ color: "red" }}>(*)</span></label>
                            <input
                                type="password"
                                placeholder=""
                                style={styles.input}
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
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
                            {BamNut ? "Đang tạo tài khoản ..." : "Tạo tài khoản"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateStaffAccount;