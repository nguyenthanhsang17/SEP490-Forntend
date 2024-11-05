import React, { useState, useEffect } from 'react';
import "../assets/css/style.css";
import '../assets/plugins/css/plugins.css';
import '../assets/css/colors/green-style.css';

import bannerImage from '../assets/img/banner-10.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useNavigate, useParams } from 'react-router-dom';

const ViewJobDetailJobSeeker = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get 'id' from URL parameters
    const [jobSeeker, setJobSeeker] = useState(null);

    useEffect(() => {
        const fetchJobSeekerDetails = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.log("No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`https://localhost:7077/api/JobJobSeeker/GetJobSeekerDetail/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.log("Unauthorized! Redirecting to login.");
                        navigate("/login");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Filter only required fields
                const filteredData = {
                    userId: data.userId,
                    email: data.email,
                    avatarURL: data.avatarURL,
                    fullName: data.fullName,
                    age: data.age,
                    phonenumber: data.phonenumber,
                    currentJob: data.currentJob,
                    description: data.description,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    numberAppiled: data.numberAppiled,
                    numberAppiledAccept: data.numberAppiledAccept,
                    cvDTOs: data.cvDTOs.map(cv => ({
                        cvId: cv.cvId,
                        userId: cv.userId,
                        nameCv: cv.nameCv,
                        itemOfCvs: cv.itemOfCvs.map(item => ({
                            itemOfCvId: item.itemOfCvId,
                            cvId: item.cvId,
                            itemName: item.itemName,
                            itemDescription: item.itemDescription
                        }))
                    }))
                };

                setJobSeeker(filteredData);
            } catch (error) {
                console.error("Failed to fetch job seeker details:", error);
            }
        };

        fetchJobSeekerDetails();
    }, [id, navigate]);

    const handleContactNow = () => {
        alert(`Contacting ${jobSeeker.fullName}`);
    };

    const handleSave = () => {
        localStorage.setItem(`savedJobSeeker_${jobSeeker.userId}`, JSON.stringify(jobSeeker));
        alert(`${jobSeeker.fullName} has been saved.`);
    };

    return (
        <>
            <Header />
            <div className="clearfix"></div>

            <section className="inner-header-title" style={{ backgroundImage: `url(${bannerImage})` }}>
                <div className="container">
                    <h1>Thông Tin Ứng Viên</h1>
                </div>
            </section>
            <div className="clearfix"></div>

            <section className="detail-desc">
                <div className="container white-shadow">
                    <div className="row bottom-mrg">
                        <div className="col-md-8 col-sm-8">
                            <div className="detail-desc-caption">
                                <h4 className="designation">Thông Tin Liên Hệ</h4>
                                {jobSeeker ? (
                                    <ul>
                                        <li>
                                            <img 
                                                src={jobSeeker.avatarURL} 
                                                alt={`${jobSeeker.fullName}'s avatar`} 
                                            />
                                        </li>
                                        <li>Tên: {jobSeeker.fullName}</li>
                                        <li>Tuổi: {jobSeeker.age}</li>
                                        <li>Email: {jobSeeker.email}</li>
                                        <li>Số điện thoại: {jobSeeker.phonenumber}</li>
                                        <li>Địa chỉ: {jobSeeker.address}</li>
                                        <li>Giới tính: {jobSeeker.gender === 'Male' ? 'Nam' : 'Nữ'}</li>
                                        <li>Mô tả: {jobSeeker.description}</li>
                                    </ul>
                                ) : (
                                    <p>Đang tải thông tin ứng viên...</p>
                                )}
                                {jobSeeker && (
                                    <div className="button-group">
                                        <button className="btn btn-primary" onClick={handleContactNow}>
                                            Liên Hệ Ngay
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleSave}>
                                            Lưu
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="full-detail-description full-detail">
                <div className="container">
                    <div className="row row-bottom">
                        <h2 className="detail-title">CV Ứng Viên</h2>
                        {jobSeeker && jobSeeker.cvDTOs.length > 0 ? (
                            jobSeeker.cvDTOs.map(cv => (
                                <div key={cv.cvId}>
                                    <h4>{cv.nameCv}</h4>
                                    <ul>
                                        {cv.itemOfCvs.map(item => (
                                            <li key={item.itemOfCvId}>
                                                <strong>{item.itemName}:</strong> {item.itemDescription}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p>Không có CV nào được tìm thấy.</p>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default ViewJobDetailJobSeeker;
