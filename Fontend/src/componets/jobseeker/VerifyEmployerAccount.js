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
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleBusinessNameChange = (e) => {
    setBusinessName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setBusinessAddress(e.target.value);
  };

  const showAlert = async (text) => {
    const result = await Swal.fire({
      title: text,
      showCancelButton: true,
      confirmButtonText: 'Ok'
    });

    if (result.isConfirmed) {
      navigate("/profile");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedImages.length + files.length > 5) {
      alert('Bạn chỉ được chọn tối đa 5 ảnh!');
      return;
    }

    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file: file
    }));

    setSelectedImages(prev => [...prev, ...newImages]);
  };

  const handleImageRemove = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ngay lập tức disable nút submit
    setIsSubmitting(true);
    setErrorMessage('');

    if (!businessName || !businessAddress || selectedImages.length === 0) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin và chọn tối đa 5 ảnh.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("BusinessName", businessName);
    formData.append("BusinessAddress", businessAddress);

    selectedImages.forEach((image) => {
      formData.append("files", image.file);
    });

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://localhost:7077/api/Users/VerifyEmployerAccount', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        showAlert("Yêu cầu của bạn đã được Gửi");
        setIsSubmitting(false);
      } else {
        // Kiểm tra nội dung lỗi từ response
        const errorText = await response.text();
        setErrorMessage(errorText || 'Đã đăng ký để trở thành nhà tuyển dụng, đợi duyệt.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Có lỗi xảy ra khi kết nối với máy chủ.');
      setIsSubmitting(false);
    }
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
        <img src={logoImage} alt="Logo" style={{ width: '250px', marginBottom: '5px' }} />
        <h2 style={{ marginBottom: '25px', fontFamily: 'Arial, sans-serif', color: '#333', fontSize: '1.5em' }}>Xác Thực Tài Khoản Nhà Tuyển Dụng</h2>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Tên cơ sở kinh doanh</label>
          <input
            type="text"
            placeholder="Tên cơ sở kinh doanh "
            value={businessName}
            onChange={handleBusinessNameChange}
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0 20px 0',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1em',
            }}
            required
          />

          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Địa Chỉ</label>
          <input
            type="text"
            placeholder="Địa chỉ"
            value={businessAddress}
            onChange={handleAddressChange}
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0 20px 0',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1em',
            }}
            required
          />
          <span style={{ fontSize: '13px', color: '#777', display: 'block', marginBottom: '15px' }}>
            Gửi ảnh 2 mặt căn cước công dân và ảnh địa chỉ của bạn (tối đa 5 ảnh)
          </span>

          <div className="input-group form-group full-width">
            <div className="image-upload-container" style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              padding: '10px 0'
            }}>
              {selectedImages.map((image, index) => (
                <div key={index} className="image-preview" style={{
                  position: 'relative',
                  minWidth: '100px',
                  height: '100px',
                  flexShrink: 0
                }}>
                  <img
                    src={image.url}
                    alt={`Preview ${index}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <button
                    onClick={() => handleImageRemove(index)}
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      border: 'none',
                      background: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {selectedImages.length < 5 && (
                <label
                  className="upload-button"
                  style={{
                    minWidth: '100px',
                    height: '100px',
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '30px',
                    flexShrink: 0,
                    borderRadius: '4px'
                  }}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  +
                </label>
              )}
            </div>
          </div>

          {errorMessage && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9em' }}>{errorMessage}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isSubmitting ? '#cccccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              opacity: isSubmitting ? 0.5 : 1
            }}
            onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#45a049')}
            onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#4CAF50')}
          >
            {isSubmitting ? 'Đang gửi...' : 'Xác Nhận'}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/profile')} 
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isSubmitting ? '#cccccc' : '#ff3b3b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              opacity: isSubmitting ? 0.5 : 1
            }}
            onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#e62e2e')}
            onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#ff3b3b')}
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