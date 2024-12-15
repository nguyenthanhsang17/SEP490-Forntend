import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function ApplyJob() {
    const { job_id } = useParams(); // Lấy job_id từ URL
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applyStatus, setApplyStatus] = useState(null); // Trạng thái ứng tuyển
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCvs = async () => {
            const haveProfile = localStorage.getItem("haveProfile");
            console.log("Giá trị haveProfile:", haveProfile);
            console.log("Điều kiện if:", !haveProfile);

            // Chuyển đổi giá trị từ localStorage sang boolean
            const hasProfile = haveProfile === 'true';
            //alert("Hãy cập nhật hồ sơ và xác thực tài khoản trước khi ứng tuyển");
            if (!hasProfile) {
                Swal.fire({
                    icon: 'info',
                    title: 'Thông báo',
                    text: 'Hãy cập nhật hồ sơ trước khi ứng tuyển!',
                }).then(() => {
                    navigate("/profile");
                });
                return;
            }
            
            const token = localStorage.getItem("token");
            console.log("Token:", token); // Kiểm tra giá trị token

            if (!token) {
                console.log("No token found, cannot fetch CVs.");
                setLoading(false);
                navigate("/login");
                return; // Không làm gì cả nếu không có token
            }

            try {
                const response = await axios.get(
                    "https://localhost:7077/api/Cvs/GetCvByUID",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCvs(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching CVs:", err);
                setError(err.message);
                setLoading(false);
            }
        };


        fetchCvs();
    }, []);

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
            fontSize: '2.3rem',
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
    };

    const handleApply = async (cvId) => {
        console.log("Button clicked for CV ID:", cvId);
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
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công!',
                    text: 'Ứng tuyển thành công!',
                }).then(() => navigate("/ViewAllJobApplied"));
            } else {
                setApplyStatus('Có lỗi xảy ra. Vui lòng thử lại.');
                Swal.fire({
                    icon: 'error',
                    title: 'Thất bại!',
                    text: 'Có lỗi xảy ra. Vui lòng thử lại.',
                });
            }
        } catch (err) {
            console.error("Error applying for job:", err);
            setApplyStatus('Bạn đã ứng tuyển, không thể ứng tuyển lại nữa.');
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo!',
                text: 'Bạn đã ứng tuyển, không thể ứng tuyển lại nữa.',
            });
        }
    };
    

    const handleNavigateToManagementCV = () => {
        navigate('/ManagementCV', {
            state: {
                from: `/ApplyJob/${job_id}`
            }
        });
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
            <div style={styles.container} >
                <h5 style={{ paddingTop: '50px' }}></h5>
                <h2 style={styles.title}>Chọn CV để ứng tuyển </h2>
                {applyStatus && <div style={styles.applyStatus}>{applyStatus}</div>}
                <div style={styles.cvItems}>
                    {cvs.map((cv, index) => (
                        <div key={cv.cvId} style={styles.cvItem}>
                            <h3 style={styles.cvItemTitle}> {cv.nameCv}</h3>
                            {cv.itemOfCvs.map(item => (
                                <div key={item.itemOfCvId} style={styles.cvDetail}>
                                    <h4 style={styles.cvDetailTitle}>{item.itemName}</h4>
                                    <p style={styles.cvDetailDescription}>{item.itemDescription}</p>
                                </div>
                            ))}
                            <button
                                style={styles.applyButton}
                                onClick={() => handleApply(cv.cvId)}
                            >
                                Ứng tuyển bằng CV này
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ paddingTop: '100px', paddingBottom: '100px' }}>
                    <h2 style={styles.title} >Chưa có cv? <a onClick={handleNavigateToManagementCV}>Tạo mới</a> </h2>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ApplyJob;
