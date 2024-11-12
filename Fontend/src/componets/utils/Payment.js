import React from 'react';
import { Button } from 'antd';
import "../assets/css/colors/green-style.css";

const VNPayPayment = () => {
  const qrCodeImage =
    'https://sandbox.vnpayment.vn/demo/qrcode/vnpayqr.png'; // URL ảnh QR Code tĩnh

  const handleRetry = () => {
    console.log('Retry generating QR code...');
    // Có thể thêm logic để tải lại QR Code nếu cần
  };

  return (
    <div className="vnpay-payment-container">
      <h2>Thanh toán qua VNPay</h2>
      <div className="qr-code-container">
        <img src={qrCodeImage} alt="VNPay QR Code" className="qr-code-image" />
      </div>
      <Button type="primary" onClick={handleRetry} className="refresh-button">
        Tải lại mã QR
      </Button>
    </div>
  );
};

export default VNPayPayment;
