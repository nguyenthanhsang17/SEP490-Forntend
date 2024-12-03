import React, { useEffect, useState } from "react";
import axios from 'axios';
import { faHeart, faCheckCircle, faCircleCheck, faXmarkCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons"; // Icon hiện/ẩn mật khẩu

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Thêm FontAwesome
import { useNavigate } from "react-router-dom";
const PaymentResult = () => {
    const navigate = useNavigate();
    const [IsThanhcong, SetThanhcong] = useState(false);
    const [ServiceID, setServiceID] = useState(0);
    const [responseCode, SetresponseCode] = useState("");
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const amount = queryParams.get("vnp_Amount");
        const bankCode = queryParams.get("vnp_BankCode");
        const responseCode = queryParams.get("vnp_ResponseCode");

        SetresponseCode(responseCode);
        if(responseCode=="00"){
            SetThanhcong(true);
        }
    }, []);

    const VeTrangChu = () => {
        navigate("/");
    };

    return (
        <>
            {IsThanhcong ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f0f2f5'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        padding: '40px',
                        width: '500px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '60px',
                            color: '#4caf50',
                            marginBottom: '20px'
                        }}>
                            <FontAwesomeIcon
                                icon={faCheckCircle} // Thay đổi biểu tượng ở đây
                                style={{
                                    color: "#4caf50",
                                    fontSize: '100px',
                                    animation: 'pulse 1s infinite',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <h2 style={{
                            color: '#333',
                            marginBottom: '15px'
                        }}>
                            Thanh Toán Thành Công
                        </h2>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            <button style={{
                                padding: '10px 20px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                                onClick={() => VeTrangChu()}
                            >
                                Về Trang Chủ
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f0f2f5'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        padding: '40px',
                        width: '500px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '60px',
                            color: 'red', // Thay đổi màu sắc cho thất bại
                            marginBottom: '20px'
                        }}>
                            <FontAwesomeIcon
                                icon={faTimesCircle} // Biểu tượng cho thất bại
                                style={{
                                    color: "red",
                                    fontSize: '100px',
                                    animation: 'pulse 1s infinite',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </div>

                        <h2 style={{
                            color: '#333',
                            marginBottom: '15px'
                        }}>
                            Thanh Toán Thất Bại
                        </h2>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px'
                        }}>
                            <button style={{
                                padding: '10px 20px',
                                backgroundColor: '#f44336', // Màu đỏ cho nút thất bại
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                                onClick={() => VeTrangChu()}
                            >
                                Về Trang Chủ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>



    );

};
export default PaymentResult;
