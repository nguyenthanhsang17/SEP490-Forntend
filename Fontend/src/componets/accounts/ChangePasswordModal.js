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
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "unset";
  }, [show]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate confirm password
    if (newPassword !== confirmPassword) {
      setErrorNotification("Mật khẩu không khớp.");
      return;
    }

    // Validate password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#&!])[A-Za-z\d$@#&!]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorNotification(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt."
      );
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://localhost:7077/api/Users/ChangePassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Thay đổi mật khẩu không thành công.");
      }

      setNotification("Mật khẩu đã được thay đổi thành công.");
      setErrorNotification("");

      // Clear fields and close modal
      setTimeout(() => {
        handleClose();
        setNotification("");
      }, 2000);
    } catch (error) {
      setErrorNotification("Có lỗi xảy ra khi thay đổi mật khẩu.");
      console.error("Error changing password:", error);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[$@#&!]/.test(password)) strength += 20;
    setPasswordStrength(strength);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);

    // Validate password format
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[$@#&!])[A-Za-z\d$@#&!]{8,}$/;
    if (!passwordRegex.test(value)) {
      setErrorNotification(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt."
      );
    } else {
      setErrorNotification(""); // Clear error if password is valid
    }
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

  if (!show) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>Đổi Mật Khẩu</h2>
        {notification && <div style={styles.notification}>{notification}</div>}
        {errorNotification && (
          <div style={styles.errorNotification}>{errorNotification}</div>
        )}
        <form onSubmit={handleChangePassword}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="old-password">
              Mật Khẩu Cũ
            </label>
            <input
              style={styles.input}
              type={showOldPassword ? "text" : "password"}
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <span
              style={styles.togglePassword}
              onClick={toggleOldPasswordVisibility}
            >
              {showOldPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="new-password">
              Mật Khẩu Mới
            </label>
            <input
              style={styles.input}
              type={showNewPassword ? "text" : "password"}
              id="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <span
              style={styles.togglePassword}
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? "🙈" : "👁️"}
            </span>
            <div
              style={{
                ...styles.passwordStrength,
                width: `${passwordStrength}%`,
                backgroundColor: `hsl(${passwordStrength}, 100%, 50%)`,
              }}
            ></div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="confirm-password">
              Xác Nhận Mật Khẩu
            </label>
            <input
              style={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              style={styles.togglePassword}
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
