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
    const { id } = useParams();
    const [jobSeeker, setJobSeeker] = useState(null);

    useEffect(() => {
        const fetchJobSeekerDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
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

                if (response.ok) {
                    const data = await response.json();
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
                } else if (response.status === 401) {
                    navigate("/login");
                }
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
                    <div className="row bottom-mrg align-items-center">
                        <div className="col-md-4 col-sm-4 text-center">
                            <img 
                                src={jobSeeker?.avatarURL} 
                                alt={`${jobSeeker?.fullName}'s avatar`} 
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                            />
                        </div>
                        <div className="col-md-8 col-sm-8">
                            <div className="detail-desc-caption">
                                <h4 className="designation">Thông Tin Liên Hệ</h4>
                                {jobSeeker ? (
                                    <ul className="job-seeker-info">
                                        <li><strong>Tên:</strong> {jobSeeker.fullName}</li>
                                        <li><strong>Tuổi:</strong> {jobSeeker.age}</li>
                                        <li><strong>Email:</strong> {jobSeeker.email}</li>
                                        <li><strong>Số điện thoại:</strong> {jobSeeker.phonenumber}</li>
                                        <li><strong>Địa chỉ:</strong> {jobSeeker.address}</li>
                                        <li><strong>Giới tính:</strong> {jobSeeker.gender === 'Male' ? 'Nam' : 'Nữ'}</li>
                                        <li><strong>Mô tả:</strong> {jobSeeker.description}</li>
                                    </ul>
                                ) : (
                                    <p>Đang tải thông tin ứng viên...</p>
                                )}
                                {jobSeeker && (
                                    <div className="button-group mt-4">
                                        <button className="btn btn-primary contact-btn" onClick={handleContactNow}>
                                            Liên Hệ Ngay
                                        </button>
                                        <button className="btn btn-secondary save-btn" onClick={handleSave}>
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
            <style jsx>{`
                .contact-btn {
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    border-radius: 5px;
                }

                .contact-btn:hover {
                    background-color: #218838;
                }

                .save-btn {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    margin-left: 10px;
                    border-radius: 5px;
                }

                .save-btn:hover {
                    background-color: #0069d9;
                }

                .designation, .detail-title {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-bottom: 2px solid #28a745;
                    padding-bottom: 5px;
                }

                .inner-header-title h1 {
                    font-size: 36px;
                    font-weight: bold;
                    color: #ffffff;
                    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
                }

                .job-seeker-info {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .job-seeker-info li {
                    font-size: 16px;
                    margin-bottom: 5px;
                    color: #555;
                }

                .job-seeker-info li strong {
                    color: #333;
                }
            `}</style>
        </>
    );
};

export default ViewJobDetailJobSeeker;
