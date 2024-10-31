import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';

function VerifyEmployerAccount() {
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [idCardImages, setIdCardImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleBusinessNameChange = (e) => {
    setBusinessName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleIdCardImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setErrorMessage('Vui lòng chọn tối đa 3 ảnh.');
      return;
    }
    setIdCardImages(files);
    setErrorMessage(''); // Clear error if the selection is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName || !address || idCardImages.length === 0) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin và chọn tối đa 3 ảnh.');
      return;
    }

    navigate('/success');
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
        maxWidth: '450px',
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
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Mã số căn cước công dân</label>
          <input
            type="text"
            placeholder="012345"
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
            value={address}
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
            Gửi ảnh 2 mặt căn cước công dân và ảnh địa chỉ của bạn (tối đa 3 ảnh)
          </span>
          
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Ảnh CMND</label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleIdCardImageChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1em',
              }}
            />
          </div>

          {idCardImages.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {idCardImages.map((image, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    style={{ width: '60px', height: '60px', borderRadius: '5px', marginRight: '10px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setIdCardImages(idCardImages.filter((_, i) => i !== index))}
                    style={{
                      color: 'red',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {errorMessage && <p style={{ color: 'red', marginTop: '15px', fontSize: '0.9em' }}>{errorMessage}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <button type="submit" style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
            >
              Xác Nhận
            </button>

            <button type="button" onClick={() => navigate('/')} style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ff3b3b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1em',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e62e2e'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ff3b3b'}
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
