import React, { useState } from 'react';
import '../assets/css/style.css'; // Import CSS tùy chỉnh
import '../assets/css/colors/green-style.css'; // Import CSS chủ đề
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png'; // Logo
import bannerImage from '../assets/img/banner-2.jpg'; // Ảnh nền

function ForgotPassword() {
  const [email, setEmail] = useState(''); // Quản lý email
  const [code, setCode] = useState(''); // Quản lý mã xác thực
  const [password, setPassword] = useState(''); // Quản lý mật khẩu
  const [confirmPassword, setConfirmPassword] = useState(''); // Quản lý xác nhận mật khẩu
  const [emailVerified, setEmailVerified] = useState(false); // Trạng thái email đã được xác minh
  const [errorMessage, setErrorMessage] = useState(''); // Quản lý lỗi
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Hàm xử lý khi nhấn nút Submit để kiểm tra email
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Gọi API kiểm tra email tồn tại
  //     const response = await fetch('/api/check-email', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email }),
  //     });

  //     const result = await response.json();

  //     if (result.exists) {
  //       // Nếu email tồn tại, chuyển đến bước tiếp theo
  //       setEmailVerified(true);
  //       setErrorMessage('');
  //     } else {
  //       setErrorMessage('Email không tồn tại!');
  //     }
  //   } catch (error) {
  //     console.error("Có lỗi xảy ra khi kiểm tra email:", error);
  //     setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
  //   }
  // };

   // Hàm xử lý khi nhấn nút Submit để kiểm tra email
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu trạng thái loading

    // Mô phỏng gọi API với setTimeout
    setTimeout(() => {
      setLoading(false); // Kết thúc trạng thái loading
      if (email === 'test@example.com') {
        // Giả lập email tồn tại
        setEmailVerified(true);
        setErrorMessage('');
      } else {
        // Giả lập email không tồn tại
        setErrorMessage('Email không tồn tại!');
      }
    }, 2000); // Giả lập thời gian phản hồi là 2 giây
  };

  // Hàm xử lý khi người dùng hoàn tất nhập mã code và mật khẩu
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp!');
      return;
    }
    // Logic gửi mã code và mật khẩu mới về API để cập nhật
    console.log("Mã code:", code, "Mật khẩu mới:", password);
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
              {!emailVerified ? (
                // Form kiểm tra email
                <form onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <button className="btn btn-login" type="submit">Xác nhận Email</button>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
              ) : (
                // Form nhập mã xác thực và mật khẩu
                <form onSubmit={handleResetPassword}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập mã xác thực"
                    value={code}
                    onChange={handleCodeChange}
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Nhập mật khẩu mới"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <button className="btn btn-login" type="submit">Đặt lại mật khẩu</button>
                  
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ForgotPassword;
