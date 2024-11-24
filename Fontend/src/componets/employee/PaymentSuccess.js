import React, { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [IsThanhcong, SetThanhcong] = useState(false);
    const [ServiceID, setServiceID] = useState(0);
    const [responseCode, SetresponseCode] = useState("");
    const hasCalledApi = useRef(false); // Dùng useRef để theo dõi việc gọi API

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const amount = queryParams.get("vnp_Amount");
        const bankCode = queryParams.get("vnp_BankCode");
        const responseCode = queryParams.get("vnp_ResponseCode");
        const transactionStatus = queryParams.get("vnp_TransactionStatus");
        const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");

        console.log(vnp_OrderInfo);

        const decodedString = decodeURIComponent(vnp_OrderInfo);
        const number = decodedString.match(/\d+$/); // Lấy số cuối cùng

        if (number) {
            console.log(number[0]);
        } else {
            console.log("Không tìm thấy số cuối cùng.");
        }

        const token = localStorage.getItem("token");
        const ServiceID = parseInt(number[0]);
        setServiceID(ServiceID);
        
        // In các giá trị để kiểm tra
        console.log(token);
        console.log(ServiceID);
        console.log("Amount:", amount);
        console.log("Bank Code:", bankCode);
        console.log("Response Code:", responseCode);
        console.log("Transaction Status:", transactionStatus);
        console.log(responseCode == "00");
        SetresponseCode(responseCode);
    }, []);

    // Gọi API Payment Callback
    useEffect(() => {
        const callPaymentCallBack = async (id) => {
            if (responseCode === "00" && !hasCalledApi.current) {
                const token = localStorage.getItem("token");
                try {
                    // Gửi yêu cầu POST tới API với body là ServiceID và token trong header
                    const response = await axios.post(
                        `https://localhost:7077/api/VnPay/PaymentCallBack/${id}`,
                        {}, // Không cần body dữ liệu nếu API không yêu cầu
                        {
                            headers: {
                                Authorization: `Bearer ${token}` // Thêm Authorization header với token
                            }
                        }
                    );
                    hasCalledApi.current = true; // Đánh dấu đã gọi API
                    navigate("/PaymentResult?vnp_ResponseCode=00");
                    console.log('Response:', response.data); // In ra kết quả trả về từ API
                } catch (error) {
                    console.error('Error during the API call:', error); // Nếu có lỗi
                }
            } else {
                navigate("/PaymentResult?vnp_ResponseCode=" + responseCode);
            }
        };

        if (ServiceID) {
            callPaymentCallBack(ServiceID); // Chỉ gọi API khi ServiceID có giá trị
        }

    }, [responseCode, ServiceID, navigate]); // Chạy lại khi responseCode hoặc ServiceID thay đổi

    return (
        <>
            {/* Giao diện UI khác */}
        </>
    );
};

export default PaymentSuccess;
