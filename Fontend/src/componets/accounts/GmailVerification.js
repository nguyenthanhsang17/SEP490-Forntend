import React, { useState } from 'react';
import '../assets/css/style.css'; // Import CSS tùy chỉnh
import '../assets/css/colors/green-style.css'; // Import CSS chủ đề
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png'; // Logo
import bannerImage from '../assets/img/banner-2.jpg'; // Ảnh nền

function GmailVerification() {
  const [verificationCode, setVerificationCode] = useState(''); // Quản lý mã xác thực
  const [errorMessage, setErrorMessage] = useState(''); // Quản lý lỗi
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const [successMessage, setSuccessMessage] = useState(''); // Quản lý thông báo thành công

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // Hàm xử lý khi nhấn nút xác nhận mã
  const handleVerify = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    setLoading(true); // Bắt đầu trạng thái loading
    setErrorMessage(''); // Reset lỗi

    // Kiểm tra xem mã xác thực đã được nhập chưa
    if (!verificationCode) {
      setErrorMessage('Vui lòng nhập mã xác thực!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://localhost:7077/api/Email/VerifyCode?code=${encodeURIComponent(verificationCode)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setErrorMessage('Mã xác thực không hợp lệ hoặc đã hết hạn.');
        return;
      }

      setSuccessMessage('Xác thực thành công! Bạn đã hoàn tất đăng ký.'); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Có lỗi xảy ra khi xác thực:", error);
      setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <div className="simple-bg-screen" style={{ backgroundImage: `url(${bannerImage})` }}>
      <div className="wrapper">
        <section className="lost-ps-screen-sec">
          <div className="container">
            <div className="lost-ps-screen">
              <a href="/">
                <img src={logoImage} className="img-responsive" alt="Logo" />
              </a>

              {/* Form nhập mã xác thực */}
              <form onSubmit={handleVerify}>
                <h2 className="verification-title">Xác Thực Gmail</h2>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã xác thực bạn nhận được qua email"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                />
                <button className="btn btn-login" type="submit" disabled={loading}>
                  {loading ? 'Đang xác thực...' : 'Xác nhận mã'}
                </button>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GmailVerification;
