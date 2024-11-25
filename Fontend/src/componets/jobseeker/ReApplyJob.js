import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ReApplyJob() {
    const { job_id } = useParams(); // Lấy job_id từ URL
    const [cvs, setCvs] = useState([]);
    const [appliedCvs, setAppliedCvs] = useState([]); // Danh sách CV đã ứng tuyển
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applyStatus, setApplyStatus] = useState(null); // Trạng thái ứng tuyển
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const haveProfile = localStorage.getItem("haveProfile");
            if (!haveProfile) {
                alert("Hãy cập nhật hồ sơ và xác thực tài khoản trước khi ứng tuyển");
                navigate("/profile");
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                navigate("/login");
                return;
            }

            try {
                // Gọi API để lấy danh sách CV
                const cvsResponse = await axios.get(
                    "https://localhost:7077/api/Cvs/GetCvByUID",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Gọi API để lấy danh sách ApplyJob đã ứng tuyển
                const appliedResponse = await axios.get(
                    `https://localhost:7077/api/ApplyJobs/GetApplied?&jobid=${job_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setCvs(cvsResponse.data);
                setAppliedCvs(appliedResponse.data.map(applyJob => applyJob.cvId));
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [job_id, navigate]);

    const handleApply = async (cvId) => {
        const token = localStorage.getItem("token");
        const applyJobDTO = {
            PostId: job_id,
            CvId: cvId,
        };

        try {
            const response = await axios.post(
                "https://localhost:7077/api/ApplyJobs/ApplyJob",
                applyJobDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setApplyStatus('Ứng tuyển thành công!');
                navigate("/ViewAllJobApplied");
            } else {
                setApplyStatus('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error("Error applying for job:", err);
            setApplyStatus('Bạn đã ứng tuyển, không thể ứng tuyển lại nữa.');
        }
    };

    // Styles for the component
    const styles = {
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        },
        title: {
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px',
        },
        cvItems: {
            display: 'flex',
            flexDirection: 'column',
            gap: '15px', 
        },
        cvItem: {
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '5px',
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
        },
        cvItemTitle: {
            fontSize: '1.5rem',
            marginBottom: '10px',
            color: '#007bff', 
        },
        cvDetail: {
            padding: '10px 0',
            borderTop: '1px solid #eaeaea',
        },
        cvDetailTitle: {
            fontWeight: 'bold',
            color: '#555',
        },
        cvDetailDescription: {
            margin: '5px 0 0',
            color: '#777', 
        },
        applyButton: {
            marginTop: '10px',
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        loading: {
            textAlign: 'center',
            color: '#888',
            marginTop: '20px',
        },
        error: {
            textAlign: 'center',
            color: '#888',
            marginTop: '20px',
        },
        applyStatus: {
            textAlign: 'center',
            color: '#007bff',
            marginTop: '20px',
        },
        appliedMessage: { color: '#28a745', fontWeight: 'bold' },
    };

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <>
            <Header />
            <div style={styles.container}>
                <h2 style={styles.title}>Chọn CV để ứng tuyển</h2>
                {applyStatus && <div style={styles.applyStatus}>{applyStatus}</div>}
                <div style={styles.cvItems}>
                    {cvs.map(cv => (
                        <div key={cv.cvId} style={styles.cvItem}>
                            <h3 style={styles.cvItemTitle}>{cv.nameCv}</h3>
                            {cv.itemOfCvs.map(item => (
                                <div key={item.itemOfCvId} style={styles.cvDetail}>
                                    <h4 style={styles.cvDetailTitle}>{item.itemName}</h4>
                                    <p>{item.itemDescription}</p>
                                </div>
                            ))}
                            {appliedCvs.includes(cv.cvId) ? (
                                <p style={styles.appliedMessage}>Bạn đã ứng tuyển bằng CV này rồi</p>
                            ) : (
                                <button
                                    style={styles.applyButton}
                                    onClick={() => handleApply(cv.cvId)}
                                >
                                    Ứng tuyển bằng CV này
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <h2 style={styles.title}>
                    Chưa có CV? <a href="/ManagementCV">Tạo mới</a>
                </h2>
            </div>
            <Footer />
        </>
    );
}

export default ReApplyJob;



    