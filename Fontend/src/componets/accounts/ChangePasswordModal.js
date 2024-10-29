import React, { useState, useEffect } from 'react';

const styles = {
  modal: {
    display: 'flex',
    position: 'fixed',
    zIndex: 1000,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    animation: 'fadeIn 0.3s',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    width: '90%',
    maxWidth: '400px',
    animation: 'slideIn 0.3s',
  },
  title: {
    color: '#333',
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
    position: 'relative',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  primaryButton: {
    backgroundImage: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  passwordStrength: {
    height: '5px',
    marginTop: '10px',
    borderRadius: '5px',
    transition: 'width 0.3s',
  },
  togglePassword: {
    position: 'absolute',
    right: '10px',
    top: '38px',
    cursor: 'pointer',
    color: '#999',
  },
  notification: {
    color: 'green',
    textAlign: 'center',
    marginBottom: '20px',
  },
  errorNotification: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
};

const ChangePasswordModal = ({ show, handleClose, fullName }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const [errorNotification, setErrorNotification] = useState('');

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'unset';
  }, [show]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setErrorNotification('Mật khẩu không khớp.');
      return;
    }

    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('fullName');

    try {
      const response = await fetch('https://localhost:7077/api/Users/ChangePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Thay đổi mật khẩu không thành công.');
      }

      setNotification(`Mật khẩu đã được thay đổi thành công cho người dùng: ${fullName}`);
      setErrorNotification('');
      
      // Clear the form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      
      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
        setNotification('');
      }, 2000);
    } catch (error) {
      setErrorNotification('Có lỗi xảy ra khi thay đổi mật khẩu.');
      setNotification('');
      console.error('Error changing password:', error);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 6) strength += 20;
    if (password.match(/[a-z]+/)) strength += 20;
    if (password.match(/[A-Z]+/)) strength += 20;
    if (password.match(/[0-9]+/)) strength += 20;
    if (password.match(/[$@#&!]+/)) strength += 20;
    setPasswordStrength(strength);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
  };

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!show) {
    return null;
  }

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>Đổi Mật Khẩu</h2>
        {notification && <div style={styles.notification}>{notification}</div>}
        {errorNotification && <div style={styles.errorNotification}>{errorNotification}</div>}
        <form onSubmit={handleChangePassword}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="old-password">Mật Khẩu Cũ</label>
            <input
              style={styles.input}
              type={showOldPassword ? "text" : "password"}
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span style={styles.togglePassword} onClick={toggleOldPasswordVisibility}>
              {showOldPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="new-password">Mật Khẩu Mới</label>
            <input
              style={styles.input}
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <span style={styles.togglePassword} onClick={toggleNewPasswordVisibility}>
              {showNewPassword ? "🙈" : "👁️"}
            </span>
            <div style={{ ...styles.passwordStrength, width: `${passwordStrength}%`, backgroundColor: `hsl(${passwordStrength}, 100%, 50%)` }}></div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirm-password">Xác Nhận Lại Mật Khẩu</label>
            <input
              style={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span style={styles.togglePassword} onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.buttonGroup}>
            <button type="button" style={{ ...styles.button, ...styles.secondaryButton }} onClick={handleClose}>Hủy</button>
            <button type="submit" style={{ ...styles.button, ...styles.primaryButton }}>Đổi Mật Khẩu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
