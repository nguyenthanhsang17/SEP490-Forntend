import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/style.css";
import "../assets/plugins/css/plugins.css";
import "../assets/css/colors/green-style.css";
import bannerImage from '../assets/img/banner-6.jpg';
import logoImage from '../assets/img/Nice Job Logo-Photoroom.png';

function VerifyEmployerAccount() {
  const [BussinessName, setBusinessName] = useState('');
  const [BussinessAddress, setBusinessAddress] = useState('');
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleBusinessNameChange = (e) => {
    setBusinessName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setBusinessAddress(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setErrorMessage('Vui lòng chọn tối đa 5 ảnh.');
      return;
    }
    setFiles(selectedFiles);
    setErrorMessage(''); // Clear error if the selection is valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!BussinessName || !BussinessAddress || files.length === 0) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin và chọn tối đa 5 ảnh.');
      return;
    }
  
    const formData = new FormData();
    formData.append("BussinessName", BussinessName);
    formData.append("BussinessAddress", BussinessAddress);
    files.forEach((file) => {
      formData.append("files", file);
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
        alert('Yêu cầu của bạn đã được gửi!');
        navigate('/');
      } else {
        setErrorMessage('Có lỗi xảy ra khi gửi yêu cầu xác thực.');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi kết nối với máy chủ.');
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
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Tên cơ sở kinh doanh</label>
          <input
            type="text"
            placeholder="Tên cơ sở kinh doanh"
            value={BussinessName}
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
            value={BussinessAddress}
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
          
          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Ảnh CMND</label>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '1em',
              }}
            />
          </div>

          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    style={{ width: '60px', height: '60px', borderRadius: '5px', marginRight: '10px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
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
