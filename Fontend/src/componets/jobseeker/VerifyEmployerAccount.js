import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';
import Swal from 'sweetalert2';

function VerifyEmployerAccount() {
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [cccdImages, setCccdImages] = useState([]);
  const [addressImages, setAddressImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    const currentImages = type === 'cccd' ? cccdImages : addressImages;

    if (currentImages.length + files.length > (type === 'cccd' ? 3 : 3)) {
      alert(`Bạn chỉ được chọn tối đa ${type === 'cccd' ? 3 : 3} ảnh cho ${type === 'cccd' ? "CCCD" : "địa chỉ"}!`);
      return;
    }

    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file
    }));

    if (type === 'cccd') {
      setCccdImages(prev => [...prev, ...newImages]);
    } else {
      setAddressImages(prev => [...prev, ...newImages]);
    }
  };

  const handleImageRemove = (index, type) => {
    if (type === 'cccd') {
      setCccdImages(cccdImages.filter((_, i) => i !== index));
    } else {
      setAddressImages(addressImages.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (!businessName || !businessAddress || (cccdImages.length === 0 && addressImages.length === 0)) {
        await Swal.fire({
            title: 'Hãy chắc chắn bạn đã điền đủ thông tin và tải lên ảnh CCCD!',
            icon: 'warning',
            confirmButtonText: 'Ok',
        });
        setIsSubmitting(false);
        return;
    }

    const formData = new FormData();
    formData.append("BussinessName", businessName);
    formData.append("BussinessAddress", businessAddress);

    // Gộp mảng ảnh CCCD và Địa chỉ
    const allImages = [...cccdImages, ...addressImages];
    allImages.forEach((image) => formData.append("files", image.file)); // Gửi tất cả tệp qua trường "files"

    const token = localStorage.getItem('token');
    try {
        const response = await fetch('https://localhost:7077/api/Users/VerifyEmployerAccount', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (response.ok) {
            await Swal.fire({
                title: 'Đăng ký thành công!',
                text: 'Bạn đã đăng ký để trở thành nhà tuyển dụng. Vui lòng đợi phê duyệt.',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
            navigate("/profile");
        } else {
            const errorText = await response.text();
            await Swal.fire({
                title: 'Có lỗi xảy ra!',
                text: errorText || 'Có lỗi xảy ra khi gửi yêu cầu.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setIsSubmitting(false);
            navigate("/profile");
        }
    } catch (error) {
        console.error('Submission error:', error);
        await Swal.fire({
            title: 'Lỗi kết nối máy chủ!',
            text: 'Vui lòng kiểm tra kết nối mạng và thử lại.',
            icon: 'error',
            confirmButtonText: 'Thử lại',
        });
        setIsSubmitting(false);
    }
};


  const showAlert = async ({ title, icon, confirmText = 'Ok', timer = null }) => {
    await Swal.fire({
      title,
      icon,
      confirmButtonText: confirmText,
      timer,
      timerProgressBar: !!timer, // Hiển thị thanh tiến trình nếu có timer
    });
  };


  return (
    <div style={{
      backgroundImage: `url(${bannerImage})`,
      backgroundSize: 'cover',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '610px',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
      }}>
        <img src={logoImage} alt="Logo" style={{ width: '200px', marginBottom: '5px' }} />
        <h2 style={{ marginBottom: '25px', fontFamily: 'Arial, sans-serif', color: '#333', fontSize: '1.5em' }}>Xác Thực Tài Khoản Nhà Tuyển Dụng</h2>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Nơi làm việc</label>
          <input
            type="text"
            placeholder="Tên cửa hàng, công ty, phòng ban,..."
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0 20px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
          />

          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Địa Chỉ</label>
          <input
            type="text"
            placeholder="Địa chỉ"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', margin: '10px 0 20px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '1em' }}
          />

          {/* Upload CCCD */}
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Ảnh CCCD 2 mặt và mặt trước căng cước cùng với mặt </label>
          <div className="image-upload-container">
            {cccdImages.map((image, index) => (
              <div key={index} className="image-preview" style={{ position: 'relative', margin: '10px', display: 'inline-block' }}>
                <img src={image.url} alt={`CCCD ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index, 'cccd')}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {cccdImages.length < 3 && (
              <label className="upload-button" style={{ display: 'inline-block', margin: '10px' }}>
                <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, 'cccd')} style={{ display: 'none' }} />
                <div style={{
                  width: '100px',
                  height: '100px',
                  border: '2px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  +
                </div>
              </label>
            )}
          </div>

          {/* Upload Địa chỉ */}
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Ảnh Địa Chỉ</label>
          <div className="image-upload-container">
            {addressImages.map((image, index) => (
              <div key={index} className="image-preview" style={{ position: 'relative', margin: '10px', display: 'inline-block' }}>
                <img src={image.url} alt={`Address ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }} />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index, 'address')}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {addressImages.length < 3 && (
              <label className="upload-button" style={{ display: 'inline-block', margin: '10px' }}>
                <input type="file" multiple accept="image/*" onChange={(e) => handleImageChange(e, 'address')} style={{ display: 'none' }} />
                <div style={{
                  width: '100px',
                  height: '100px',
                  border: '2px dashed #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}>
                  +
                </div>
              </label>
            )}
          </div>

          {errorMessage && <p style={{ color: 'red', marginTop: '15px' }}>{errorMessage}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px',
                backgroundColor: isSubmitting ? '#cccccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                width: '48%',
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Xác Nhận'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
              style={{
                padding: '12px',
                backgroundColor: isSubmitting ? '#cccccc' : '#ff3b3b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                width: '48%',
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmployerAccount;